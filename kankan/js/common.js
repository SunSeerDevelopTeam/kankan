var secretKey = "justfortest00001xxxxOOOX";
var DEBUG = true;
var DEVELOPMENT = true;
var STATUS = {
	OK: "OK",
	NG: "NG"
};
var LOGIN_TYPE = {
	EMAIL: "0",
	OAUTH: "1"
}

var TRANS_STATUS = {
	0: "请求中",
	1: "请求转订单",
	2: "订单中",
	3: "订单完成",
	8: "请求终止",
	9: "订单终止"
}
var Validator;
(function(Validator) {
	Validator.types = {
		String: 'string',
		Number: 'number',
		Boolean: 'boolean',
		Function: 'function',
		Object: 'object',
		Undefined: 'undefined',
		Date: Date
	};
	var regex = {
		Email: /^(([^<>()[\]\\.,;:\s\"]+(\.[^<>()[\]\\.,;:\s\"]+)*)|(\".+\"))((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	};

	function isUndefined(v) {
		return typeof(v) === Validator.types.Undefined;
	}
	Validator.isUndefined = isUndefined;

	function isNull(v) {
		return(isUndefined(v) || (null === v));
	}
	Validator.isNull = isNull;

	function isEmpty(v) {
		if(isNull(v))
			return true;
		if(isStr(v))
			return v === "";
		else if(Array.isArray(v))
			return v.length < 1;
		return v.toString() === "";
	}
	Validator.isEmpty = isEmpty;

	function isNum(v) {
		return !isEmpty(v) && !isNaN(parseFloat(v)) && isFinite(v);
	}
	Validator.isNum = isNum;

	function isStr(v) {
		return !isNull(v) && typeof v === Validator.types.String;
	}
	Validator.isStr = isStr;

	function isArray(v) {
		return !isNull(v) && Array.isArray(v);
	}
	Validator.isArray = isArray;

	function isBool(v) {
		return !isNull(v) && typeof v === Validator.types.Boolean;
	}
	Validator.isBool = isBool;

	function isFunc(v) {
		return !isNull(v) && typeof v === Validator.types.Function;
	}
	Validator.isFunc = isFunc;

	function isObj(v) {
		return !isNull(v) && typeof v === Validator.types.Object;
	}
	Validator.isObj = isObj;

	function isDate(v) {
		return !isNull(v) && isInstance(v, Validator.types.Date);
	}
	Validator.isDate = isDate;

	function isInstance(v, type) {
		if(isNull(type) || isNull(v))
			return false;
		if(v instanceof type)
			return true;
		var instanceType = Object.getPrototypeOf(v);
		return !!(instanceType === type) ||
			(instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
			(instanceType.implementsInterface && instanceType.implementsInterface(type));
	}
	Validator.isInstance = isInstance;

	function isEmail(v) {
		return !isEmpty(v) && regex.Email.test(v);
	}
	Validator.isEmail = isEmail;
})(Validator || (Validator = {}));
var Util;
(function(Util) {
	function getUrlParams(url) {
		url = url || window.location.href;
		url = url.replace(/#.+/g, '');
		var r = {},
			s = url.split("?"),
			ps, p;
		if(s.length > 1) {
			ps = s[1].split("&");
			for(var i = 0; i < ps.length; ++i) {
				p = ps[i].split("=");
				r[p[0]] = decodeURIComponent(p[1]);
			}
		}
		return r;
	}
	Util.getUrlParams = getUrlParams;

	function getUrlParam(name, url) {
		return getUrlParams(url)[name];
	}
	Util.getUrlParam = getUrlParam;

	function getHashParams(url) {
		url = url || window.location.href;
		var r = {},
			pos = url.indexOf('#'),
			hash = '',
			ps, p, i;
		if(pos >= 0) {
			hash = url.substr(pos);
			ps = hash.split("#");
			for(i = 0; i < ps.length; ++i) {
				p = ps[i].split("=");
				r[p[0]] = decodeURIComponent(p[1]);
			}
		}
		return r;
	}
	Util.getHashParams = getHashParams;

	function getHashParam(name) {
		return getHashParams()[name];
	}
	Util.getHashParam = getHashParam;

	function toUrlParams(params) {
		var d = new StringBuilder();
		for(var k in params) {
			var v = params[k];
			if(!Validator.isEmpty(k) && !Validator.isEmpty(v))
				d.appendFormat('{0}={1}', k, encodeURIComponent(v));
		}
		return d.toString('&');
	}
	Util.toUrlParams = toUrlParams;

	function toHashParams(params) {
		var d = new StringBuilder();
		for(var k in params) {
			var v = params[k];
			if(!Validator.isEmpty(k) && !Validator.isEmpty(v))
				d.appendFormat('#{0}={1}', k, encodeURIComponent(v));
		}
		return d.toString();
	}
	Util.toHashParams = toHashParams;

	function getUrlNoParams(url) {
		url = url || document.URL;
		var pos = url.indexOf('?');
		if(pos >= 0)
			url = url.substr(0, pos);
		pos = url.indexOf('#');
		if(pos >= 0)
			url = url.substr(0, pos);
		var params = getUrlParams();
		var id = params['id'];
		var sphosturl = params['SPHostUrl'];
		if(!Validator.isEmpty(id))
			url += '?id=' + id;
		if(!Validator.isEmpty(sphosturl))
			url += '&SPHostUrl=' + encodeURIComponent(sphosturl);
		return url;
	}
	Util.getUrlNoParams = getUrlNoParams;

	function htmlEncode(v) {
		return $('<div/>').text(v).html();
	}
	Util.htmlEncode = htmlEncode;

	function htmlDecode(v) {
		return $('<div/>').html(v).text();
	}
	Util.htmlDecode = htmlDecode;

	function getEmailFromLoginName(v) {
		if(Validator.isEmpty(v))
			return '';
		var pos = v.lastIndexOf('|'),
			email = pos >= 0 ? v.substr(pos + 1) : v;
		return Validator.isEmail(email) ? email : '';
	}
	Util.getEmailFromLoginName = getEmailFromLoginName;
	var StringBuilder = (function() {
		function StringBuilder(obj) {
			this._buffer = [];
			this._len = 0;
			if(!Validator.isEmpty(obj))
				this.push(obj.toString());
		}
		StringBuilder.prototype.append = function(obj) {
			return Validator.isEmpty(obj) ? this : this.push(obj.toString());
		};
		StringBuilder.prototype.appendLine = function(obj) {
			return this.push(Validator.isEmpty(obj) ? "\r\n" : obj.toString() + "\r\n");
		};
		StringBuilder.prototype.appendFormat = function(format) {
			var args = [];
			for(var _i = 1; _i < arguments.length; _i++) {
				args[_i - 1] = arguments[_i];
			}
			return this.push(format.format(args));
		};
		StringBuilder.prototype.clear = function() {
			this._buffer = [];
			this._len = 0;
			return this;
		};
		StringBuilder.prototype.length = function() {
			return this._len;
		};
		StringBuilder.prototype.count = function() {
			return this._buffer.length;
		};
		StringBuilder.prototype.isEmpty = function() {
			return this._buffer.length === 0;
		};
		StringBuilder.prototype.toString = function(separator) {
			if(separator === void 0) {
				separator = "";
			}
			return this._buffer.join(separator);
		};
		StringBuilder.prototype.push = function(s) {
			this._buffer.push(s);
			this._len += s.length;
			return this;
		};
		return StringBuilder;
	}());
	Util.StringBuilder = StringBuilder;

	function dateZoneFormat(d, f) {
		f = f || 'YYYY/MM/DD';
		return moment(d).zone('+09:00').format(f);
	}
	Util.dateZoneFormat = dateZoneFormat;
	var Extends;
	(function(Extends) {
		var numericPattern = {
			minInt: 1,
			minFrac: 0,
			maxFrac: 3,
			posPre: '',
			posSuf: '',
			negPre: '-',
			negSuf: '',
			gSize: 3,
			lgSize: 3,
			groupSep: ',',
			decimalSep: '.',
		};

		function formatNumber(v, fractionSize) {
			if(!Validator.isNum(v))
				return '';
			var pattern = numericPattern,
				isNegative = v < 0,
				decimalSep = pattern.decimalSep,
				groupSep = pattern.groupSep;
			v = Math.abs(v);
			var nsr = v + '',
				formatedText = '',
				parts = [],
				hasExponent = false;
			if(nsr.indexOf('e') !== -1) {
				var m = nsr.match(/([\d\.]+)e(-?)(\d+)/);
				if(m && m[2] == '-' && parseInt(m[3]) > (fractionSize + 1)) {
					nsr = '0';
				} else {
					formatedText = nsr;
					hasExponent = true;
				}
			}
			if(!hasExponent) {
				var fractionLen = (nsr.split(numericPattern.decimalSep)[1] || '').length;
				if(!Validator.isNum(fractionSize)) {
					fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
				}
				var pow;
				if(fractionSize < 0) {
					decimalSep = '';
					pow = Math.pow(10, -fractionSize);
					v = Math.round(v / pow) * pow;
				} else {
					pow = Math.pow(10, fractionSize);
					v = Math.round(v * pow) / pow;
				}
				var fractions = ('' + v).split(numericPattern.decimalSep),
					whole = fractions[0],
					fraction = fractions[1] || '',
					i, pos = 0,
					lgroup = pattern.lgSize,
					group = pattern.gSize;
				if(whole.length >= (lgroup + group)) {
					pos = whole.length - lgroup;
					for(i = 0; i < pos; i++) {
						if((pos - i) % group === 0 && i !== 0) {
							formatedText += groupSep;
						}
						formatedText += whole.charAt(i);
					}
				}
				for(i = pos; i < whole.length; i++) {
					if((whole.length - i) % lgroup === 0 && i !== 0) {
						formatedText += groupSep;
					}
					formatedText += whole.charAt(i);
				}
				if(fractionSize > 0) {
					while(fraction.length < fractionSize) {
						fraction += '0';
					}
				}
				if(fractionSize && fractionSize !== 0)
					formatedText += decimalSep + fraction.substr(0, fractionSize);
			} else {
				if(fractionSize > 0 && v > -1 && v < 1) {
					formatedText = v.toFixed(fractionSize);
				}
			}
			parts.push(isNegative ? pattern.negPre : pattern.posPre);
			parts.push(formatedText);
			parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
			return parts.join('');
		}
		Extends.formatNumber = formatNumber;
		String.prototype.startWith = function(text) {
			if(Validator.isEmpty(text))
				return false;
			var len = text.length;
			return this.length >= len && this.substring(0, len) === text;
		};
		String.prototype.endWith = function(text) {
			if(Validator.isEmpty(text))
				return false;
			var len1 = this.length,
				len2 = text.length;
			return len1 >= len2 && this.substring(len1 - len2) === text;
		};
		String.prototype.format = function(arg) {
			var fn;
			if(Validator.isObj(arg)) {
				fn = function(m, k) {
					return arg[k];
				};
			} else {
				var args = arguments;
				fn = function(m, k) {
					return args[parseInt(k)];
				};
			}
			return this.replace(/\{(\w+)\}/g, fn);
		};
		String.prototype.padLeft = function(totalWidth, paddingChar) {
			if(Validator.isEmpty(paddingChar))
				paddingChar = " ";
			var plen = paddingChar.length,
				len = totalWidth - this.length,
				str = this;
			while(len > 0) {
				str = paddingChar + str;
				len -= plen;
			}
			return str;
		};
		String.prototype.padRight = function(totalWidth, paddingChar) {
			if(Validator.isEmpty(paddingChar))
				paddingChar = " ";
			var plen = paddingChar.length,
				len = totalWidth - this.length,
				str = this;
			while(len > 0) {
				str += paddingChar;
				len -= plen;
			}
			return str;
		};
		String.prototype.trim = function(arg) {
			if(Validator.isEmpty(arg))
				return this.replace(/^\s+|\s+$/g, '');
			if(Validator.isStr(arg))
				return this.replace(new RegExp('^[{0}]+|[{0}]+$'.format(arg), 'g'), '');
			if(Array.isArray(arg) && arg.length > 0) {
				var chars = arg.join(''),
					exp = '^[' + chars + ']+|[' + chars + ']+$';
				return this.replace(new RegExp(exp, 'g'), '');
			}
			return this;
		};
		String.prototype.trimLeft = function(arg) {
			if(Validator.isEmpty(arg))
				return this.replace(/^(?:\s+|\s+)/g, '');
			if(Validator.isStr(arg))
				return this.replace(new RegExp('^[{0}]+'.format(arg), 'g'), '');
			if(Array.isArray(arg) && arg.length > 0) {
				var exp = '^[' + arg.join('') + ']+';
				return this.replace(new RegExp(exp, 'g'), '');
			}
			return this;
		};
		String.prototype.trimRight = function(arg) {
			if(Validator.isEmpty(arg))
				return this.replace(/(?:\s+|\s+)$/g, '');
			if(Validator.isStr(arg))
				return this.replace(new RegExp('[{0}]+$'.format(arg), 'g'), '');
			if(Array.isArray(arg) && arg.length > 0) {
				var exp = '[' + arg.join('') + ']+$';
				return this.replace(new RegExp(exp, 'g'), '');
			}
			return this;
		};
		String.prototype.toDate = function(utc, arg1) {
			utc = utc || false;
			var fn = utc ? moment.utc : moment;
			return fn(this, arg1).toDate();
		};
		String.prototype.insert = function(index, v) {
			if(index > 0)
				return this.substring(0, index) + v + this.substring(index, this.length);
			else
				return v + this;
		};
		Number.prototype.format = function(fractionSize) {
			if(!Validator.isNum(fractionSize))
				fractionSize = 2;
			return formatNumber(this, fractionSize);
		};
	})(Extends || (Extends = {}));

	function getRandom(value) {
		return Math.floor(Math.random() * value);
	}
	Util.getRandom = getRandom;
})(Util || (Util = {}));
var Api;
(function(Api) {

	baseUrl = function() {
		if(DEVELOPMENT) {
			return "http://192.168.1.8:7998";
		} else {
			return "http://210.189.72.25:7998";
		}
	}

	Api.url = {
		User: {
			checkEmail: baseUrl() + '/user/Register/email_rgister_check/',
			register: 　baseUrl() + '/user/Register',
			login: baseUrl() + '/user/login/login',
			forgetPwd: baseUrl() + '/user/password',
			Usershow: baseUrl() + '/user/Usershow',
			userinfo: baseUrl() + '/user/setting/',
			Usertranslist: baseUrl() + '/user/Usertrans/',
			mytranshistory: baseUrl() + '/user/Usertrans/mytranshistory/',
			Buyticket: baseUrl() + '/pay/Buyticket/',
			pointbuyticketway: baseUrl() + '/pay/Buyticket/pointbuyticketway/',
			logout: baseUrl() + '/user/logout/',
			userupimage: baseUrl() + '/user/Usercomplaint/uploadImg/',
			Usercomplaint: baseUrl() + '/user/Usercomplaint/',
			addComplaint: baseUrl() + '/user/Usercomplaint/addComplaint/',
			setImg: baseUrl() + '/user/setting/setImg/'
		},
		Commodity: {
			commodityDetail: baseUrl() + '/commodity/commoditydetail',
			commodityList: baseUrl() + '/index/index/',
			category: baseUrl() + '/commodity/catalog/',
			praise: baseUrl() + '/commodity/praise/',
			commodityulist: baseUrl() + '/commodity/Commodityusers/',
			Usercomment: baseUrl() + '/user/Usercomment/',
			Commoditycomment: baseUrl() + '/commodity/Commoditycomment/',
			comments: baseUrl() + '/commodity/comment/',
			imgupload: baseUrl() + '/commodity/release/upload/',
			Commoditypublish: baseUrl() + '/commodity/release/',
			Commodityedite: baseUrl() + '/commodity/release/update/',
			logisticslist: baseUrl() + '/logistics/',
			logisticssendmail: baseUrl() + '/logistics/index/sendMailtoLCO/'
		},
		Trans: {
			transConversation: baseUrl() + '/transaction/transoperation/trans_conversation/', //请求/订单对话API:
			transCommdChange: baseUrl() + '/transaction/transcommdchange/', //提交请求商品变更API:
			transShowRequest: baseUrl() + '/transaction/transrequest/show_request_detail/', //显示当前交易请求/订单API
			transGetUserCommd: baseUrl() + '/transaction/transpublic/get_user_commodity/',
			transRequest: baseUrl() + '/transaction/transrequest/',
			transOrderEvaluate: baseUrl() + '/transaction/transoperation/trans_order_evaluate/',
			transOrderReceipt: baseUrl() + '/transaction/transoperation/trans_order_receipt/',
			transOrderLogustics: baseUrl() + '/transaction/transoperation/trans_order_logistics/',
			transSubmitOrder: baseUrl() + '/transaction/transoperation/trans_submit_order/',
			transRequestOrder: baseUrl() + '/transaction/transoperation/trans_request_order/',
			transChangePrice: baseUrl() + '/transaction/transoperation/trans_change_price/',
			transStop: baseUrl() + '/transaction/transoperation/transaction_stop/',
			transEdite: baseUrl() + '/transaction/transoperation/transaction_show/',
			transUrgeDelive: baseUrl() + '/transaction/transoperation/trans_urge_deliver/',
			transUrgeReceipt: baseUrl() + '/transaction/transoperation/trans_urge_receipt/'
		}
	};
	Api.Params = {
		email: 'email',
		username: 'user_name',
		password: 'user_pwd',
		token: 'tokencheck',
		sign: 'signcheck',
		loginType: 'enroll_type',
		nickName: 'nickname',
		openId: 'openid',
		headimgUrl: 'headimgurl',
		addressId: 'address_id',
		vCode: 'vc_code',
		rCode: 'recom_code',
		page: 'page'
	};

	function call(url, params, callback) {
		var $d = $.Deferred();
		Log.i("current API URL is " + url);
		params[Api.Params.token] = getToken();
		params[Api.Params.sign] = createSignInfo();
		Log.i("current API params is ----> ");
		Log.i(params);
		mui.ajax(url, {
			data: params,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				Log.i(data);
				setToken(data.result.tokencheck);
				if(data.result.status == STATUS.OK && Validator.isFunc(callback.ok))
					callback.ok(data.result)
				else if(data.result.status == STATUS.NG && Validator.isFunc(callback.ng)) {
					if(DEBUG) {
						var description = "";
						if(Validator.isObj(data.result.statuscode)) {
							for(var i in data.result.statuscode) {
								var property = data.result.statuscode[i];
								description += i + " = " + property + "\n";
							}
						}
						var alertInfo = Validator.isObj(data.result.statuscode) ? description : data.result.statuscode;
						alert("return NG, statuscode is " + alertInfo + ". API URL is " + url);
					}
					callback.ng(data.result.statuscode);
				}
				$d.resolve();
			},
			error: function(xhr, type, errorThrown) {
				Log.e(xhr);
				Log.e(type);
				Log.e(errorThrown);
				if(DEBUG) {
					alert("ajax error callback. error type is " + type);
				}
				plus.ui.alert(TextMessage.not_network);
				if(Validator.isFunc(callback.error)) callback.error();
				$d.reject();
			}
		});
		return $d.promise();
	}
	Api.call = call;

	/**
	 * create sign info
	 */
	function createSignInfo() {
		var timestamp = (new Date()).valueOf().toString();
		var sub_timestamp = timestamp.substring(timestamp.length - 8, timestamp.length - 1);
		var signQ = sha256_digest(sub_timestamp + "#" + secretKey + "#");
		var signA = sha256_digest(timestamp + "#" + signQ + "#" + secretKey);
		return timestamp + "_" + signQ + "_" + signA;
	}
	Api.createSignInfo = createSignInfo;

	/**
	 * return token info
	 */
	function getToken() {
		var token = "";
		if(typeof(plus) != "undefined") {
			token = plus.storage.getItem('token');
			if(token == null) {
				return "";
			}
		} else {
			throw new Error("plus is undefined, you should call mui.plusReady().");
			return null;
		}
		return token;
	}
	Api.getToken = getToken;

	/**
	 * save token info
	 */
	function setToken(token) {
		Log.d("setToken function is " + token);
		if(typeof(token) != "undefined" && token != null && token != "" && typeof(plus) != "undefined") {
			plus.storage.setItem('token', token);
			Log.d("save token to storage.");
		}
	}
	Api.setToken = setToken;
	
	function getApiUrl(flag){
		var apiUrl = '';
		switch(flag){
			case 'transConversation':
				apiUrl = baseUrl() + '/transaction/transoperation/trans_conversation/';
				break;
			case 'transConversation': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_conversation/'; //请求/订单对话API:
				break;
			case 'transCommdChange': 
				apiUrl = baseUrl() + '/transaction/transcommdchange/'; //提交请求商品变更API:
				break;
			case 'transShowRequest': 
				apiUrl = baseUrl() + '/transaction/transrequest/show_request_detail/'; //显示当前交易请求/订单API
				break;
			case 'transGetUserCommd': 
				apiUrl = baseUrl() + '/transaction/transpublic/get_user_commodity/';
				break;
			case 'transRequest': 
				apiUrl = baseUrl() + '/transaction/transrequest/';
				break;
			case 'transOrderEvaluate': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_order_evaluate/';
				break;
			case 'transOrderReceipt': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_order_receipt/';
				break;
			case 'transOrderLogustics': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_order_logistics/';
				break;
			case 'transSubmitOrder': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_submit_order/';
				break;
			case 'transRequestOrder': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_request_order/';
				break;
			case 'transChangePrice': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_change_price/';
				break;
			case 'transStop': 
				apiUrl = baseUrl() + '/transaction/transoperation/transaction_stop/';
				break;
			case 'transEdite': 
				apiUrl = baseUrl() + '/transaction/transoperation/transaction_show/';
				break;
			case 'transUrgeDelive': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_urge_deliver/';
				break;
			case 'transUrgeReceipt': 
				apiUrl = baseUrl() + '/transaction/transoperation/trans_urge_receipt/';
				break;
		}
		return apiUrl;
	}
	Api.getApiUrl = getApiUrl;
})(Api || (Api = {}));
var Repository;
(function(Repository) {
	var User;
	(function(User) {
		function checkEmail(params, callback) {
			return Api.call(Api.url.User.checkEmail, params, callback);
		}
		User.checkEmail = checkEmail;

		function register(params, callback) {
			return Api.call(Api.url.User.register, params, callback);
		}
		User.register = register;

		function login(params, callback) {
			return Api.call(Api.url.User.login, params, callback);
		}
		User.login = login;

		function forgetPwd(params, callback) {
			return Api.call(Api.url.User.forgetPwd, params, callback);
		}
		User.forgetPwd = forgetPwd;

		function Usershow(params, callback) {
			return Api.call(Api.url.User.Usershow, params, callback);
		}
		User.Usershow = Usershow;

		function userinfo(params, callback) {
			return Api.call(Api.url.User.userinfo, params, callback);
		}
		User.userinfo = userinfo;

		function Usertranslist(params, callback) {
			return Api.call(Api.url.User.Usertranslist, params, callback);
		}
		User.Usertranslist = Usertranslist;

		function mytranshistory(params, callback) {
			return Api.call(Api.url.User.mytranshistory, params, callback);
		}
		User.mytranshistory = mytranshistory;

		function Buyticket(params, callback) {
			return Api.call(Api.url.User.Buyticket, params, callback);
		}
		User.Buyticket = Buyticket;

		function pointbuyticketway(params, callback) {
			return Api.call(Api.url.User.pointbuyticketway, params, callback);
		}
		User.pointbuyticketway = pointbuyticketway;

		function logout(params, callback) {
			return Api.call(Api.url.User.logout, params, callback);
		}
		User.logout = logout;

		function Usercomplaint(params, callback) {
			return Api.call(Api.url.User.Usercomplaint, params, callback);
		}
		User.Usercomplaint = Usercomplaint;

		function addComplaint(params, callback) {
			return Api.call(Api.url.User.addComplaint, params, callback);
		}
		User.addComplaint = addComplaint;
	})(User = Repository.User || (Repository.User = {}));
	Repository.User = User;

	var Commodity;
	(function(Commodity) {
		function commodityDetail(params, callback) {
			return Api.call(Api.url.Commodity.commodityDetail, params, callback);
		}
		Commodity.commodityDetail = commodityDetail;

		function commodityList(params, callback) {
			return Api.call(Api.url.Commodity.commodityList, params, callback);
		}
		Commodity.commodityList = commodityList;

		function category(params, callback) {
			return Api.call(Api.url.Commodity.category, params, callback);
		}
		Commodity.category = category;

		function praise(params, callback) {
			return Api.call(Api.url.Commodity.praise, params, callback);
		}
		Commodity.praise = praise;

		function commodityulist(params, callback) {
			return Api.call(Api.url.Commodity.commodityulist, params, callback);
		}
		Commodity.commodityulist = commodityulist;

		function Usercomment(params, callback) {
			return Api.call(Api.url.Commodity.Usercomment, params, callback);
		}
		Commodity.Usercomment = Usercomment;

		function Commoditycomment(params, callback) {
			return Api.call(Api.url.Commodity.Commoditycomment, params, callback);
		}
		Commodity.Commoditycomment = Commoditycomment;

		function comments(params, callback) {
			return Api.call(Api.url.Commodity.comments, params, callback);
		}
		Commodity.comments = comments;

		function imgupload(params, callback) {
			return Api.call(Api.url.Commodity.imgupload, params, callback);
		}
		Commodity.imgupload = imgupload;

		function Commoditypublish(params, callback) {
			return Api.call(Api.url.Commodity.Commoditypublish, params, callback);
		}
		Commodity.Commoditypublish = Commoditypublish;

		function Commodityedite(params, callback) {
			return Api.call(Api.url.Commodity.Commodityedite, params, callback);
		}
		Commodity.Commodityedite = Commodityedite;

		function logisticslist(params, callback) {
			return Api.call(Api.url.Commodity.logisticslist, params, callback);
		}
		Commodity.logisticslist = logisticslist;

		function logisticssendmail(params, callback) {
			return Api.call(Api.url.Commodity.logisticssendmail, params, callback);
		}
		Commodity.logisticssendmail = logisticssendmail;
	})(Commodity = Repository.Commodity || (Repository.Commodity = {}));
	Repository.Commodity = Commodity;
	var Transaction;
	(function(Transaction) {
		function trans(flag,params,callback){
			apiUrl = Api.getApiUrl(flag);
			return Api.call(apiUrl, params, callback);
		}
		Transaction.trans = trans;
		function transRequest(params, callback) {
			return Api.call(Api.url.Trans.transRequest, params, callback);
		}
		Transaction.transRequest = transRequest;

		function transConversation(params, callback) {
			return Api.call(Api.url.Trans.transConversation, params, callback);
		}
		Transaction.transConversation = transConversation;

		function transGetUserCommd(params, callback) {
			return Api.call(Api.url.Trans.transGetUserCommd, params, callback);
		}
		Transaction.transGetUserCommd = transGetUserCommd;

		function transShowRequest(params, callback) {
			return Api.call(Api.url.Trans.transShowRequest, params, callback);
		}
		Transaction.transShowRequest = transShowRequest;

		function transCommdChange(params, callback) {
			return Api.call(Api.url.Trans.transCommdChange, params, callback);
		}
		Transaction.transCommdChange = transCommdChange;

		function transConversation(params, callback) {
			return Api.call(Api.url.Trans.transConversation, params, callback);
		}
		Transaction.transConversation = transConversation;

		function transOrderEvaluate(params, callback) {
			return Api.call(Api.url.Trans.transOrderEvaluate, params, callback);
		}
		Transaction.transOrderEvaluate = transOrderEvaluate;

		function transOrderReceipt(params, callback) {
			return Api.call(Api.url.Trans.transOrderReceipt, params, callback);
		}
		Transaction.transOrderReceipt = transOrderReceipt;

		function transOrderLogustics(params, callback) {
			return Api.call(Api.url.Trans.transOrderLogustics, params, callback);
		}
		Transaction.transOrderLogustics = transOrderLogustics;

		function transSubmitOrder(params, callback) {
			return Api.call(Api.url.Trans.transSubmitOrder, params, callback);
		}
		Transaction.transSubmitOrder = transSubmitOrder;

		function transRequestOrder(params, callback) {
			return Api.call(Api.url.Trans.transRequestOrder, params, callback);
		}
		Transaction.transRequestOrder = transRequestOrder;

		function transChangePrice(params, callback) {
			return Api.call(Api.url.Trans.transChangePrice, params, callback);
		}
		Transaction.transChangePrice = transChangePrice;

		function transStop(params, callback) {
			return Api.call(Api.url.Trans.transStop, params, callback);
		}
		Transaction.transStop = transStop;

		function transEdite(params, callback) {
			return Api.call(Api.url.Trans.transEdite, params, callback);
		}
		Transaction.transEdite = transEdite;
		function transUrgeDelive(params, callback) {
			return Api.call(Api.url.Trans.transUrgeDelive, params, callback);
		}
		Transaction.transUrgeDelive = transUrgeDelive;
		function transUrgeReceipt(params, callback) {
			return Api.call(Api.url.Trans.transUrgeReceipt, params, callback);
		}
		Transaction.transUrgeReceipt = transUrgeReceipt;
		
	})(Transaction = Repository.Transaction || (Repository.Transaction = {}));
	Repository.Transaction = Transaction;
})(Repository || (Repository = {}));
var Log;
(function(Log) {
	var level = 4;
	Log._level = {
		NONE: 0,
		ERROR: 1,
		WARN: 2,
		INFO: 3,
		DEBUG: 4
	};

	function e(data) {
		if(level >= Log._level.ERROR)
			console.error(data)
	}
	Log.e = e;

	function w(data) {
		if(level >= Log._level.WARN)
			console.warn(data)
	}
	Log.w = w;

	function i(data) {
		if(level >= Log._level.INFO)
			console.info(data)
	}
	Log.i = i;

	function d(data) {
		if(level >= Log._level.DEBUG)
			console.debug(data)
	}
	Log.d = d;
})(Log || (Log = {}));
var TextMessage;
(function(TextMessage) {
	var language = (navigator.language == "ja-JP" || navigator.language == "ja-jp");
	TextMessage.back = language ? "戻る" : "返回";
	TextMessage.skip = language ? "スキップ" : "跳过";
	TextMessage.test = language ? "まずはログインしてください。" : "请先登录!";
	TextMessage.share = language ? "共有" : "分享到";
	TextMessage.success = language ? "成功!" : "成功!";
	TextMessage.faile = language ? "失敗:" : "失败:";
	TextMessage.sharecontent = language ? "カンカンからの共有" : "看看的分享";
	TextMessage.sharetitle = language ? "カンカン" : "看看";
	TextMessage.login = language ? "登録済みの方はこちら" : "登录";
	TextMessage.register = language ? "新しいはじめる方はこちら" : "注册";
	TextMessage.cancel = language ? "キャンセル" : "取消";
	TextMessage.towchatfrind = language ? "微信の友を送る" : "发送给微信好友";
	TextMessage.towchatcircle = language ? "友達の輪に分けて、友達の" : "分享到微信朋友圈";
	TextMessage.allshowmes = language ? "全て" : "全部";
	TextMessage.goodshowmes = language ? "良い" : "好评";
	TextMessage.normalshowmes = language ? "普通" : "中评";
	TextMessage.badshowmes = language ? "悪い" : "差评";
	TextMessage.datanull = language ? "暫時データ" : "暂无数据";
	TextMessage.not_network = language ? "申し訳ございません。ただ今ネットワークが問題がありますが、1分間立ってもう一度お試してください。" : "当前网络不给力，请稍后再试";
	TextMessage.contentlength = language ? "レビューの内容（300字を超えない）" : "评论内容（不超过三百字）";
	TextMessage.commenttestnull = language ? "コメントの内容は空っぽにならない!" : "评论内容不能为空!";
	TextMessage.commenttestlength = language ? "レビューの内容300字を超えない!" : "评论内容不能超过三百字！!";
	TextMessage.send_code_ok = language ? "認証コードは入力したメールに送りました。ご確認をお願い致します。" : "验证码已发送至邮箱，请查收。";
	TextMessage.send_code_ng = language ? "認証コード発送が失敗しました、もう一度お試してください。" : "发送验证码失败，请重试。";
	TextMessage.wechat_not_install = language ? "Wechatはまだインストールされていません。" : "您尚未安装微信客户端";
	TextMessage.username = language ? "ユーザー名" : "用户名";
	TextMessage.verificationCode = language ? "確認コード" : "验证码";
	TextMessage.login_error = language ? "登録名もしくはパスワードが間違っています。" : "用户名或者密码错误";
	TextMessage.send_verification_code = language ? "認証コードを発信" : "发送验证码";
	TextMessage.commodity_descriptionlength = language ? "商品説明（1000文字まで）" : "商品说明（1000字以内）";
	TextMessage.publishsure = language ? "確認出品する？" : "确认出品展出吗?";
	TextMessage.tackpicture = language ? "写真撮影" : "拍照";
	TextMessage.comdity_takepic = language ? "撮影" : "拍摄";
	TextMessage.gallerychoose = language ? "携帯電話からアルバムを選ぶ" : "从手机相册中选择";
	TextMessage.chooseimage = language ? "写真を選択する" : "选择照片";
	TextMessage.operation_error = language ? "自分出品した商品が操作できません。" : "不允许对自己的商品操作";
	TextMessage.errorCode_1001 = language ? "検証番号の有効期限が切れて、再び試みて下さい " : "您输入的验证码已过期，请重试！";
	TextMessage.errorCode_1002 = language ? "空白できません、再入力してください" : "不能为空，请重新输入";
	TextMessage.prostaute0 = language ? "新品・未使用" : "未使用过";
	TextMessage.prostaute1 = language ? "未使用に近い" : "几乎未使用过";
	TextMessage.prostaute2 = language ? "目立った傷や汚れなし " : "无使用痕迹";
	TextMessage.prostaute3 = language ? "傷や汚れあり " : "有使用过痕迹";
	TextMessage.pro_imagetest = language ? "出品したい商品のため少なくとも一枚画像を選択してください!" : "请为商品至少选择一张图片!";
	TextMessage.pro_nametest = language ? "商品名称を設定してください。" : "商品名称不能为空";
	TextMessage.pro_descriptiontest = language ? "商品の簡単な説明文を入力" : "商品描述不能为空";
	TextMessage.pro_sorttest = language ? "商品のカテゴリを選択してください。" : "请选择商品分类";
	TextMessage.pro_stautetest = language ? "商品の状態を設定してください。" : "请选择商品状态";
	TextMessage.pro_pricetest = language ? "価格は数字のみを設定してください" : "价格只能是数字";
	TextMessage.pro_pricenumbtest = language ? "有効な数字（0円以上）を設定してください" : "价格必须大于0";
	TextMessage.pro_buywaytest = language ? "取引手段を設定してください。" : "请选择交易手段";
	TextMessage.pro_logininfo = language ? "登録う成功" : "发布成功";
	TextMessage.pro_pricenulltest = language ? "商品価格を設定してください!" : "商品价格不能为空!";
	TextMessage.not_exist_email = language ? "無効なメールアドレスです。" : "该邮箱不存在";
	TextMessage.commodity_edit = language ? "商品編集" : "商品编辑";
	TextMessage.updatesuccessinfo = language ? "更新が成功する!" : "更新成功!";
	TextMessage.edite_headimage = language ? "改正頭像" : "修改头像";
	TextMessage.sendtextrequest = language ? "にメールを送りますか" : "发送电子邮件";
	TextMessage.telrequesttext = language ? "に電話を送りますか" : "拨打电话";
	TextMessage.sedsuccseetext = language ? "ご利用ありがとうございます。" : "谢谢您的使用";
	TextMessage.mailsucetext = language ? "ににメールを送りました。" : "给我发送了邮件";
	TextMessage.requestmailtext = language ? "返信お待ちください。" : "请回复";
	TextMessage.sendmailbutext = language ? "メール送信" : "发送邮件";
	TextMessage.calbutext = language ? "電話" : "电话";
	TextMessage.homebutext = language ? "ホームページへ" : "主页";
	TextMessage.comdity_null = language ? "暫時データ" : "暂无数据";
	TextMessage.email_error = language ? "メール、ユーザー名が間違っています、もしくはすでに存在しています、" : "注册邮箱/用户名 错误，或已存在";
	TextMessage.requireing = language ? "問い合わせ中" : "请求中";
	TextMessage.requresuces = language ? "交易成立" : "交易成立";
	TextMessage.userng = language ? "この口座利用できない" : "该账户不可用";
	TextMessage.pointnot = language ? "ポイントポイント不足" : "Point点数不足";
	TextMessage.buywaynot = language ? "購入方は無効" : "购买方式无效";
	TextMessage.buyyes = language ? "購入成功" : "购买成功";
	TextMessage.sure = language ? "確認" : "确认";
	TextMessage.logoutconfirm = language ? "確定して登録するかな？" : "确定要退出登录吗?";
	TextMessage.logouttitle = language ? "登録するかな" : "退出登录";
	TextMessage.logoutsuccess = language ? "成功する" : "退出成功";
	TextMessage.requiresuccess = language ? "クレーム提出が成功しました" : "申述成功提出";
	TextMessage.namenotnull = language ? "ユーザー名を入力してください" : "姓名不能为空";
	TextMessage.contentnotnull = language ? "内容を入力してください" : "内容不能为空";
	TextMessage.noopen = language ? "開通していない、お楽しみに" : "暂未开通，敬请期待";
	TextMessage.ticketng = language ? "チケット数が不足" : "Ticket数量不足";
	TextMessage.yes = language ? "はい" : "好的";
	TextMessage.input_email = language ? "メールアドレスを設定してください。" : "请补充邮箱信息";
})(TextMessage || (TextMessage = {}));
var Entity;
(function(Entity) {
	var Commodity = (function() {
		function Commodity() {
			var self = this;
			this.classes = ko.observable(null);
			this.commName = ko.observable(null);
			this.commodityId = ko.observable(null);
			this.imgs = ko.observable(null);
			this.praise = ko.observable(null);
			this.price = ko.observable(null);
			this.likeFlg = ko.observable(null);
		}
		Commodity.prototype.fromJson = function(json) {
			if(Validator.isNull(json)) return;
			this.classes = json.classes;
			this.commName = json.comm_name;
			this.commodityId = json.commodity_id;
			this.imgs = json.imgs;
			this.praise = json.praise;
			this.price = json.price;
			this.likeFlg = json.like_flg;
		};
		Commodity.prototype.reset = function() {
			this.classes(null);
			this.commName(null);
			this.commodityId(null);
			this.imgs(null);
			this.praise(null);
			this.price(null);
			this.likeFlg(null);
		};
		return Commodity;
	}());
	Entity.Commodity = Commodity;
	var Category = (function() {
		function Category() {
			var self = this;
			this.category_detail = ko.observable(null);
			this.category_id = ko.observable(null);
			this.category_href = ko.observable(null);
		}
		Category.prototype.fromJson = function(json) {
			if(Validator.isNull(json)) return;
			this.category_detail = json.catalog_detail;
			this.category_id = json.catalog_id;
			this.category_href = "#" + json.catalog_id;
		}
		Category.prototype.reset = function() {
			this.category_detail(null);
			this.category_id(null);
			this.category_href(null);
		}
		return Category;
	}());
	Entity.Category = Category;
})(Entity || (Entity = {}));