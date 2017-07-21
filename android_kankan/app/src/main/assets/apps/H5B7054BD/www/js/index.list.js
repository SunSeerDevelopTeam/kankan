var pageInfo = {};
var keyword = "";
var network = true;
var isDown = true;
var detailPage = null;
var __back__first = null;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			auto: true,
			callback: pulldownRefresh,
			contentinit: TextMessage.pull_down,
			contentdown: "",
			contentover: TextMessage.release,
			contentrefresh: ""
		},
		up: {
			contentrefresh: TextMessage.loading,
			contentdown: TextMessage.pull_up,
			contentinit: TextMessage.pull_up,
			contentnomore: TextMessage.nomore,
			callback: pullupRefresh
		}
	}
});
mui.back = function() {
	if(!$.__back__first) {
		$.__back__first = new Date().getTime();
		mui.toast(TextMessage.exit_app);
		setTimeout(function() {
			$.__back__first = null;
		}, 2000);
	} else {
		if(new Date().getTime() - $.__back__first < 2000) {
			plus.runtime.quit();
		}
	}
}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	isDown = true;
	mui('#pullrefresh').pullRefresh().refresh(true);
	keyword = "";
	var params = {};
	getDataFromServer(params, function(data) {
		var table = document.body.querySelector('.mui-table-view');
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		if(Validator.isEmpty(data.data.commd)) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			plus.nativeUI.toast(TextMessage.no_data);
			return;
		}
		table.innerHTML = "";
		data.data.commd.forEach(function(item) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
			li.innerHTML = createListItem(item, imgwidth);
			table.appendChild(li);
		});
		bindEventOnListViewItem();
		lazyload();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	});
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	isDown = false;
	//mui('#pullrefresh').pullRefresh().endPullupToRefresh(pageInfo.list * pageInfo.page >= pageInfo.cnt);
	//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	var params = {};
	params.search = keyword;
	params.page = ++pageInfo.page;
	getDataFromServer(params, function(data) {
		var table = document.body.querySelector('.mui-table-view');
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		if(Validator.isEmpty(data.data.commd)) {
			//$("#item1mobile .mui-pull-loading").html(TextMessage.nomore);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			if(keyword !== "") {
				$(".mui-pull-caption-nomore").text(TextMessage.search_result + "'" + keyword + "'," + "全" + $('.mui-table-view li').length + "件");
			}
			return;
		}
		$(".mui-pull-caption-refresh").html(TextMessage.loading);
		data.data.commd.forEach(function(item) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
			li.innerHTML = createListItem(item, imgwidth);
			table.appendChild(li);
		});
		bindEventOnListViewItem();
		lazyload();
		mui('#pullrefresh').pullRefresh().endPullupToRefresh();
	});
}

function getDataFromServer(params, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		network = false;
	} else {
		network = true;
	}
	if(network) {
		var cid = localStorage.getItem("cid");
		if(cid == -1) {
			params.want = 1;
		} else if(cid != 0) {
			params.catalog = cid;
		}
		params.max = 14;
		Repository.Commodity.commodityList(params, {
			ok: function(data) {
				callback(data);
				updateUserPhoto(data.data.users.photo);
				updateNoticeStatus(data.data.users.sys_msg_flg);
				savePageInfo(data.data.pages);
			},
			ng: function(statuscode) {
				if (isDown) {
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			},
			error: function() {
				var message = arguments[0].toString();
				console.log("message is : " + message);
				if(isDown) {
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			}
		});
	} else {
		plus.nativeUI.alert(TextMessage.not_network, function(e) {
			if(isDown) {
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		}, TextMessage.sharetitle, TextMessage.sure);
	}
}

function updateUserPhoto(photo) {
	if(typeof(plus) == "undefined") {
		return;
	}
	var homePage = plus.webview.getWebviewById('home.html');
	mui.fire(homePage, 'updateUserImgEvent', {
		userImgURL: photo
	});
}

function updateNoticeStatus(msgFlg) {
	if(typeof(plus) == "undefined") {
		return;
	}
	var homePage = plus.webview.getWebviewById('home.html');
	mui.fire(homePage, 'updateNoticeStatusEvent', {
		flg: msgFlg
	});
}

function savePageInfo(pages) {
	pageInfo.cnt = pages.cnt;
	pageInfo.list = pages.list;
	pageInfo.page = pages.page;
}

function createListView(data) {
	var table = document.body.querySelector('.mui-table-view');
	if(Validator.isEmpty(table)) {
		return;
	}
	var imgwidth = parseInt($(window).width()) / 2 - 34;
	if(Validator.isEmpty(data.data.commd)) {
		var htmlText = "<div class='no-data-tips'><br/><div style='text-align:center;'>" + TextMessage.no_data_tips_1 + "</div><br/><div style='text-align:center;'>" + TextMessage.no_data_tips_2 + "</div><br/></div>";
		table.innerHTML = htmlText;
		return;
	}
	data.data.commd.forEach(function(item) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
		li.innerHTML = createListItem(item, imgwidth);
		table.appendChild(li);
	});
	if (keyword !== "") {
		$('.mui-pull-bottom-pocket').show();
		$(".mui-pull-caption").text(TextMessage.search_result + "'" + keyword + "'," + "全" + $('.mui-table-view li').length + "件");
	}
	bindEventOnListViewItem();
	lazyload();
}

function bindEventOnListViewItem() {
	$(".li-content").off("tap", ".item-tap");
	$(".li-content").on("tap", ".item-tap", function(event) {
		//if(isShowMenu) return;
		var id = $(this).attr("data-comm-id");
		if(!detailPage) {
			detailPage = plus.webview.getWebviewById('detail');
		}
		mui.fire(detailPage, 'cid', {
			id: id
		});
		setTimeout(function() {
			mui.openWindow({
				id: 'detail',
				waiting: {
					autoShow: false
				},
				show: {
					duration: 200
				}
			});
		}, 300);
	});

	$(".contentbottom").off("tap", ".like-area");
	$(".contentbottom").on("tap", ".like-area", function(event) {
		console.log("click like");
		var _self = $(this).find(".comm-like-num");
		if(!Repository.User.isLogin()) {
			return;
		}
		var commId = _self.closest("li").find('.item-tap').attr('data-comm-id');
		var params = {
			commid: commId
		};
		Repository.Commodity.praise(params, {
			ok: function(result) {
				var praise_flag = result.data.p_flg;
				if(praise_flag == "0") {
					_self.prev().addClass('comm-like-gray');
					_self.prev().removeClass('comm-like-red');
					_self.text(result.data.p_cnt);
				} else if(praise_flag == "1") {
					_self.prev().addClass('comm-like-red');
					_self.prev().removeClass('comm-like-gray');
					_self.text(result.data.p_cnt);
				} else {
					if(DEBUG) {
						alert("praise_flag is error.");
					}
				}
			},
			ng: function(result) {
				if(result === "2004") {
					plus.nativeUI.alert(TextMessage.operation_error);
				}
				if(Validator.isObj(result)) {
					$.each(result, function(key, value) {
						switch(value) {
							case "1003":
								if(key == "commodity_id") {
									plus.nativeUI.alert("key is " + key + ", value is " + value);
								}
								break;
							default:
								break;
						}
					});
				}
			},
			error: function() {}
		});
		return false;
	});
}

function createListItem(item, imgwidth) {
	var heightim = item.img_flag.height;
	var widthim = item.img_flag.width;
	var orginbi = heightim / widthim;
	var actuheight = imgwidth * orginbi;
	var heicha = actuheight - imgwidth;
	if(heicha > 0) {
		var toppx = heicha / 2;
		stylimg = "margin-top:-" + toppx + "px;";
	} else {
		var hecha2 = imgwidth - actuheight;
		var toppx = hecha2 / 2;
		stylimg = "margin-top:" + toppx + "px;";
	}
	var itemheight = imgwidth + 40;
	var listItemHTML = new Util.StringBuilder();
	listItemHTML.appendFormat('<div class="li-content" id="{0}">', item.commodity_id)
		.appendFormat('<div class="comm-item" style="height:{0}px;">', itemheight)
		.appendFormat('<div class="item-tap mui-col-sm-12 mui-col-xs-12" data-comm-id="{0}">', item.commodity_id)
		.appendFormat('<div class="item-img-box" style="height:{0}px;"><img class="lazy" src="{1}" onerror="this.src=' + "'../../../images/nopic.jpg'" + '" style="{2}"></div>', imgwidth, item.img_flag.thu_url, stylimg)
		//.appendFormat('<img src="{0}">', item.img_flag)
		//.appendFormat('<p>{0}</p>', item.address == "" ? "全国" : item.address)
		.append('</div>')
		.append('<div class="item-buttom mui-col-sm-12 mui-col-xs-12">')
		.append('<div class="height-max mui-row contentbottom">')
		.append('<div class="height-max mui-col-sm-8 mui-col-xs-8">')
		.appendFormat('<div class="comm-name mui-col-sm-12">{0}</div>', HTMLDecode(item.comm_name))
		.appendFormat('<div class="comm-price mui-col-sm-12">{0}</div>', item.address == "" ? "全国" : item.address)
		.append('</div>')
		.append('<div class="like-area height-max mui-col-sm-4 mui-col-xs-4">')
		.appendFormat('<span class="comm-like mui-icon-extra mui-icon-extra-heart-filled ' + "{0}" + '">', item.praise_flg == 0 ? "comm-like-gray" : "comm-like-red")
		.append('</span>')
		.appendFormat('<span class="comm-like-num">{0}</span>', item.praise_cnt)
		.append('</div>')
		.append('</div>')
		.append('</div>')
		.append('</div>')
		.append('</div>');
	return listItemHTML.toString();
}

function lazyload() {
	/**
	$("img.lazy").lazyload({
		threshold: 200,
		placeholder: "../../../images/nopic.jpg",
		effect: "fadeIn",
		failure_limit: 10
	});
	**/
}

//当DOM准备就绪时
mui.plusReady(function() {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		network = false;
	} else {
		network = true;
	}
	var detailWebView = plus.webview.getWebviewById("detail");
	if(detailWebView == null) {
		mui.preload({
			id: 'detail',
			url: '../main/products/detail.html'
		});
	}
	if(mui('#pullrefresh').length === 0) {
		localStorage.cid = mui(".mui-control-item.mui-active")[0].dataset.cid;
	}
})

window.addEventListener("search", function(event) {
	if(event.detail.keyword === "") {
		return;
	}
	keyword = event.detail.keyword;
	var params = {};
	params.search = keyword;
	getDataFromServer(params, function(data) {
		document.body.querySelector('.mui-table-view').innerHTML = "";
		createListView(data, "search");
	});
});
window.addEventListener("initData", function(event){
	if (event.detail.createData !== "yes") {
		return;
	}
	var params = {};
	getDataFromServer(params, function(data) {
		document.body.querySelector('.mui-table-view').innerHTML = "";
		createListView(data);
	});
});
window.addEventListener("clear", function(event){
	if (event.detail.clearData !== "all") {
		return;
	}
	var table = document.body.querySelector('.mui-table-view');
	table.innerHTML = "";
});
window.addEventListener("refresh", function(event) {
	if(event.detail.refresh != "canRefresh") {
		return;
	}
	var params = {};
	getDataFromServer(params, function(data) {});
});
window.addEventListener("good", function(event) {
	var prid = event.detail.prid;
	if(prid != "undefined") {
		parise(prid);
	}

});

function parise(comid) {
	var params = {
		"commodity_id": comid
	};
	Repository.Commodity.commodityDetail(params, {
		ok: function(data) {
			var praisenum = data.data.commodity_praise.praise_count;
			var praistaute = data.data.commodity_praise.user_praise_status;
			$("#" + comid + " .comm-like-num").html(praisenum);
			if(praistaute == "0") {
				$("#" + comid + " .comm-like").removeClass("comm-like-red");
				$("#" + comid + " .comm-like").addClass("comm-like-gray");
			} else {
				$("#" + comid + " .comm-like").removeClass("comm-like-gray");
				$("#" + comid + " .comm-like").addClass("comm-like-red");
			}
		},
		ng: function(data) {
			Log.d(data);
		}
	});
}