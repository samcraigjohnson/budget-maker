var cats = ['fun', 'food', 'gas', 'bills', 'rent'];

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
Template.budgetProgress.gasSpending = function(){
	return getSpending('gas');
}
Template.budgetProgress.rentSpending = function(){
	return getSpending('rent');
}
Template.budgetProgress.billsSpending = function(){
	return getSpending('bills');
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

			$("#"+name+"-meter").width(width);
			return spending;
		}
	}
	return 0;
}