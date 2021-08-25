var ieTest = false,
	screenWidth = $(window).width(),
	screenHeight = $(window).height(),
	imgURL = "http://img.khan.co.kr/spko/storytelling/2021/network/",
	isMobile = screenWidth <= 800 && true || false,
	isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
	isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	
window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}

function avoid100vh(){
	
	$(".loading-page").height(screenHeight);
	$(".ie-block").height(screenHeight);
}


/******** 모바일 전용 조정 ********/
if(isMobile==true){
	
}
/******** 모바일 전용 조정 ********/


$(function(){
	
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};
	$(window).resize(function() {
		screenWidth = $(window).width();
		checkIfProgressOverflow(screenWidth )
    });

	function checkIfProgressOverflow(sw){
		if(sw<1200){
			$(".fixed-navi").stop().animate({"opacity":"0.2", "z-index":"-1"}, 300);

		}else{
			$(".fixed-navi").stop().animate({"opacity":"1","z-index":"1"}, 300);
		}
	}

	$(".close-ie-block").on("click", function(){
		$(".ie-block-9").hide();
	})


    var ieUnder = false;
    function checkIe(){ 
        var word; 
        if (navigator.userAgent.indexOf("MSIE") >= 0) {
            console.log("ieUNDER 10");
            ieUnder = true;
            return true;
        }else {
            return false;
        }
    } 
    checkIe();


	function init(){
		
	};
    
    init();
	$(".loading-page").fadeOut(200, function(){
	
	});

});


function sendSns(s) {
  var url = encodeURIComponent(location.href),
	  txt = encodeURIComponent($("title").html());
  switch (s) {
    case 'facebook':
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
      break;
    case 'twitter':
      window.open('http://twitter.com/intent/tweet?text=' + txt + '&url=' + url);
      break;
  }
}
