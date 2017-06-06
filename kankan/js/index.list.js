mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	getDataFromServer(function(data) {
		var table = document.body.querySelector('.mui-table-view');
		/**
		for(var i = 0; i < length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
			table.insertBefore(li, table.firstChild);
		}
		**/
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		data.result.data.commd.forEach(function(item) {
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
			li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
			var listItemHTML = new Util.StringBuilder();
			listItemHTML.append('<div class="li-content">')
				.append('<div class="comm-item">')
				.appendFormat('<div class="item-tap mui-col-sm-12 mui-col-xs-12" data-comm-id="{0}">', item.commodity_id)
				.appendFormat('<div class="item-img-box"><img class="lazy" data-original="{0}" style="{1}"></div>', item.img_flag.url, stylimg)
				//.appendFormat('<img src="{0}">', item.img_flag)
				.appendFormat('<span>{0}</span>', item.address)
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
			li.innerHTML = listItemHTML.toString();
			table.insertBefore(li, table.firstChild);
		});
		$("img.lazy").lazyload({
			threshold: 200,
			placeholder: "../../images/nopic.jpg",
			effect: "fadeIn",
			failure_limit: 10
		});
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	});
}
var count = 0;
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	getDataFromServer(function(data) {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2));
		var table = document.body.querySelector('.mui-table-view');
		var length = data.result.data.commd.length;
		/**
		for(var i = 0; i < length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
			table.appendChild(li);
		}
		**/
		var imgwidth = parseInt($(window).width()) / 2 - 34;
		data.result.data.commd.forEach(function(item) {
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
			li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
			var listItemHTML = new Util.StringBuilder();
			listItemHTML.append('<div class="li-content">')
				.append('<div class="comm-item">')
				.appendFormat('<div class="item-tap mui-col-sm-12 mui-col-xs-12" data-comm-id="{0}">', item.commodity_id)
				.appendFormat('<div class="item-img-box"><img class="lazy" data-original="{0}" style="{1}"></div>', item.img_flag.url, stylimg)
				//.appendFormat('<img src="{0}">', item.img_flag)
				.appendFormat('<span>{0}</span>', item.address)
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
			li.innerHTML = listItemHTML.toString();
			table.appendChild(li);
		});
		$("img.lazy").lazyload({
			threshold: 200,
			placeholder: "../../images/nopic.jpg",
			effect: "fadeIn",
			failure_limit: 10
		});
	});
}

function createSignInfo() {
	var timestamp = (new Date()).valueOf().toString();
	var sub_timestamp = timestamp.substring(timestamp.length - 8, timestamp.length - 1);
	var signQ = sha256_digest(sub_timestamp + "#justfortest00001xxxxOOOX#");
	var signA = sha256_digest(timestamp + "#" + signQ + "#justfortest00001xxxxOOOX");
	return timestamp + "_" + signQ + "_" + signA;
}

function getDataFromServer(callback) {
	mui.ajax('http://210.189.72.25:7998/index/index/', {
		data: {
			'signcheck': createSignInfo(),
			'tokencheck': ''
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			callback(data);
		},
		error: function(xhr, type, errorThrown) {}
	});
}

function createListView(data) {
	console.dir(data);
	var table = document.body.querySelector('.mui-table-view');
	var length = data.result.data.commd.length;
	/**
	for(var i = 0; i < length; i++) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
		table.appendChild(li);
	}
	**
	*/
	var imgwidth = parseInt($(window).width()) / 2 - 34;
	data.result.data.commd.forEach(function(item) {
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
		li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-col-sm-6 mui-col-xs-6';
		var listItemHTML = new Util.StringBuilder();
		listItemHTML.append('<div class="li-content">')
			.append('<div class="comm-item">')
			.appendFormat('<div class="item-tap mui-col-sm-12 mui-col-xs-12" data-comm-id="{0}">', item.commodity_id)
			.appendFormat('<div class="item-img-box"><img class="lazy" data-original="{0}" style="{1}"></div>', item.img_flag.url, stylimg)
			//.appendFormat('<img src="{0}">', item.img_flag)
			.appendFormat('<span>{0}</span>', item.address)
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
		li.innerHTML = listItemHTML.toString();
		table.appendChild(li);
	});
	$("img.lazy").lazyload({
		threshold: 200,
		placeholder: "../../images/nopic.jpg",
		effect: "fadeIn",
		failure_limit: 10
	});
}

//当DOM准备就绪时
mui.ready(function() {
	getDataFromServer(function(data) {
		createListView(data);
	});
})