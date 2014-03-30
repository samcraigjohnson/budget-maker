var cats = ['fun', 'food', 'trans', 'bills', 'rent'];
var display = [
	{name: "Fun", id: "fun"},
	{name: "Food", id: "food"},
	{name: "Transportation", id: "trans"},
	{name: "Housing", id: "rent"},
	{name: "Bills", id: "bills"}
	];

Template.moneyDash.total = function (){
	if(Expenses.find({}).count() > 0){
		var exp = Expenses.findOne({});
		var budj = Budgets.findOne({});
		var budj_obj = getBudjObj();

		var spending = 0.0;
		var save = 0.0;

		for(var i = 0; i < exp.spending.length; i++){
			spending += parseFloat(exp.spending[i].amount);
		}

		var left = budj.total - spending - budj_obj.save;
		Session.set("left", left);

		return left;
	}
}

Template.budgetProgress.budj = function (){
	return getBudjObj();
}

Template.budgetProgress.rendered = function(){
	_.each(cats, getSpending);
	checkExpenses();
}

//fun stuff
Template.budgetProgress.funSpending = function(){
	return getSpending('fun');
}
Template.budgetProgress.funTransaction = function(){
	return getTransaction('fun');
}

//food stuff
Template.budgetProgress.foodSpending = function(){
	return getSpending('food');
}
Template.budgetProgress.foodTransaction = function(){
	return getTransaction('food');
}

//transportation stuff
Template.budgetProgress.transSpending = function(){
	return getSpending('trans');
}
Template.budgetProgress.transTransaction = function(){
	return getTransaction('trans');
}

//rent stuff
Template.budgetProgress.rentSpending = function(){
	return getSpending('rent');
}
Template.budgetProgress.rentTransaction = function(){
	return getTransaction('rent');
}

//bills stuff
Template.budgetProgress.billsSpending = function(){
	return getSpending('bills');
}
Template.budgetProgress.billsTransaction = function(){
	return getTransaction('bills');
}

Template.addExpense.category = function(){
	return display;
}


Template.saveProgress.savingsGoals = function(){
	var goals = [];
	var sGoals = SavingsGoals.find({}); 
	if(sGoals.count() > 0){
		sGoals.forEach(function(savingsObj){
			goals.push(savingsObj);
		});

		if(sGoals.count >= 3){
			$("#add-savings-goal").hide();
		}
	}

	return goals;
}

Template.addExpense.events = {

	'click a.cat-add' : function (event){
		event.preventDefault();
		var id = event.target.id
		var propName = $("#cats-dropdown").val();
		var expense = $("#expense-input").val();
		var descr = $("#descr-input").val();
		var valid = (expense.match(/^-?\d*(\.\d+)?$/));
		if (valid && expense != ''){
			Meteor.call('addExpense', expense, propName, descr, function(error){
				if(error){console.log(error);}
			});
		}
		else{
			//XXX add error message
		}

		$("#drop1").slideToggle();
		$("#expense-input").val('')
		$("#descr-input").val('');
		Session.set("lastChanged", propName);
	}

}

Template.budgetProgress.events = {
	'click div.prog-row' : function(event){
		event.preventDefault();
		$(event.target).closest('.prog-row').find(".settings-row").slideToggle();
	},

	'click a.delete-button' : function(event){
		event.preventDefault();
		var d_time = $(event.target).closest('tr').attr('id');
		var spending_list = Expenses.findOne({}).spending;

		for(var i=0; i<spending_list.length;i++){
			var check_time = spending_list[i].date.getTime();
			if(check_time == d_time){
				var removed = spending_list.splice(i, 1);
				break;
			}
		}
		Meteor.call("updateSpending", spending_list, function(err, result){
			if(err){console.log(err);}
		})
	}

}

//Event data for adding a savings goal
Template.savingsGoals.events = {
	'click a#add-savings-goal' : function(event){
		$("#savings-goal-form").slideToggle();
		$(event.target).toggle();
		//return false;
	},

	'click a#new-goal-button' : function(event){
		var descript = $("#savings-descr-input").val();
		var months = $("#savings-month-input").val();
		var value = $("#savings-input").val();

		Meteor.call("addSavingsGoal", value, months, descript, function(error, result){
			if(error) {console.log(error);}
			else if(!result){
				//deliver this better XXX
				alert("this goal is not feasible, please change amount or duration");
			}
		});
		$("#savings-goal-form").slideToggle();
		$("#add-savings-goal").toggle();
	}

}

Template.saveProgress.rendered = function(){
	if(SavingsGoals.find({}).count() > 0){
			var savings = SavingsGoals.find({});

			savings.forEach(function(goal){
				var width = (goal.saved / goal.goal) * 100;
				if (width < 0){
					width = 0;
				}
				else if(width > 100){
					width = 100;
				}
				width = String(parseInt(width)) + "%";
				$("#" + goal._id).find('.save-meter').width(width);
			});
	}
	
}

function getBudjObj(){
	if(Budgets.find({}).count() > 0){
		var budj_obj = {};
		var budj = Budgets.findOne({});
		for(var i = 0; i < budj.cats.length; i++){
			budj_obj[budj.cats[i].name] = budj.cats[i].cost; 
		}

		//readjust budget for savings
		if((budj_obj.fun * .80) > budj_obj.save){
			budj_obj.fun -= budj_obj.save;
		}
		else{
			budj_obj.fun -= (budj_obj.save * .85);
			budj_obj.trans -= (budj_obj.save * .15);
		}
		return budj_obj;
	}
}

function checkExpenses(){
	if(Expenses.find({}).count() > 0){
		var exp = Expenses.findOne({});
		var now = new Date();
		if(exp.date.getMonth() != now.getMonth()){
			console.log(exp.date.getMonth() +  " : " + now.getMonth());
			Meteor.call("createExpenses", function(err){
				if(err) { console.log(err); }
			})
		}

	}
}

function getTransaction(name){
	if(Expenses.find({}).count() > 0){
		var exp = Expenses.findOne({});
		var toReturn = []
		for (var i = exp.spending.length -1 ; i >= 0; i--){
			if(exp.spending[i].cat == name){
				var ob = exp.spending[i];
				ob.id = exp.spending[i].date.getTime();
				ob.date = ob.date.toDateString();
				toReturn.push(ob);
			}
		}

		return toReturn;
	}
}

function getSpending(name){
	if(Expenses.find({}).count() > 0){
		var exp = Expenses.findOne({});
		var budj_obj = getBudjObj();
		var spending = 0.0;

		//sum up all spending with name equal to the one given
		for(var i = 0; i < exp.spending.length; i++){
			if(exp.spending[i].cat === name){
				spending += parseFloat(exp.spending[i].amount);
			}
		}

		var total = budj_obj[name];

		//calculate progress width
		var width = (spending / total) * 100;
		
		//if width > 100 then make text red and progess bar 100%
		if(width > 100)
		{
			width=100;
			$("#"+name+"-row").find('.extra').addClass('spent').removeClass('extra');
		}

		if(width >= 50){
			$("#"+name+"-meter").css('background-color', '#FFB90F');
		}
		
		if(width >= 75){
			$("#"+name+"-meter").css('background-color', '#E3170D');
		}

		//set progress bar width
		width = String(parseInt(width)) + "%";
		$("#"+name+"-meter").width(width);

		//highlight category that has changed
		if(Session.get("lastChanged") == name){
			$("#"+name+"-row").effect("highlight", {color:"#B0B0B0"}, 2000);
		}
		return spending;
	}
	console.log("no expens")
}