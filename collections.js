Budgets = new Meteor.Collection('budgets');
UserData = new Meteor.Collection('userData');
Expenses = new Meteor.Collection('expenses');

/*Expenses.remove({});
Expenses.insert({
	username: "sam",
	date: new Date(),
	spending: {food:10,rent:15,fun:25,gas:50,bills:78}
});*/
//Expenses.update({username:"sam"}, {$set : {spending : {food:10,rent:15,fun:25,trans:50,bills:78}}});
//UserData.remove({});