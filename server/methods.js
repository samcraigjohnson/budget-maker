Meteor.methods({

	//num_checks, pay, _rent, _utils, _age, _location)
	//start game with question
	save_budget: function (moneyObj){
		moneyObj.user = Meteor.userId();
		UserData.insert(moneyObj);
		var budget = compute_budget(moneyObj);
		budget.user = Meteor.userId();
		Budgets.insert(budget, function(error, id){
			if(!error){
				make_expense(id, Meteor.userId());
			}
			else{
				console.log(error);
			}
		});
	},

	addExpense : function(amt, category, descr){
		var d = descr || " ";
		console.log(d);
		var spend_obj = { 
				amount: amt, 
				cat: category, 
				date: new Date(),
				description: d
			};
		Expenses.update({user: this.userId, active: true}, {$push : {spending: spend_obj}});
	},

	createExpenses: function(){
		var budj = Budgets.findOne({user: Meteor.userId()});
		make_expense(budj._id, Meteor.userId());
	},

	updateSpending: function(new_list){
		Expenses.update({user: this.userId, active:true}, {$set: {spending: new_list}});
	},

	addSavingsGoal : function(amount, duration, descr){
		SavingsGoals.insert({
			user: this.userId,
			active: true,
			goal: amount,
			months: duration,
			description: descr,
			saved: 0,
			date: new Date()
		});

		var save_per_month = Math.ceil(parseFloat(amount)/parseFloat(duration));

		var fun_and_trans = 0;
		//add save amount per month to the savings object in the budget
		var budj_cats = Budgets.findOne({user: this.userId}).cats;
		for(var i = 0; i<budj_cats.length; i++){
			if(budj_cats[i].name == "save"){
				budj_cats[i].cost += save_per_month;
			}
			else if(budj_cats[i].name == "trans" || budj_cats[i].name == "fun"){
				fun_and_trans += budj_cats[i].cost;
			}
		}

		if(save_per_month > fun_and_trans){
			return false;
		}

		Budgets.update({user: this.userId}, {$set: {cats: budj_cats}});
		return true;
	}

});

function make_expense(id, userId){
	Expenses.update({user: userId}, {$set: {active: false}}, {multi: true});
	//XXX ADD ADJUSTMENT OF BUDGET BASED ON SPENDING/SAVING
	var exps = Expenses.insert({
		user: userId,
		date: new Date(),
		spending: [],
		budj: id,
		active: true
	});
}

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
	food_obj.cost = parseInt(total * .128);
	return food_obj;
}

function compute_trans_obj(total, money){
	var trans_obj = {};
	trans_obj.name = "trans";
	trans_obj.cost = parseInt(total * .175);
	return trans_obj;
}

function compute_save_obj(total, money){
	var save_obj = {};
	save_obj.name = "save";
	save_obj.cost = parseInt(total * .01);
	return save_obj;
}


Meteor.publish("budget", function(){
	return Budgets.find({user: this.userId});
});

Meteor.publish("userData", function(){
	return UserData.find({user: this.userId});
});

Meteor.publish("savingsGoals", function(){
	return SavingsGoals.find({user: this.userId, active:true});
});

Meteor.publish("spending", function(){
	return Expenses.find({user: this.userId, active:true});
	
});
