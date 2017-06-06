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
		var length = data.result.data.commd.length;
		for(var i = 0; i < length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
			table.insertBefore(li, table.firstChild);
		}
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
		for(var i = 0; i < length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
			table.appendChild(li);
		}
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
	for(var i = 0; i < length; i++) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = '<a class="mui-navigate-right"><img src="' + data.result.data.commd[i].img_flag.url + '"/></a>';
		table.appendChild(li);
	}
}

//当DOM准备就绪时
mui.ready(function() {
	getDataFromServer(function(data) {
		createListView(data);
	});
})