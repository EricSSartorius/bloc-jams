var forEach = function(pointsArray, callback){
	for(var i = 0; i < pointsArray.length; i++){
		callback(pointsArray[i]);
	}
}; 

// var numbers = [1,2,3]
// forEach(numbers, function(number){
//   console.log(number);
// });