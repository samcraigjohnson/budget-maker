Meteor.methods({

	//start game with question
	save_budget: function (num_checks, pay, _rent, _utils, _age, _location){
		UserData.insert(
		{
			user: this.userId, 
			checks_per_month : num_checks,
			income_per_check: pay,
			rent : _rent,
			utils : _utils,
			age : _age,
			location : _location
		});
	},
});


Meteor.publish("budget", function(){
	return Budgets.find({user: this.userId});
});

Meteor.publish("userData", function(){
	return UserData.find({user: this.userId})
});