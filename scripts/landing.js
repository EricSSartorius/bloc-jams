

 var animatePoints = function(points) {
     //Animates points           
     var revealPoint = function(point){
            point.style.opacity = 1;
            point.style.transform = "scaleX(1) translateY(0)";
            point.style.msTransform = "scaleX(1) translateY(0)";
            point.style.WebkitTransform = "scaleX(1) translateY(0)";  
    };
    Array.prototype.forEach.call(points, revealPoint); 
};
 

 window.onload = function() {

    var pointsArray = document.getElementsByClassName('point');

    // Automatically animates the points on a tall screen where scrolling can't trigger the animation
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }

    //Automatically animates points once the screen scrolls to their position
     window.addEventListener("scroll", function(event) {

         if (pointsArray[0].getBoundingClientRect().top <= 500) {
             animatePoints(pointsArray);
         }
     });

 }