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

	addExpense : function(amt, category){
		var spend_obj = { amount: amt, cat: category };
		console.log(spend_obj);
		Expenses.update({user: this.userId, active: true}, {$push : {spending: spend_obj}});
	},

	createExpenses: function(){
		console.log("creating new expense");
		var budj = Budgets.findOne({user: this.userId});
		Expenses.update({user: this.userId}, {$set: {active: false}}, {multi: true});
		Expenses.insert({
			user: this.userId,
			date: new Date(),
			spending: [],
			budj: budj._id,
			active: true
		});

	}
});

function compute_budget(money){
	var budj = {};
	budj.total = money.checks * money.make;
	
	budj.cats = [];
	budj.cats.push(compute_food_obj(budj.total, money));
	budj.cats.push(compute_trans_obj(budj.total, money));
	budj.cats.push(compute_save_obj(budj.total, money));
	budj.cats.push({ name: "bills", cost: parseFloat(money.utils) });
	budj.cats.push({ name: "rent", cost: parseFloat(money.rent) });
	
	var left = budj.total;
	for(var i = 0; i < budj.cats.length; i++){
		left -= budj.cats[i].cost;
	}

	//if leftover money put in fun fund!
	var fun = { name: "fun" };
	if(left > 0){
		fun.cost = left;
	}
	else{
		fun.cost = 0;
	}
	budj.cats.push(fun);

	//log budj object
	console.log(budj);
	
	return budj;
}

function compute_food_obj(total, money){
	var food_obj = {};
	food_obj.name = "food";
	food_obj.cost = parseFloat(total * .13);
	return food_obj;
}

function compute_trans_obj(total, money){
	var food_obj = {};
	food_obj.name = "trans";
	food_obj.cost = parseFloat(total * .10);
	return food_obj;
}

function compute_save_obj(total, money){
	var food_obj = {};
	food_obj.name = "save";
	food_obj.cost = parseFloat(total * .10);
	return food_obj;
}


Meteor.publish("budget", function(){
	return Budgets.find({user: this.userId});
});

Meteor.publish("userData", function(){
	return UserData.find({user: this.userId});
});

Meteor.publish("spending", function(){
	return Expenses.find({user: this.userId, active:true});
	
});
