Template.done.events = {
	'click a.button.success' : function(event){
		event.preventDefault();
		var checks = $('input:radio[name=pay-month]:checked').val();
		var make = $("#make-input").val();
		var rent = $("#rent-input").val();
		var utils = $("#utils-input").val();
		var age = $("#age-input").val();
		var zip = $("#location-input").val();
		
	}
}