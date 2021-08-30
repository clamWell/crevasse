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
        $(".path-draw-canvas .number-box p").html(line);
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
			 templabel.setAttributeNS(null,"transform", "translate(0, -12)");
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

	var signPath = "M17.1,16.3c-0.7-1.2-1.4-2.4-2.1-3.6c-0.3-0.5-0.7-0.7-1.3-0.7c-1.7,0-3.4,0-5.2,0c-0.1,0-0.2,0-0.3,0c0-0.6,0-1.1,0-1.7c0.1,0,0.2,0,0.2,0c1.2,0,2.4,0,3.8,0c0.5,0,0.8-0.2,1-0.7c0.2-0.7-0.2-1.4-1-1.4c-1.3,0-2.6,0-3.9,0c-0.1,0-0.2,0-0.2,0C8,7.8,8,7.4,7.9,7C8,6.4,8,5.8,7.7,5.2C7.3,4.8,6.9,4.5,6.5,4.3C6.7,4.2,6.9,4.2,7.1,4C7.8,3.5,8,2.7,7.9,1.9C7.8,1.5,7.6,1.1,7.3,0.7C6.9,0.3,6.5,0.2,6,0C5.8,0,5.6,0,5.4,0C5.1,0.1,5,0.2,4.8,0.2c-0.7,0.3-1.2,1-1.4,1.7c-0.1,0.5,0,1.1,0.3,1.5c0.3,0.5,0.7,0.8,1.2,1C4,4.8,3.6,5.7,3.7,6.7c0,0.6,0.1,1.1,0.1,1.6C3.3,8.6,2.9,8.9,2.6,9.2c0,0,0,0-0.1,0.1c-1.1,1.1-2,2.4-2.3,4c-0.1,0.4-0.2,0.9-0.2,1.4c0,0.5,0,0.9,0,1.3c0.1,0.5,0.2,0.9,0.2,1.4c0.4,1.6,1.2,3,2.4,4.2c0.8,0.7,1.7,1.3,2.8,1.7c0.7,0.2,1.5,0.4,2.3,0.5h0.1c0.4,0,0.9,0,1.3,0c0.2-0.1,0.5-0.1,0.8-0.2c1.1-0.2,2-0.6,2.9-1.1c0.1-0.1,0.2-0.2,0.3-0.2c1.1-0.8,2-1.8,2.7-3c0.2,0.4,0.5,0.8,0.7,1.2c0.3,0.7,1.2,0.8,1.9,0.5c0.3-0.2,0.4-0.5,0.6-0.8c0-0.2,0-0.3,0-0.6c-0.1-0.1-0.1-0.2-0.2-0.2C18.3,18.3,17.7,17.3,17.1,16.3z M14.1,18.8c-0.1,0.2-0.2,0.3-0.3,0.4c-0.6,0.8-1.3,1.5-2.1,2c-0.5,0.3-1.1,0.5-1.7,0.7c-1.2,0.3-2.4,0.2-3.7-0.1c-1.1-0.3-2.1-1-2.9-1.9C2.6,19,2.1,18.1,1.8,17c-0.4-1.6-0.2-3,0.4-4.4c0.3-0.8,0.9-1.5,1.5-2l0,0v0.1c0.1,1,0.1,1.9,0.2,2.9c0,0.4,0.2,0.8,0.5,1.1c0.5,0.6,1.1,0.8,1.9,0.8c2.3,0,4.6,0,6.9,0c0.2,0,0.4,0.1,0.5,0.2c0.3,0.5,0.6,1.1,0.9,1.6c0.1,0.1,0.1,0.2,0.2,0.2C14.6,17.9,14.4,18.4,14.1,18.8z";

    $(".station-name").on("click", function(){
        $(".crevasse").remove();
        var stationName = $(this).text();
		var svgWidth = 1000;
		$("#CREVASSE").css({"width":svgWidth});
        var defaultLine = "M 0 -1 L "+svgWidth+" -1z";
        var defaultPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        defaultPathObj.setAttributeNS(null,"d", defaultLine);
        defaultPathObj.setAttributeNS(null,"class", "default-line");
		
		var defaultTextObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
		defaultTextObj.innerHTML = "열차 위치";
		defaultTextObj.setAttributeNS(null,"transform", "translate(-30,0)");
		defaultTextObj.setAttributeNS(null, "class", "defalut-text");
		
		var descPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		descPathObj.setAttributeNS(null,"d", "M 0 100 L 1000 100z");
		descPathObj.setAttributeNS(null,"class", "desc-path");

		var descTextObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
		descTextObj.innerHTML = "100mm";
		descTextObj.setAttributeNS(null,"transform", "translate(-30,105)");
		descTextObj.setAttributeNS(null, "class", "desc-text");

        var st_info = new Array; 
        station_info.forEach(function(v,i,a){
            var tmpPath = "";
			var sang;
            if(v.line == keepLine && v.station == stationName) {
                var count = Object.keys(v["entrances_up"]).length;
				//console.log(count);
				sang = svgWidth/(count-1);
				console.log(sang);
                var k = 0;
                for (var key in v["entrances_up"]) { 
                    // console.log("key : " + key +", value : " + v["entrances_up"][key]);
                    console.log(v["entrances_up"][key]["distance(mm)"]);
                    if(k==0){
                        tmpPath = "M 0 " + v["entrances_up"][key]["distance(mm)"];
                    } else {
                        tmpPath += " L " + sang*k + " " + v["entrances_up"][key]["distance(mm)"];
                    }
					//if( key.slice(-1) == "1" || key.slice(-1) == "3" ){
					if( key.slice(-1) == "1"){
						var tempTextObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
						tempTextObj.innerHTML = key;
						tempTextObj.setAttributeNS(null,"transform", "translate("+ sang*k+","+(v["entrances_up"][key]["distance(mm)"]+15)+")");
						tempTextObj.setAttributeNS(null, "class", "platform-number");
					}
					
					if( v["entrances_up"][key]["wheel_enter"] =="*"){
						var signLogoObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
						signLogoObj.setAttributeNS(null,"d", signPath);
						signLogoObj.setAttributeNS(null,"transform", "translate("+ (sang*k-8)+",-37)");
						signLogoObj.setAttributeNS(null, "class", "sign");

						var signPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
						signPathObj.setAttributeNS(null,"d", "M "+sang*k+" 0 L "+sang*k+" "+v["entrances_up"][key]["distance(mm)"]);
						signPathObj.setAttributeNS(null, "class", "signPath");
					}

					k++;
					
			
                }
                var tempPathObj = document.getElementById("CREVASSE").appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
                tempPathObj.setAttributeNS(null,"d", tmpPath);
                tempPathObj.setAttributeNS(null,"class", "crevasse crevasse-line0"+keepLine);

            } else {
                tmpPath ="";
            }
            
        });
        
    });
	$(".station-group").on("click", function(){
	
	
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
