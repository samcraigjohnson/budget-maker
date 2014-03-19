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
			if(exp.spending[i].cat != "save"){
				spending += parseFloat(exp.spending[i].amount);
			}
		}

		var left = budj.total - spending - budj_obj.save;
		Session.set("left", left);

		return left;
	}
}

Template.moneyDash.savings = function (){
	if(Budgets.find({}).count() > 0){
		var budj = Budgets.findOne({});
		return budj.save;
	}
}

Template.budgetProgress.budj = function (){
	return getBudjObj();
}

Template.budgetProgress.rendered = function(){
	_.each(cats, getSpending);
	saveMeter();
	checkExpenses();
}

Template.budgetProgress.funSpending = function(){
	return getSpending('fun');
}
Template.budgetProgress.foodSpending = function(){
	return getSpending('food');
}
Template.budgetProgress.transSpending = function(){
	return getSpending('trans');
}
Template.budgetProgress.rentSpending = function(){
	return getSpending('rent');
}
Template.budgetProgress.billsSpending = function(){
	return getSpending('bills');
}

Template.budgetProgress.saveSpending = function(){
	return saveMeter();
}

Template.addExpense.category = function(){
	return display;
}

Template.addExpense.events = {
	'click a#addBtn' : function (event){
		event.preventDefault();
		$("#drop1").slideToggle();
	},

	'click a.cat-add' : function (event){
		event.preventDefault();
		var id = event.target.id
		var propName = $("#cats-dropdown").val();
		var expense = $("#expense-input").val();
		var valid = (expense.match(/^-?\d*(\.\d+)?$/));
		if (valid){
			Meteor.call('addExpense', $("#expense-input").val(), propName, function(error){
				if(error){console.log(error);}
			});
		}

		$("#drop1").slideToggle();
		$("#expense-input").val('')
		Session.set("lastChanged", propName);
	}

}

function getBudjObj(){
	if(Budgets.find({}).count() > 0){
		var budj_obj = {};
		var budj = Budgets.findOne({});
		for(var i = 0; i < budj.cats.length; i++){
			budj_obj[budj.cats[i].name] = budj.cats[i].cost; 
		}
		return budj_obj;
	}
}

function saveMeter(){
	if(Expenses.find({}).count() > 0){
			var exp = Expenses.findOne({});
			var budj = getBudjObj();

			var savings =  parseFloat(budj.save) + parseFloat(Session.get("left"));

			var width = (savings / budj.save) * 100;
			if (width < 0){
				width = 0;
				$("#save-row").find('.extra').addClass('spent').removeClass('extra');
			}
			else if(width > 100){
				width = 100;
			}

			width = String(parseInt(width)) + "%";
			$("#save-meter").width(width);

			return savings;
	}
	
}

function checkExpenses(){
	if(Expenses.find({}).count() == 0){
		console.log("creating new..");
		Meteor.call("createExpenses", function(err){
			if(err) { console.log(err); }
		})
	}
	else{
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

function getSpending(name){
	if(Expenses.find({}).count() > 0){
		var exp = Expenses.findOne({});
		var budj = Budgets.findOne({});
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

		//set progress bar width
		width = String(parseInt(width)) + "%";
		$("#"+name+"-meter").width(width);

		//highlight category that has changed
		if(Session.get("lastChanged") == name){
			$("#"+name+"-row").effect("highlight", {color:"#B0B0B0"}, 2000);
		}

		return spending;
	}
}