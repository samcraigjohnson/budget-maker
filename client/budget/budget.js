var cats = ['fun', 'food', 'trans', 'bills', 'rent'];
var display = [
	{name: "Fun", id: "fun"},
	{name: "Food", id: "food"},
	{name: "Transportation", id: "trans"},
	{name: "Housing", id: "rent"},
	{name: "Bills", id: "bills"}
	];

Template.moneyDash.total = function (){
	if(Budgets.find({}).count() > 0){
		var budj = Budgets.findOne({});
		return budj.total - budj.save;
	}
}

Template.moneyDash.savings = function (){
	if(Budgets.find({}).count() > 0){
		var budj = Budgets.findOne({});
		return budj.save;
	}
}

Template.budgetProgress.budj = function (){
	if(Budgets.find({}).count() > 0){
		var budj = Budgets.findOne({});
		return budj;
	}
}

Template.budgetProgress.rendered = function(){
	_.each(cats, getSpending);
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
		var propName = id.substring(0, id.length-4);
		var expense = $("#expense-input").val();
		Meteor.call('addExpense', $("#expense-input").val(), propName, function(error){
			if(err){console.log(err);}
		});
		$("#drop1").slideToggle();
		$("#expense-input").val('')
		Session.set("lastChanged", propName);
	}

}

function getSpending(name){
	if(Budgets.find({}).count() > 0){
		var budj = Budgets.findOne({});
		if(Expenses.find({}).count() > 0){
			var exp = Expenses.findOne({});
			var spending = exp.spending[name];
			var total = budj[name];
			var width = (spending / total) * 100;
			width = String(parseInt(width)) + "%";
			console.log(name + ": " + spending);
			$("#"+name+"-meter").width(width);

			if(Session.get("lastChanged") == name){
				$("#"+name+"-row").effect("highlight", {color:"#B0B0B0"}, 2000);
			}
			return spending;
		}
		else{
			Meteor.call("createExpenses", function(err){
				if(err){console.log(err);}
			});
		}
	}
	return 0;
}