///////////////take picture/////////////////
mui(".ka_prologbox0").on("tap", "#takepic", function(e) {
	if(mui.os.plus) {
		var a = [{
			title: TextMessage.tackpicture
		}];
		plus.nativeUI.actionSheet({
			title: TextMessage.comdity_takepic,
			cancel: TextMessage.cancel,
			buttons: a
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					getImage();
					break;
				default:
					break
			}
		})
	}

});
//gallery
mui(".ka_prologbox0").on("tap", "#gallery", function(e) {
	if(mui.os.plus) {
		var a = [{
			title: TextMessage.gallerychoose
		}];
		plus.nativeUI.actionSheet({
			title: TextMessage.chooseimage,
			cancel: TextMessage.cancel,
			buttons: a
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					galleryImg();
					break;
				default:
					break
			}
		})
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
function compressImg(path) {
	var currenttime = Date.parse(new Date());
	var imgcm = new Image(); 
	imgcm.src = path+"?"+currenttime;
	imgcm.onload=function(){
		console.log("width:"+imgcm.width+"</br>height:"+imgcm.height);
		var rwidth=imgcm.width;
		var rheight=imgcm.height;
		if(rwidth>=2000 & rheight>=2000){
			var presswidth=rwidth/10;
			var pressheight=rheight/10;
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
				src: path,
				dst: "_doc/" + currenttime + ".jpg",
				quality: quality,
				overwrite: true,
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
				uploadimage(target);
			},
			function(error) {
				alert("Compress error!" + error.message);
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
		error_tost.message();
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

function imgappend(localurl) {
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
	img.setAttribute("style", "display: none");
	var imgAdd = document.createElement("div");
	imgAdd.setAttribute("class", "z_addImg");
	imgAdd.appendChild(img);
	$(".z_photo").append(imgAdd);
}

function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var localurl = entry.toLocalURL();
			imgappend(localurl);
			imglength();
			imgRemove();
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
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			var localURL2 = entry.toLocalURL();
			imgappend(localURL2);
			imglength();
			imgRemove();
			compressImg(localURL2);

		}, function(e) {
			console.log("Read photo file error：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};