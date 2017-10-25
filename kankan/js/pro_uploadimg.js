///////////////take picture/////////////////
mui(".ka_prologbox0").on("tap", "#takepic", function(e) {
	inputblur();
	if(mui.os.plus) {
		mui('#photoRight').popover('toggle');
	}

});
//gallery
mui(".ka_prologbox0").on("tap", "#gallery", function(e) {
	inputblur();
	if(mui.os.plus) {
		mui('#photoLeft').popover('toggle');
	}

});

function imglength() {
	var imglength = $(".z_images").length;
	//alert(imglength);
	if(imglength > 3) {
		$("#gallery").hide();
		$("#takepic").hide();
	}else{
		$("#gallery").attr("style","background-image: url(../../../images/iconfont-tianjia.png);display: block;");
		$("#takepic").attr("style","display: block;");
	}
}
//px Convert to rem
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			if(clientWidth >= 640) {
				docEl.style.fontSize = '100px';
			} else {
				docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
			}
		};

	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//delete image
function imgRemove() {
	var imgList = document.getElementsByClassName("z_addImg");
	var mask = document.getElementsByClassName("z_mask")[0];
	var cancel = document.getElementsByClassName("z_cancel")[0];
	var sure = document.getElementsByClassName("z_sure")[0];
	for(var j = 0; j < imgList.length; j++) {
		imgList[j].index = j;
		imgList[j].onclick = function() {
			var t = this;
			mask.style.display = "block";
			cancel.onclick = function() {
				mask.style.display = "none";
			};
			sure.onclick = function() {
				mask.style.display = "none";
				t.style.display = "none";
				var picdisp = $(".z_file").css("display");
				if(picdisp == "none") {
					$(".z_file").show();
				}
				var takpic = $("#takepic").css("display");
				if(takpic == "none") {
					$("#takepic").show();
				}
				var dethtml = $(t).html();
				$("#deltimg").html(dethtml);
				var altval = $("#deltimg img").attr("alt");
				$("#" + altval).val("0");
				nums = altval;
				$(t).remove();
				$("#deltimg").empty();
			};

		}
	};

};

//compressImage
var presswidth = 0;
var pressheight = 0;
var rwidth = 0;
var rheight = 0;
function compressImg(path) {
	var currenttime = Date.parse(new Date());
	var imgcm = new Image(); 
	imgcm.src = path+"?"+currenttime;
	imgcm.onload=function(){
		console.log("width:"+imgcm.width+"</br>height:"+imgcm.height);
		rwidth=imgcm.width;
		rheight=imgcm.height;
		if(rwidth>=2000 & rheight>=2000){
			presswidth=rwidth/10;
			pressheight=rheight/10;
			if(pressheight<=500){
				zipcom(presswidth,pressheight,80);
			}else{
				var cutwidth="auto";
				var cutheight=500;
				zipcom(cutwidth,cutheight,70);
			}
		}else{
			zipcom(rwidth,rheight,20);
		}
		function zipcom(presswidth,pressheight,quality){
			plus.zip.compressImage({
				src:path,
				dst: "_downloads/" + currenttime + ".jpg",
				quality: quality,
				overwrite: false,
				format: "jpg",
				width: presswidth,
				height: pressheight
			},
			function(event) {
				console.log("Compress success!");
				var target = event.target;
				var size = event.size; // （Byte）
				var width = event.width; // px
				var height = event.height; // px
				console.log("compress size is (byte):"+size);
				if (size < 5*1024 || size > 2*1024*1024) {
					mui.toast(TextMessage.imageDiskSpace, {
						duration: 'long',
						type: 'div'
					});
					return;
				}
				if (width > 3*height && height > 3*width) {
					mui.toast(TextMessage.imageProportions, {
						duration: 'long',
						type: 'div'
					});
					return;
				}
				imgappend(target);
				imglength();
			    imgRemove();
				uploadimage(target);
			},
			function(error) {
				if(error.code=="-4"){
					mui.toast(TextMessage.Compresserror_si, {
						duration: 'long',
						type: 'div'
					});
				}else{
					mui.toast(TextMessage.Compresserror, {
						duration: 'long',
						type: 'div'
					});
				}
				console.log("errorcode:"+error.code);
				console.log("Compress error!" + error.message);
			});
		}
	};
}

function uploadimage(path) {
	var targetimg = path;
	var server = Api.url.Commodity.imgupload;
	//open loading button
	var wt = plus.nativeUI.showWaiting();
	setTimeout(function(){
		wt.close();
	},11*1000);
	var task = plus.uploader.createUpload(server, {
		method: "post"
	}, function(t, status) {
		if(status == 200) {
			//console.log("upload success:" + t.responseText);
			console.log("upload success!");
			Processing(t.responseText);
			wt.close();
		} else {
			wt.close();
			mui.toast(TextMessage.not_network, {
				duration: 'long',
				type: 'div'
			});
			console.log("upload error：" + status);
		}
	});
	//add parameter
	task.addData("tokencheck", Api.getToken()); //Api.getToken()
	task.addData("signcheck", Api.createSignInfo());
	task.addData("serial", nums.toString());
	task.addFile(targetimg, { key: "image" });
	task.start();
}

function Processing(results) {
	var data = JSON.parse(results);
	var stautes = data.result.status;
	if(stautes == "OK") {
		var imagesrc = data.result.data[1];
		var value = $("#" + nums).val();
		if(value == "0") {
			$("#" + nums).val(imagesrc);
		}
		//console.log("sss");
		$(".z_images").show();
	} else {
		$(".z_images").remove();
		$("#" + nums).val("0");
		var errorcode = data.result.statuscode;
		console.log("NG:" + errorcode);
		if(errorcode == "1000" || errorcode == "2002" || errorcode == "2022") {
			mui.toast(TextMessage.test, {
				duration: 'long',
				type: 'div'
			});
			mui.openWindow({
				id: 'login',
				url:"../../login/login.html"
			});
		}
	}
}
var nums = 0;
var imgdiv;
function imgappend(localurl) {
	var imgwidth = parseInt($(window).width()) / 4 - 33.75;
    var hwhpercent = rheight / rwidth;
	var top_margin = 0;
	var showheight = imgwidth * hwhpercent;
	var cha1 = showheight - imgwidth;
	if(cha1 > 0) {
		top_margin = cha1 / 2;
	} else {
		top_margin = 0;
	}
    if (showheight < imgwidth) {
        imgdiv="position: relative; top: "+(imgwidth-showheight)/2+"px;";
	} else {
		imgdiv="height:"+ imgwidth +"px; overflow: hidden; line-height: "+ imgwidth +"px;";
	}
	var styleimg="height: auto; margin-top:-"+ top_margin +"px;";
	
    var flag = true;
	for(var m = 0; m < 4; m++) {
		var valuem = $("#" + m).val();
		if(valuem == "0") {
			nums = m;
			break;
		}
	}
	var img = document.createElement("img");
	img.setAttribute("src", localurl);
	img.setAttribute("alt", nums);
	img.setAttribute("class", "z_images");
	img.setAttribute("style", styleimg);
	var imgAdd = document.createElement("div");
	imgAdd.setAttribute("class", "z_addImg");
	imgAdd.setAttribute("style", imgdiv);
	imgAdd.appendChild(img);
	$(".z_photo").append(imgAdd);
}

function getImage() {
    mui('#photoRight').popover('hide');
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var localurl = entry.toLocalURL();
			/*imgappend(localurl);
			imglength();
			imgRemove();*/
			compressImg(localurl);
		}, function(e) {
			console.log("Read the picture file error：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/camera/"
	})
}

function galleryImg() {
    mui('#photoLeft').popover('hide');
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			var localURL2 = entry.toLocalURL();
			compressImg(localURL2);
			/*imglength();
			imgRemove();*/
			// imgappend(localURL2);

		}, function(e) {
			console.log("Read photo file error：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};