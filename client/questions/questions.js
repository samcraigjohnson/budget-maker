
var order = ["#hello", "#paid", "#made", "#rent", "#utils"];
var curr_ind = 0;

Template.done.events = {
	'click a.button.success' : function(event){
		event.preventDefault();
		var moneyObj = {};
		moneyObj.checks = $('input:radio[name=pay-month]:checked').val();
		moneyObj.make = $("#make-input").val();
		moneyObj.rent = $("#rent-input").val();
		moneyObj.utils = $("#utils-input").val();
		//moneyObj.age = $("#age-input").val();
		//moneyObj.zip = $("#location-input").val();
		
		Meteor.call("save_budget", moneyObj, function(err, result){
			if(err){console.log(err);}
		});
	}
}

Template.next.events = {
	'click a.button.default' : function(event){
		event.preventDefault();
		$(order[curr_ind]).addClass("hidden");
		curr_ind++;
		$(order[curr_ind]).removeClass("hidden");
	}

}