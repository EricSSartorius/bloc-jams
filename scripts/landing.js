

  var animatePoints = function() {
     //Animates points           
    var revealPoint = function() {
        $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
     };
    $.each($('.point'), revealPoint);
};
 

 $(window).load(function() {

    var pointsArray = document.getElementsByClassName('point');

    // Automatically animates the points on a tall screen where scrolling can't trigger the animation
      if ($(window).height() > 950) {
         animatePoints();
     }

    //Automatically animates points once the screen scrolls to their position
      $(window).scroll(function(event) {

            if ($(window).scrollTop() >= 400) {
             animatePoints();
         }
     });

 });