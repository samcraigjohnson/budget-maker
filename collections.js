Budgets = new Meteor.Collection('budgets');
UserData = new Meteor.Collection('userData');
Expenses = new Meteor.Collection('expenses');

/*Expenses.remove({});
Expenses.insert({
	username: "sam",
	date: new Date(),
	spending: {food:10,rent:15,fun:25,gas:50,bills:78}
});*/
Expenses.update({username:"Allison"}, {$set : {spending : {food:0,rent:0,fun:0,trans:0,bills:0}}});
//UserData.remove({});