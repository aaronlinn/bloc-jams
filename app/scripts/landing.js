$(document).ready(function() {
  $('.hero-content h3').click(function() {
    console.log('hello!');
    subText = $(this).text();
    $(this).text(subText + "!");
  });

  var onHoverAction = function(event) {
    console.log('Hover action triggered.');
    $(this).animate({'margin-top': '10px'});
  };

  var offHoverAction = function(event) {
    console.log('Off-hover action triggered.');
    $(this).animate({'margin-top': '0'});
  };

  $('.selling-points .point').hover(onHoverAction, offHoverAction);
});