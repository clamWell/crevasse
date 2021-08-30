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

var keepLine = 0;
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

    
    function makePath(line){
        var line = line || 1;
        console.log(line + "호선 그리기")
        keepLine = line;
        var st_data = new Array; 
        lineData.forEach(function(v,i,a){
            if(v.line == line && v.safe == "X"){
                st_data.push(v.station)
            }
        });
        console.log(st_data);
        $(".path-draw-canvas #path-start-decoo .number-box p").html(line);
        $(".path-draw-canvas #path-start-deco").removeClass();
        $(".path-draw-canvas #path-start-deco").addClass("deco0"+line)
        var svgWidth = (isMobile)? screenWidth: 1000;
        var svgHeight = 500; 
        var svgId = "PATH"
        $("#"+svgId).css({"width":svgWidth, "height":svgHeight});
        $("#"+svgId).html("");
        var curveWidth = 150; 
        var curveHeight = 50;
        var stationMargin = 100;
        var horizonWidth = svgWidth - (curveWidth*2);
        var stationMaxCount = horizonWidth / stationMargin;

        var _path = new String;
        var pathStart= "M 0 0 Q 0 "+curveHeight+" 150 "+curveHeight
        _path = pathStart + " L 850 "+curveHeight; //첫번째줄 직선
        _path = _path + " Q 1000 "+curveHeight+" 1000 "+ curveHeight*2; //첫번째줄 커브 
        //M 0 0 Q 0 100 150 100 L 700 100 Q 800 100 800 200 

        var floorLength = parseInt(st_data.length / stationMaxCount);        
        console.log(st_data.length, floorLength);
        if( floorLength > 0 ){
            console.log(floorLength+"개의 라인 그려야함");
            if( floorLength >= 1 ){
                _path = _path +  " Q 1000 "+curveHeight*3+" 850 "+ curveHeight*3
                _path = _path +  " L 150 "+curveHeight*3
            }
            if( floorLength >= 2){
                _path = _path +  " Q 0 "+curveHeight*3+" 0 "+ curveHeight*4
                _path = _path +  " Q 0 "+curveHeight*5+" 150 "+curveHeight*5
                _path = _path +  " L 850 " + curveHeight *5
            }
            if( floorLength >= 3){
               _path = _path +  " Q 1000 "+curveHeight*5+" 1000 "+ curveHeight*6
               _path = _path +  " Q 1000 "+curveHeight*7+" 850 "+curveHeight*7
               _path = _path +  " L 150 " + curveHeight *7
            } 
            if( floorLength >= 4){
               _path = _path +  " Q 0 "+curveHeight*7+" 0 "+ curveHeight*8
               _path = _path +  " Q 0 "+curveHeight*9+" 150 "+curveHeight*9
               _path = _path +  " L 850 " + curveHeight *9
            }
        }else{
            console.log("한줄 끝");
        } 
       console.log(_path)

        var tempPathObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        tempPathObj.setAttributeNS(null,"d", _path);
        tempPathObj.setAttributeNS(null,"class", "path pathAni path-line0"+line+" path-hide-f"+floorLength);
        
        
        var hideLength = 1200;
        var animatePath = document.querySelector(".pathAni")
        var animatePathLength = hideLength*(floorLength+1);
        animatePath.style.strokeDasharray = animatePathLength;
        animatePath.style.strokeDashoffset = animatePathLength;

        var duration = 70*(floorLength+1);
        var elapsed = 0;
        animate(elapsed);
        function animate(offset) {
            setTimeout(function(){
                elapsed++;
                if (elapsed > duration){ 
                    //elapsed = 0;
                    console.log("stop");
                }else{
                    animate((elapsed / duration) * animatePathLength);
                }  
            }, 10)
            animatePath.style.strokeDashoffset = animatePathLength-offset;
            //console.log(offset);
        }
        
        var makeXcor = function(i) {
            return (i % stationMaxCount) * 100;
        };
        var makeYcor = function(i) {
            return parseInt(i / stationMaxCount) *curveHeight*2
        };

        var station_holder= document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        station_holder.setAttributeNS(null,"class", "station-holder");
        station_holder.setAttributeNS(null,"transform", "translate(150, 50)");
        for(d=0;d<st_data.length;d++){
             var tempGroup =  station_holder.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
             tempGroup.setAttributeNS(null,"class", "station-group st-i-"+d+" st-line-"+line);
             tempGroup.setAttributeNS(null,"transform", "translate("+makeXcor(d)+","+makeYcor(d)+")");
             var tempCircle = tempGroup.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
             tempCircle.setAttributeNS(null,"class", "station-circle");
             var templabel= tempGroup.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
             templabel.innerHTML = st_data[d];
        }

     

    }
    //makePath();
    
    $("#METRO_BTN ul li").on("click", function(){
        var userC_line = $(this).attr("data-id");     
        userC_line = userC_line.replace("s_", ""); 
        makePath(userC_line);
    });

	function init(){
		
	};
    
    init();
	$(".loading-page").fadeOut(200, function(){
		$(".title-falling img").animate({"bottom":"0", "opacity":"1"}, 800, "easeOutBounce");
	});

    $(".station-name").on("click", function(){
        $(".crevasse").remove();
        var stationName = $(this).text();

        var defaultLine = "M 0 5 L 1000 5z";
        var tempPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        tempPathObj.setAttributeNS(null,"d", defaultLine);
        tempPathObj.setAttributeNS(null,"class", "crevasse");

        var st_info = new Array; 
        station_info.forEach(function(v,i,a){
            var tmpPath = "";
            if(v.line == keepLine && v.station == stationName) {
                var count = Object.keys(v["distance(mm)"]).length;
                var k = 0;
                for (var key in v["distance(mm)"]) { 
                    // console.log("key : " + key +", value : " + v["distance(mm)"][key]);
                    console.log(v["distance(mm)"][key]["distance"]);
                    if(k==0){
                        tmpPath = "M 0 " + v["distance(mm)"][key]["distance"];
                    } else {
                        tmpPath += " L " + 50*k + " " + v["distance(mm)"][key]["distance"];
                    }
                    k++;
                }
                var tempPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
                tempPathObj.setAttributeNS(null,"d", tmpPath);
                tempPathObj.setAttributeNS(null,"class", "crevasse");
            } else {
                tmpPath ="";
            }
            
        });
        
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
