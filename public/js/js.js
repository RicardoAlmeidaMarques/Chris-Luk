// $(document).ready(function(){


//   $('.projectShowcase').on("click", ".thumbnail", function() {
//       var source = $(this).attr('data-source');
//       $target=$('.mediaWrapper *[data-source="' + source + '"]');
//       $('html,body').animate({
//         scrollTop: ($target.offset().top)-229
//       },1000);
//       $(this).addClass('active');
//       $(this).siblings().removeClass('active');
//     });



//   var css={};

//   $(window).scroll(function(){
//     var distance=$(this).scrollTop();
//     css['top']=distance;
//     $('.infoWrapper').css(css);
//     $('.projectControls').css(css);
//   });
 

//   var page = $('body');
//   $(window).mousewheel(function(event, delta, deltaX, deltaY){
//       if (delta < 0) page.scrollTop(page.scrollTop() + 120);
//       else if (delta > 0) page.scrollTop(page.scrollTop() - 120);
//       return false;
//   })




// });



// function fixedDiv(div){
//   console.log('hi');
//   $(div).offset({top:50});
// }
