Budgets = new Meteor.Collection('budgets');
UserData = new Meteor.Collection('userData');
Expenses = new Meteor.Collection('expenses');
SavingsGoals = new Meteor.Collection('savingsGoals');


/*
	Budgets : {
		user: _id
		total: all the money
		cats: [{ name: "food", cost: 2000}, 
				{trans}, 
				{rent}, 
				{save}, 
				{bills},
				{fun}]
	}
*/
/*Expenses.remove({user: "SpGPXm6i4cTb5wd6E"});
Budgets.remove({user: "SpGPXm6i4cTb5wd6E"});
UserData.remove({user: "SpGPXm6i4cTb5wd6E"});
SavingsGoals.remove({user: "SpGPXm6i4cTb5wd6E"});*/


/*Expenses.insert({
	user: "SpGPXm6i4cTb5wd6E",
	date: new Date(),
	spending: [],
	budj: Budgets.findOne({user: "SpGPXm6i4cTb5wd6E"})._id,
	active: true
});*/

//Expenses.update({username:"sam"}, {$set : {spending : {food:0,rent:0,fun:0,trans:0,bills:0}}});
//Expenses.update({username:"sam"}, {$set : {budj: Budgets.findOne({user: Meteor.users.findOne({username:"sam"})._id})}});
//Expenses.update({username:"Allison"}, {$set : {budj: Budgets.findOne({user: Meteor.users.findOne({username:"Allison"})._id})}});
//UserData.remove({});
