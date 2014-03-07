Template.structure.firstTime = function(){
	return UserData.find({}).count() == 0;
}