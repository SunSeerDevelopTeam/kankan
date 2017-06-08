var pageInfo = {};
var detailPage = null;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh,
			contentinit: TextMessage.pull_down,
			contentdown: TextMessage.pull_down,
			contentover: TextMessage.release,
			contentrefresh: TextMessage.update
		},
		up: {
			contentrefresh: TextMessage.loading,
			contentdown: TextMessage.pull_up,
			contentinit: TextMessage.pull_up,
			contentnomore: TextMessage.no_data,
			callback: pullupRefresh
		}
	}
});
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	var params = {};
	getDataFromServer(params, function(data) {
		var table = document.body.querySelector('.mui-table-view');
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		if(Validator.isEmpty(data.data.commd)) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			plus.nativeUI.toast(TextMessage.no_data);
			return;
		}
		data.data.commd.forEach(function(item) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
			li.innerHTML = createListItem(item, imgwidth);
			table.insertBefore(li, table.firstChild);
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
	mui('#pullrefresh').pullRefresh().endPullupToRefresh(pageInfo.list * pageInfo.page >= pageInfo.cnt);
	var params = {};
	params.page = ++pageInfo.page;
	getDataFromServer(params, function(data) {
		var table = document.body.querySelector('.mui-table-view');
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		if(Validator.isEmpty(data.data.commd)) {
			return;
		}
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
	var cid = localStorage.cid;
	if(cid == -1) {
		params.want = 1;
	} else if(cid != 0) {
		params.catalog = cid;
	}
	Repository.Commodity.commodityList(params, {
		ok: function(data) {
			callback(data);
			updateUserPhoto(data.data.users.photo);
			updateNoticeStatus(data.data.users.sys_msg_flg);
			savePageInfo(data.data.pages);
		},
		ng: function(statuscode) {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		},
		error: function() {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}
	});
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
		plus.nativeUI.toast(TextMessage.no_data);
		return;
	}
	data.data.commd.forEach(function(item) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
		li.innerHTML = createListItem(item, imgwidth);
		table.appendChild(li);
	});
	bindEventOnListViewItem();
	lazyload();
}

function bindEventOnListViewItem() {
	//$(".li-content").off("tap", ".item-tap");
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

	$(".logistics").on("tap", "a", function(event) {
		var isLogin = plus.storage.getItem("LoginFlag");
		if(!isLogin) {
			var btnArray = [{
				title: TextMessage.login
			}, {
				title: TextMessage.register
			}];
			plus.nativeUI.actionSheet({
				title: TextMessage.sharetitle,
				cancel: TextMessage.skip,
				buttons: btnArray
			}, function(e) {
				switch(e.index) {
					case 1:
						mui.openWindow({
							id: 'login',
							url: '/pages/login/login.html',
							waiting: {
								autoShow: false
							},
							show: {
								duration: 200
							}
						});
						break;
					case 2:
						mui.openWindow({
							id: 'reg',
							url: '/pages/login/reg.html',
							waiting: {
								autoShow: false
							},
							show: {
								duration: 200
							}
						});
						break;
					default:
						break;
				}
			});
			return;
		}
		mui.openWindow({
			id: 'logisticslist',
			url:"/pages/main/products/request.html",
			waiting: {
				autoShow: false
			},
			show: {
				duration: 200
			}
		});
	});

	//$(".comm-like-num").off("tap");
	$(".comm-like-num").on("tap", function(event) {
		var _self = $(this);
		var clickFlag = _self.attr('data-click');
		if(clickFlag === "1") {
			_self.attr('data-click', '0');
			return;
		}
		_self.attr('data-click', '1');
		var isLogin = plus.storage.getItem("LoginFlag");
		if(!isLogin) {
			var btnArray = [{
				title: TextMessage.login
			}, {
				title: TextMessage.register
			}];
			plus.nativeUI.actionSheet({
				title: TextMessage.sharetitle,
				cancel: TextMessage.skip,
				buttons: btnArray
			}, function(e) {
				switch(e.index) {
					case 1:
						mui.openWindow({
							id: 'login',
							url: '/pages/login/login.html',
							waiting: {
								autoShow: false
							},
							show: {
								duration: 200
							}
						});
						break;
					case 2:
						mui.openWindow({
							id: 'reg',
							url: '/pages/login/reg.html',
							waiting: {
								autoShow: false
							},
							show: {
								duration: 200
							}
						});
						break;
					default:
						break;
				}
			});
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
	var heicha = actuheight - 160;
	if(heicha > 0) {
		var toppx = heicha / 2;
		stylimg = "margin-top:-" + toppx + "px;";
	} else {
		stylimg = "";
	}
	var listItemHTML = new Util.StringBuilder();
	listItemHTML.append('<div class="li-content">')
		.append('<div class="comm-item">')
		.appendFormat('<div class="item-tap mui-col-sm-12 mui-col-xs-12" data-comm-id="{0}">', item.commodity_id)
		.appendFormat('<div class="item-img-box"><img class="lazy" data-original="{0}" style="{1}"></div>', item.img_flag.url, stylimg)
		//.appendFormat('<img src="{0}">', item.img_flag)
		.appendFormat('<p>{0}</p>', item.address)
		.append('</div>')
		.append('<div class="item-buttom mui-col-sm-12 mui-col-xs-12">')
		.append('<div class="height-max mui-row">')
		.append('<div class="height-max mui-col-sm-8 mui-col-xs-8">')
		.appendFormat('<div class="comm-name mui-col-sm-12">{0}</div>', HTMLDecode(item.comm_name))
		//.appendFormat('<div class="comm-price mui-col-sm-12">{0} P</div>', item.price)
		.append('</div>')
		.append('<div class="height-max mui-col-sm-4 mui-col-xs-4">')
		.appendFormat('<span class="comm-like mui-icon-extra mui-icon-extra-heart-filled ' + "{0}" + '">', item.praise_flg == 0 ? "comm-like-gray" : "comm-like-red")
		.append('</span>')
		.appendFormat('<span data-click="0" class="comm-like-num">{0}</span>', item.praise_cnt)
		.append('</div>')
		.append('</div>')
		.append('</div>')
		.append('</div>')
		.append('</div>');
	return listItemHTML.toString();
}

function lazyload() {
	$("img.lazy").lazyload({
		threshold: 200,
		placeholder: "../../../images/nopic.jpg",
		effect: "fadeIn",
		failure_limit: 10
	});
}

//当DOM准备就绪时
mui.plusReady(function() {
	var detailWebView = plus.webview.getWebviewById("detail");
	if(detailWebView == null) {
		mui.preload({
			id: 'detail',
			url: '../main/products/detail.html'
		});
	}
	if(mui('#pullrefresh').length != 0) {
		var params = {};
		getDataFromServer(params, function(data) {
			createListView(data);
		});
	} else {
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
		createListView(data);
	});
});

window.addEventListener("refresh", function(event) {
	if(event.detail.refresh != "canRefresh") {
		return;
	}
	var params = {};
	getDataFromServer(params, function(data) {});
});