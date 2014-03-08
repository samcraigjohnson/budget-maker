Meteor.methods({

	//num_checks, pay, _rent, _utils, _age, _location)
	//start game with question
	save_budget: function (moneyObj){
		moneyObj.user = this.userId;
		UserData.insert(moneyObj);
		var budget = compute_budget(moneyObj);
		budget.user = this.userId;
		Budgets.insert(budget);
	},
});

function compute_budget(money){
	var budj = {}
	budj.total = money.checks * money.make
	budj.food = budj.total * .13;
	budj.trans = budj.total * .10;
	budj.save = budj.total * .10;
	budj.bills = parseInt(money.utils);
	budj.rent = parseInt(money.rent);
	var left = budj.total - budj.food - budj.bills - budj.rent - budj.trans - budj.save;
	if(left > 0){
		budj.fun = left;
	}
	else{
		budj.fun = 0;
	}
	console.log(budj);
	return budj;
}

Meteor.publish("budget", function(){
	return Budgets.find({user: this.userId});
});

Meteor.publish("userData", function(){
	return UserData.find({user: this.userId});
});

Meteor.publish("spending", function(){
	if(Meteor.users.findOne({_id: this.userId}) != null){
		return Expenses.find({username: Meteor.users.findOne({_id:this.userId}).username});
	}
});