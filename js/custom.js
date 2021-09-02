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

	function getStationCode(line, station){
		var code; 
		station_info.forEach(function(v,i,a){
			if(line ==v.line &&station== v.station ){
				//console.log(v.id);
				code = v.id;
			}
		})
		return code; 
	};

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
        $(".path-draw-canvas .number-box p").html(line+"호선");
        $(".path-draw-canvas #path-start-deco").removeClass();
        $(".path-draw-canvas #path-start-deco").addClass("deco0"+line)
        var svgWidth = (isMobile)? screenWidth: 1000;
        var svgHeight = 500; 
        var svgId = "PATH"
        $("#"+svgId).css({"width":svgWidth});
        $("#"+svgId).html("");
        var curveWidth = 150; 
        var curveHeight = 50;
        var stationMargin = 100;
        var horizonWidth = svgWidth - (curveWidth*2);
        var stationMaxCount = (horizonWidth / stationMargin)+1;
		//console.log(stationMaxCount);

        var _path = new String;
        var pathStart= "M 0 0 Q 0 "+curveHeight+" 150 "+curveHeight
        _path = pathStart + " L 850 "+curveHeight; //첫번째줄 직선
        _path = _path + " Q 1000 "+curveHeight+" 1000 "+ curveHeight*2; //첫번째줄 커브 
        //M 0 0 Q 0 100 150 100 L 700 100 Q 800 100 800 200 

        var floorLength = Math.ceil(st_data.length / stationMaxCount);        
       // console.log(st_data.length, floorLength);
        if( floorLength > 0 ){
           // console.log(floorLength+"개의 라인 그려야함");
            if( floorLength > 1 ){
                _path = _path +  " Q 1000 "+curveHeight*3+" 850 "+ curveHeight*3
                _path = _path +  " L 150 "+curveHeight*3
            }
            if( floorLength > 2){
                _path = _path +  " Q 0 "+curveHeight*3+" 0 "+ curveHeight*4
                _path = _path +  " Q 0 "+curveHeight*5+" 150 "+curveHeight*5
                _path = _path +  " L 850 " + curveHeight *5
            }
            if( floorLength > 3){
               _path = _path +  " Q 1000 "+curveHeight*5+" 1000 "+ curveHeight*6
               _path = _path +  " Q 1000 "+curveHeight*7+" 850 "+curveHeight*7
               _path = _path +  " L 150 " + curveHeight *7
            } 
            if( floorLength > 4){
               _path = _path +  " Q 0 "+curveHeight*7+" 0 "+ curveHeight*8
               _path = _path +  " Q 0 "+curveHeight*9+" 150 "+curveHeight*9
               _path = _path +  " L 850 " + curveHeight *9
            }
			$("#"+svgId).css({"height":(curveHeight*(floorLength)*2)+"px"});
        }else{
           // console.log("한줄 끝");
        } 
      // console.log(_path)

        var tempPathObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        tempPathObj.setAttributeNS(null,"d", _path);
        tempPathObj.setAttributeNS(null,"class", "path pathAni path-line0"+line+" path-hide-f"+floorLength);
        
        
        var hideLength = 1200;
        var animatePath = document.querySelector(".pathAni")
        var animatePathLength = hideLength*(floorLength+1);
        animatePath.style.strokeDasharray = animatePathLength;
        animatePath.style.strokeDashoffset = animatePathLength;

        var duration = 50*(floorLength+1);
        var elapsed = 0;
        animate(elapsed);
        function animate(offset) {
            setTimeout(function(){
                elapsed++;
                if (elapsed > duration){ 
                    //elapsed = 0;
                   // console.log("stop");
                }else{
                    animate((elapsed / duration) * animatePathLength);
                }  
            }, 10)
            animatePath.style.strokeDashoffset = animatePathLength-offset;
            //console.log(offset);
        }
        
        var makeXcor = function(i) {
			if ( (parseInt(i / stationMaxCount)%2) == 1){
				return  700-((i % stationMaxCount) * 100);
			}else{
				return (i % stationMaxCount) * 100;
			}
        };
        var makeYcor = function(i) {
            return parseInt(i / stationMaxCount) *curveHeight*2
        };

        var station_holder= document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        station_holder.setAttributeNS(null,"class", "station-holder");
        station_holder.setAttributeNS(null,"transform", "translate(150, 50)");
        for(d=0;d<st_data.length;d++){
			 var stationStr= st_data[d];
			 var code = getStationCode(line, stationStr);
             var tempGroup =  station_holder.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
             tempGroup.setAttributeNS(null,"class", "station-group st-i-"+d+" st-line-"+line);
             tempGroup.setAttributeNS(null,"transform", "translate("+makeXcor(d)+","+makeYcor(d)+")");
			 tempGroup.setAttributeNS(null,"data-st-code", code);
             var tempCircle = tempGroup.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
             tempCircle.setAttributeNS(null,"class", "station-circle");
             var templabel= tempGroup.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
             templabel.innerHTML = stationStr;
			 templabel.setAttributeNS(null,"transform", "translate(0, -12)");
        }
		
		$(".station-group").each( function(v,i,a){
			var idx = $(this).index();
			$(this).delay(50*idx).animate({"opacity":"1"}, 500, "swing");
		});

		$(".station-group").on("click", function(){
			//console.log( $(this).attr("data-st-code"));
			var code = $(this).attr("data-st-code");
			var count_accident = 0;
			nowStation = code;
			count_accident = drawCrevassePath(code, "up", count_accident);
			count_accident = drawCrevassePath(code, "down", count_accident);
            $(".detail-accidents").html("총 "+ count_accident +"번");
			$(".station-info-holder").show();
			var movePos = $(".station-info-holder").offset().top;
			$("html, body").animate({scrollTop: movePos-70},1200, "easeOutCubic");
		});



    }

    
	var nowMetroLine;
	var nowStationCode;
	var nowStationData;

    $("#METRO_BTN ul li").on("click", function(){
		resetStationInfo();
        var userC_line = $(this).attr("data-id");    
        userC_line = userC_line.replace("s_", ""); 
		nowMetroLine = userC_line;
        makePath(userC_line);
    });

	function init(){
		activataTw();
	};
    
    init();
	$(".loading-page").fadeOut(200, function(){
		$(".title-falling img").animate({"bottom":"0", "opacity":"1"}, 800, "easeOutBounce");
	});

	var signPath = "M17.1,16.3c-0.7-1.2-1.4-2.4-2.1-3.6c-0.3-0.5-0.7-0.7-1.3-0.7c-1.7,0-3.4,0-5.2,0c-0.1,0-0.2,0-0.3,0c0-0.6,0-1.1,0-1.7c0.1,0,0.2,0,0.2,0c1.2,0,2.4,0,3.8,0c0.5,0,0.8-0.2,1-0.7c0.2-0.7-0.2-1.4-1-1.4c-1.3,0-2.6,0-3.9,0c-0.1,0-0.2,0-0.2,0C8,7.8,8,7.4,7.9,7C8,6.4,8,5.8,7.7,5.2C7.3,4.8,6.9,4.5,6.5,4.3C6.7,4.2,6.9,4.2,7.1,4C7.8,3.5,8,2.7,7.9,1.9C7.8,1.5,7.6,1.1,7.3,0.7C6.9,0.3,6.5,0.2,6,0C5.8,0,5.6,0,5.4,0C5.1,0.1,5,0.2,4.8,0.2c-0.7,0.3-1.2,1-1.4,1.7c-0.1,0.5,0,1.1,0.3,1.5c0.3,0.5,0.7,0.8,1.2,1C4,4.8,3.6,5.7,3.7,6.7c0,0.6,0.1,1.1,0.1,1.6C3.3,8.6,2.9,8.9,2.6,9.2c0,0,0,0-0.1,0.1c-1.1,1.1-2,2.4-2.3,4c-0.1,0.4-0.2,0.9-0.2,1.4c0,0.5,0,0.9,0,1.3c0.1,0.5,0.2,0.9,0.2,1.4c0.4,1.6,1.2,3,2.4,4.2c0.8,0.7,1.7,1.3,2.8,1.7c0.7,0.2,1.5,0.4,2.3,0.5h0.1c0.4,0,0.9,0,1.3,0c0.2-0.1,0.5-0.1,0.8-0.2c1.1-0.2,2-0.6,2.9-1.1c0.1-0.1,0.2-0.2,0.3-0.2c1.1-0.8,2-1.8,2.7-3c0.2,0.4,0.5,0.8,0.7,1.2c0.3,0.7,1.2,0.8,1.9,0.5c0.3-0.2,0.4-0.5,0.6-0.8c0-0.2,0-0.3,0-0.6c-0.1-0.1-0.1-0.2-0.2-0.2C18.3,18.3,17.7,17.3,17.1,16.3z M14.1,18.8c-0.1,0.2-0.2,0.3-0.3,0.4c-0.6,0.8-1.3,1.5-2.1,2c-0.5,0.3-1.1,0.5-1.7,0.7c-1.2,0.3-2.4,0.2-3.7-0.1c-1.1-0.3-2.1-1-2.9-1.9C2.6,19,2.1,18.1,1.8,17c-0.4-1.6-0.2-3,0.4-4.4c0.3-0.8,0.9-1.5,1.5-2l0,0v0.1c0.1,1,0.1,1.9,0.2,2.9c0,0.4,0.2,0.8,0.5,1.1c0.5,0.6,1.1,0.8,1.9,0.8c2.3,0,4.6,0,6.9,0c0.2,0,0.4,0.1,0.5,0.2c0.3,0.5,0.6,1.1,0.9,1.6c0.1,0.1,0.1,0.2,0.2,0.2C14.6,17.9,14.4,18.4,14.1,18.8z";

	var dir_name = [["소요산행","인천행"], ["내선: 시계방향", "외선: 반시계방향"],["대화행","오금행"], ["당고개행","남태령행"],["방화행", "하남검단산, 마천행"], ["신내행","응암행"],["장암행", "부평구청행"],["암사행", "모란행"], ["개화행", "중앙보훈병원행"]];

	function drawCrevassePath(stationId, dir, count_accident){
		var stationId = stationId || 1;
		var svgId;
		var keyStr; 
		if( dir=="up"){
			svgId = "CREVASSE_UP";
			keyStr = "entrances_up";
			$("#"+svgId).siblings("h4").find("span.dir").html(dir_name[nowMetroLine-1][0]);
		}else if(dir=="down"){
			svgId = "CREVASSE_DOWN";
			keyStr = "entrances_down";;
			$("#"+svgId).siblings("h4").find("span.dir").html(dir_name[nowMetroLine-1][1]);
		}


        $("#"+svgId).html("");
        var stationName = $(this).text();
		
		var svgWidth = 1000;
		 $("#"+svgId).css({"width":svgWidth});

        var defaultLine = "M 0 0 L "+svgWidth+" 0z";
        var defaultPathObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        defaultPathObj.setAttributeNS(null,"d", defaultLine);
        defaultPathObj.setAttributeNS(null,"class", "default-line");
		
		var defaultTextObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
		defaultTextObj.innerHTML = "열차 위치";
		defaultTextObj.setAttributeNS(null,"transform", "translate(-30,0)");
		defaultTextObj.setAttributeNS(null, "class", "defalut-text");
		
		var descPathObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		descPathObj.setAttributeNS(null,"d", "M 0 100 L 1000 100z");
		descPathObj.setAttributeNS(null,"class", "desc-path");

		var descTextObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
		descTextObj.innerHTML = "100mm";
		descTextObj.setAttributeNS(null,"transform", "translate(-30,105)");
		descTextObj.setAttributeNS(null, "class", "desc-text");

        var crevassePolyObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        crevassePolyObj.setAttributeNS(null,"class", "crevasse-poly-holder");

		var accCircleObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		accCircleObj.setAttributeNS(null,"class", "acc-circle-holder");

		var mainPathHolderObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		mainPathHolderObj.setAttributeNS(null,"class", "main-path-holder");

		var platformHolderObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		platformHolderObj.setAttributeNS(null,"class", "platform-holder");

		var labelHolderObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
		labelHolderObj.setAttributeNS(null,"class", "label-holder");

        var st_info = new Array; 
		var max_dist = 0;
        station_info.forEach(function(v,i,a){
            var tmpPath = "";
			var sang;
            if(v.id == stationId ) {
				nowStationData = v;
                var count = Object.keys(v[keyStr]).length;
				if(count == 0 ){
					//console.log("해당 플랫폼 없음")
					var tempTextObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
					tempTextObj.innerHTML = "해당 역은 순환선으로 단일 승강장으로 운영";
					tempTextObj.setAttributeNS(null,"transform", "translate("+ svgWidth/2+",60)");
					tempTextObj.setAttributeNS(null, "class", "no-path-desc");

				}else {
					sang = svgWidth/(count-1);
					//console.log(sang);
					var k = 0;
					var polygonLine = "1000,0 0,0 ";
					for (var key in v[keyStr]) { 
						if(k==0){
							tmpPath = "M 0 " + v[keyStr][key]["distance(mm)"];
						} else {
							tmpPath += " L " + sang*k + " " + v[keyStr][key]["distance(mm)"];
						}
						if (v[keyStr][key]["distance(mm)"] > max_dist) {
                            max_dist = v[keyStr][key]["distance(mm)"];
                        }

						//if( key.slice(-1) == "1" || key.slice(-1) == "3" ){
						
						if( key.slice(-1) == "1"){
							var tempTextObj = labelHolderObj.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
							tempTextObj.innerHTML = key;
							tempTextObj.setAttributeNS(null,"transform", "translate("+ sang*k+","+(v[keyStr][key]["distance(mm)"]+15)+")");
							tempTextObj.setAttributeNS(null, "class", "platform-number");
						}

						
						var tempPlatformObj = platformHolderObj.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
						tempPlatformObj.setAttributeNS(null,"cx", sang*k);
						tempPlatformObj.setAttributeNS(null,"cy", v[keyStr][key]["distance(mm)"]);
						tempPlatformObj.setAttributeNS(null,"r", "5");
						tempPlatformObj.setAttributeNS(null, "class", "platformCircle");
						tempPlatformObj.setAttributeNS(null, "data-platform", key);
						
						if( v[keyStr][key]["wheel_enter"] =="*"){
							var signLogoObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
							signLogoObj.setAttributeNS(null,"d", signPath);
							signLogoObj.setAttributeNS(null,"transform", "translate("+ (sang*k-8)+",-37)");
							signLogoObj.setAttributeNS(null, "class", "sign");

							var signPathObj = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
							signPathObj.setAttributeNS(null,"d", "M "+sang*k+" 0 L "+sang*k+" "+v[keyStr][key]["distance(mm)"]);
							signPathObj.setAttributeNS(null, "class", "signPath");
						}
						if(v[keyStr][key]["accidents"] >= 1) {
							var accidentObj = accCircleObj.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
							if(v[keyStr][key]["accidents"] == 1) {
								radius = 8;
							}else if( v[keyStr][key]["accidents"] == 2){
								//radius = 12;
								radius = Math.sqrt(128);
							}else if( v[keyStr][key]["accidents"] == 3){
								//radius = 16;
								radius = Math.sqrt(192);
							}else if( v[keyStr][key]["accidents"] >= 4){
								//radius = 20;
								radius = Math.sqrt(256);
							}
							accidentObj.setAttributeNS(null,"cx", sang*k);
							accidentObj.setAttributeNS(null,"cy", v[keyStr][key]["distance(mm)"]);
							accidentObj.setAttributeNS(null,"r", radius);
							accidentObj.setAttributeNS(null, "class", "accidentCircle");
						}
						polygonLine += sang*k + "," + v[keyStr][key]["distance(mm)"] + " ";
						k++;
						count_accident += v[keyStr][key]["accidents"];

					}

					var tempcrevassePolyObj = crevassePolyObj.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
                    tempcrevassePolyObj.setAttributeNS(null,"points", polygonLine);
                    tempcrevassePolyObj.setAttributeNS(null,"class", "crevasse-poly crevasse-poly-line0"+keepLine);

					if (max_dist > 150) {
                        $("#"+svgId).css('height', max_dist +'px');
                    }else{
						$("#"+svgId).css('height', '150px');
					}
                    if (max_dist > 200) {
                        var descPathObj_2 = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
		                descPathObj_2.setAttributeNS(null,"d", "M 0 200 L 1000 200z");
		                descPathObj_2.setAttributeNS(null,"class", "desc-path");

                        var descTextObj_2 = document.getElementById(svgId).appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
		                descTextObj_2.innerHTML = "200mm";
		                descTextObj_2.setAttributeNS(null,"transform", "translate(-30,205)");
		                descTextObj_2.setAttributeNS(null, "class", "desc-text");
                    }


					var tempPathObj = mainPathHolderObj.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
					tempPathObj.setAttributeNS(null,"d", tmpPath);
					tempPathObj.setAttributeNS(null,"class", "crevasse crevasse-line0"+keepLine);
					
					// 개별 역 정보 입력
					$(".station-name").html(v.station);
					/*
                    var onlyyear = String(v.year).slice(0,4);
                    $(".detail-year").html(onlyyear + "년");
                    if (Number(onlyyear) >= 2005) {
                        $(".detail-court").html("서울교통공사 책임 있음");
                    } else {
                        $(".detail-court").html("서울교통공사 책임 없음");
                    }
                    if (v.moved_board == "O"){
                        $(".detail-board").html("운영");
                    } else {
                        $(".detail-board").html("미운영");
                    }
                    if (v.one_stop == "O") {
                        $(".detail-service").html("운영");
                    } else {
                        $(".detail-service").html("미운영");
                    }*/

				}
            } else {
                tmpPath ="";
            }
			var isCircleOn = false; 
			$(".platformCircle").on("mouseenter", function(){
				//console.log( $(this).attr("cx"));
				var number = $(this).attr("data-platform");
				var dir = $(this).parent("g").parent("svg").attr("id").replace("CREVASSE_",""); 

				if(dir =="UP"){
					$(".crevasse-svg-holder-up .tooltip").show();
					$(".crevasse-svg-holder-up .tooltip").css({"left": ($(this).attr("cx")+150)+"px"});
					$(".each-platform-dis .number").html(number);
					$(".each-platform-dis .distance").html(nowStationData["entrances_up"][number]["distance(mm)"]+"mm");
					/*
					$(".board-info-01 .value").html(nowStationData["entrances_up"][number]["auto_board"]);
					$(".board-info-02 .value").html(nowStationData["entrances_up"][number]["rubber_board"]);
					*/
				}else{
					$(".crevasse-svg-holder-down .tooltip").show();
					$(".crevasse-svg-holder-down .tooltip").css({"left": ($(this).attr("cx")+150)+"px"});
					$(".each-platform-dis .number").html(number);
					$(".each-platform-dis .distance").html(nowStationData["entrances_down"][number]["distance(mm)"]+"mm");
					/*
					$(".board-info-01 .value").html(nowStationData["entrances_down"][number]["auto_board"]);
					$(".board-info-02 .value").html(nowStationData["entrances_down"][number]["rubber_board"]);
					*/
				
				}

			});
			$(".platformCircle").on("mouseleave", function(){
				//console.log("나감");
				$(".crevasse-svg-holder .tooltip").hide();
			});

        });
		return count_accident;
    };

	$(".re-button").on("click", function(){
		resetStationInfo();
		var movePos = $(".metro-select-area").offset().top; 
		$("html, body").animate({scrollTop: movePos-100},800, "easeOutCubic");
	});
	
	function resetStationInfo(){
		$(".station-info-holder").hide();
		nowStationCode=null;
		nowStationDat=null;
		$(".crevasse-svg").css({"height":"150px"});
	}
	
    var twActiveDone = false; 
	function activataTw(){
		$("#TT_HOLDER_01").twentytwenty();
		$("#TT_HOLDER_02").twentytwenty();
         console.log("activate tt");
	};

	// check graphic stage
	var graphicStage;
	var $graphic = $(".illust-book-layout");
	function adjustStage(g){
		if( graphicStage == g){
		}else if( graphicStage !==g ){
			graphicStage = g;
			console.log(g)
			$graphic.removeClass("illust-book-layout-animation");
			if(g < 0){
			
			}else{
				$graphic.eq(g-1).addClass("illust-book-layout-animation");
			}
		}
	};

	function checkGraphicStage(n){
		var $gStagePoint = $(".illust-book-layout");
		var n;
		if( n < $gStagePoint.eq(0).position().top){ 
			adjustStage(-1); //이전
 		}else if( n >= $gStagePoint.eq($gStagePoint.length-1).position().top ){
			adjustStage($gStagePoint.length);
		}else if( n >= $gStagePoint.eq(0).position().top && n < $gStagePoint.eq($gStagePoint.length-1).position().top){
			for(g=0;g<$gStagePoint.length-1;g++){
				if( n >= $gStagePoint.eq(g).position().top && n <$gStagePoint.eq(g+1).position().top){
					adjustStage(g+1);
				}
			}
		}
	}

	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();
		if(nowScroll > $(".tt-slider").offset().top && twActiveDone ==false){
			activataTw();
			twActiveDone = true;
		}
		checkGraphicStage(nowScroll);

		$(".hideme").each(function(i){
			if( $(this).hasClass("shown") == false && nowScroll + screenHeight > $(this).offset().top + $(this).outerHeight()*0.5 ){
				$(this).addClass("shown")
				$(this).stop().animate({"opacity":1},1000);
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
