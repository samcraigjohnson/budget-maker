Template.moneyDash.total = function (){
	if(Budgets.find({}).count() > 0)
		var budj = Budgets.findOne({});
		return budj.total - budj.save;
}

Template.moneyDash.savings = function (){
	if(Budgets.find({}).count() > 0)
		var budj = Budgets.findOne({});
		return budj.save;
}