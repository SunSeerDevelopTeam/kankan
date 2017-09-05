var secretKey = "justfortest00001xxxxOOOX";
var DEBUG = false;
var DEVELOPMENT = false;
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
			//return "http://www.kankann.jp:7998";
			return "https://www.kankann.jp:442";
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
			setImg: baseUrl() + '/user/setting/setImg/',
			email_rgister_check: baseUrl() + '/user/Setemail/',
			personal_infor: baseUrl() + '/user/Useraccount/getbankname/',
			personal_finish: baseUrl() + '/user/Useraccount/',
			getpersonal_bankinfor: baseUrl() + '/user/Useraccount/u_accountshow',
			set_message: baseUrl() + '/user/usersystemmsg/set_message/',
			del_message: baseUrl() + '/user/usersystemmsg/del_message/',
			get_message: baseUrl() + '/user/usersystemmsg/get_message/'

		},
		Commodity: {
			reportCommReason: baseUrl() + '/commodity/Commoditydetail/reportCommReason',
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
			logisticscontact:baseUrl() + '/logistics/index/setAccess',
			logisticssendmail: baseUrl() + '/logistics/index/sendMailtoLCO/',
			shareurl: baseUrl() + '/share.php?wxparms=',
			shareid: baseUrl() + '/commodity/Encryption/',
			delete_pro: baseUrl() + '/commodity/release/delete/',
			getPrice: baseUrl() + '/commodity/release/infobase',
			reportCommodity: baseUrl() + '/commodity/Commoditydetail/reportCommodity',
			CommodityReportShow: baseUrl() + '/commodity/Commoditydetail/commodityreportshow',
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
			transUrgeReceipt: baseUrl() + '/transaction/transoperation/trans_urge_receipt/',
			/*add 支付页面显示*/
			transPayshow: baseUrl() + '/transaction/transoperation/trans_pay_show/',
			/*add 去付款*/
			transgotoPay: baseUrl() + '/transaction/transoperation/trans_pay_choice/',
			balancemanagement:baseUrl() + '/user/usertransfer/',
			gettransferrecord:baseUrl() + '/user/usertransfer/gettransferrecord/',
			canceltransfer:baseUrl() + '/user/usertransfer/recorddel/',
			applytransfer:baseUrl() + '/user/usertransfer/applyshow/',
			transfersubmit:baseUrl() + '/user/usertransfer/transfer_submit',
			getTotalMoney: baseUrl() + '/user/Usertrans/gettransprofit',
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
//		ajax_error.checkNet();
		mui.ajax(url, {
			data: params,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				Log.i(data);
				setToken(data.result.tokencheck);
				saveLoginStatus(data);
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
				var errortypetext = Api.errortype(type, url);
				Log.e(xhr);
				Log.e(type);
				Log.e(errorThrown);
				if(DEBUG) {
					alert("ajax error callback. error type is " + type);
				}
				if(Validator.isFunc(callback.error)) callback.error(errortypetext);
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
	function errortype(type, url){
		var splitFlag = "<br/>";
		if (url === Api.url.Commodity.commodityList
		||	url === Api.url.User.logout
		) {
			splitFlag = "\n";
		}
		switch(type){
			case "abort":
				return TextMessage.nonetwork + splitFlag +TextMessage.nonetwork2;
				break;
			case "timeout":
				return TextMessage.timeouttext + splitFlag + TextMessage.timeouttext2;
				break;
			default:
				return TextMessage.intralerror + splitFlag + TextMessage.timeouttext2;
				break;
		}
	}
	Api.errortype = errortype;
	
	function callback_ng(data) {
		if(Validator.isObj(data)) {
			$.each(data, function(key, value) {
				error_msg(value, key);
			});
		} else {
			error_msg(data);
		}
	}
	Api.callback_ng = callback_ng;

	function saveLoginStatus(data) {
		if(typeof(plus) != "undefined") {
			plus.storage.setItem('email', data.result.email);
			plus.storage.setItem('myid', data.result.myid);
		}
	}

	function error_msg(err_code, key) {
		Log.i("message send faild!");

		var err_msg = '';
		switch(err_code) {
			case '1000':
				alert(TextMessage.test);;
				break;
			case '1001':
				if(key == Api.Params.vCode) err_msg = TextMessage.verificationCode + TextMessage.errorCode_1001;
				else err_msg = TextMessage.errorCode_1001;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1002':
				if(key == Api.Params.username) {
					err_msg = TextMessage.username + TextMessage.errorCode_1002;
				} else if (key == Api.Params.email) {
					err_msg = TextMessage.emailnull;
				} else {
					err_msg = TextMessage.errorCode_1002;
				}
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1003':
				err_msg = TextMessage.errorCode_1003;
				if (key == Api.Params.email) {
					err_msg = key + err_msg;
				}
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1004':
				err_msg = TextMessage.errorCode_1004;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1005':
				err_msg = TextMessage.errorCode_1005;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1006':
				err_msg = TextMessage.errorCode_1006;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '1007':
				err_msg = TextMessage.errorCode_1007;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '0001':
				err_msg = TextMessage.errorCode_0001;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '0100':
				err_msg = TextMessage.errorCode_0100;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2001':
				err_msg = TextMessage.errorCode_2001;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2002':
				err_msg = TextMessage.errorCode_2002;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2003':
				err_msg = TextMessage.errorCode_2003;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2004':
				err_msg = TextMessage.errorCode_2004;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2005':
				err_msg = TextMessage.errorCode_2005;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2006':
				err_msg = TextMessage.errorCode_2006;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2007':
				err_msg = TextMessage.errorCode_2007;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2008':
				err_msg = TextMessage.errorCode_2008;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2009':
				err_msg = TextMessage.errorCode_2009;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2010':
				err_msg = TextMessage.not_exist_email;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2011':
				err_msg = TextMessage.errorCode_2011;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2012':
				err_msg = TextMessage.errorCode_2012;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2013':
				err_msg = TextMessage.email_error;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2014':
				err_msg = TextMessage.errorCode_2014;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2015':
				err_msg = TextMessage.errorCode_2015;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2016':
				err_msg = TextMessage.errorCode_2016;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2017':
				err_msg = TextMessage.errorCode_2017;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2018':
				err_msg = TextMessage.errorCode_2018;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2019':
				mui.plusReady(function() {
					var preView = plus.webview.getWebviewById('transaction');
					plus.webview.close(preView);
					var mainpage = plus.webview.getWebviewById('pullrefresh_with_tab');
					mui.back();
					mui.fire(mainpage, 'refresh', {
						refresh: "canRefresh"
					});
				});
				break;
			case '2020':
				err_msg = TextMessage.errorCode_2020;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '2021':
				err_msg = TextMessage.errorCode_2021;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3001':
				err_msg = TextMessage.errorCode_3001;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3003':
				err_msg = TextMessage.errorCode_3003;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3004':
				err_msg = TextMessage.errorCode_3004;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3005':
				err_msg = TextMessage.errorCode_3005;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3006':
				err_msg = TextMessage.errorCode_3006;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3008':
				err_msg = TextMessage.errorCode_3008;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3009':
				err_msg = TextMessage.errorCode_3009;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3010':
				err_msg = TextMessage.errorCode_3010;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3011':
				err_msg = TextMessage.errorCode_3011;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '3020':
				err_msg = TextMessage.errorCode_3020;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				mui.openWindow({
					url: "/pages/login/emai_summate.html",
					id: "emaisummate",
					extras: {
						"transid": trans_id
					}
				})
				break;
			case '5000':
				err_msg = TextMessage.errorCode_5000;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			case '5001':
				err_msg = TextMessage.emailsenderror;
				mui.toast(err_msg, {
					duration: 'long',
					type: 'div'
				});
				break;
			default:
				break;
		}

	}
	Api.error_msg = error_msg;

	function getApiUrl(flag) {
		var apiUrl = "";
		switch(flag) {
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

		function email_rgister_check(params, callback) {
			return Api.call(Api.url.User.email_rgister_check, params, callback);
		}
		User.email_rgister_check = email_rgister_check;
        
        function personal_infor(params, callback) {
        	return Api.call(Api.url.User.personal_infor, params, callback);
        }
        User.personal_infor = personal_infor;
        
        function personal_finish(params, callback) {
        	return Api.call(Api.url.User.personal_finish, params, callback);
        }
        User.personal_finish = personal_finish;
        
        function getpersonal_bankinfor(params, callback) {
        	return Api.call(Api.url.User.getpersonal_bankinfor, params, callback);
        }
        User.getpersonal_bankinfor = getpersonal_bankinfor;
        
		function set_message(params, callback) {
			return Api.call(Api.url.User.set_message, params, callback);
		}
		User.set_message = set_message;

		function del_message(params, callback) {
			return Api.call(Api.url.User.del_message, params, callback);
		}
		User.del_message = del_message;

		function get_message(params, callback) {
			return Api.call(Api.url.User.get_message, params, callback);
		}
		User.get_message = get_message;

		function isLogin() {
			var myid = plus.storage.getItem("myid");
			if (myid == "" || myid == null) {
				if (mui('#clickzan').length != 0) {
					mui('#clickzan').popover('toggle');
				} else {
					if (plus) {
						var homePage = plus.webview.getWebviewById("home.html");
						mui.fire(homePage, 'showActionSheet', {
							isShow: 'yes'
						});
					}
				}
				return false;
			}
			return true;
		}
		User.isLogin = isLogin;

		function isEmptyEmail() {
			var email = plus.storage.getItem("email");
			if(email == "" || email == null) {
				plus.nativeUI.alert(TextMessage.input_email, function(event) {
					if (event.index == 0) {
						mui.openWindow({
							id: "emai_summate",
							url: "/pages/login/emai_summate.html",
							waiting: {
								autoShow: false
							},
							show: {
								duration: 200
							}
						});
					}
				}, TextMessage.sharetitle, TextMessage.yes);
				return false;
			}
			return true;
		}
		User.isEmptyEmail = isEmptyEmail;
	})(User = Repository.User || (Repository.User = {}));
	Repository.User = User;

	var Commodity;
	(function(Commodity) {
		function CommodityReportShow(params, callback) {
			return Api.call(Api.url.Commodity.CommodityReportShow, params, callback);
		}
		Commodity.CommodityReportShow = CommodityReportShow;
        function reportCommReason(params, callback) {
        	return Api.call(Api.url.Commodity.reportCommReason, params, callback);
        }
        Commodity.reportCommReason = reportCommReason;

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

		function logisticscontact(params, callback) {
			return Api.call(Api.url.Commodity.logisticscontact, params, callback);
		}
		Commodity.logisticscontact = logisticscontact;
		
		function logisticssendmail(params, callback) {
			return Api.call(Api.url.Commodity.logisticssendmail, params, callback);
		}
		Commodity.logisticssendmail = logisticssendmail;
		
		function delete_pro(params, callback) {
			return Api.call(Api.url.Commodity.delete_pro, params, callback);
		}
		Commodity.delete_pro = delete_pro;
		
		function getPrice(params, callback) {
			return Api.call(Api.url.Commodity.getPrice, params, callback);
		}
		Commodity.getPrice = getPrice;

		function reportCommodity(params, callback) {
			return Api.call(Api.url.Commodity.reportCommodity, params, callback);
		}
		Commodity.reportCommodity = reportCommodity;
		
		function shareid(params, callback) {
			return Api.call(Api.url.Commodity.shareid, params, callback);
		}
		Commodity.shareid = shareid;
	})(Commodity = Repository.Commodity || (Repository.Commodity = {}));
	Repository.Commodity = Commodity;
	var Transaction;
	(function(Transaction) {
		function trans(flag, params, callback) {
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
		
		function transPayshow(params, callback) {
			return Api.call(Api.url.Trans.transPayshow, params, callback);
		}
        Transaction.transPayshow = transPayshow;
        
        function transgotoPay(params, callback) {
        	return Api.call(Api.url.Trans.transgotoPay, params, callback);
        }
        Transaction.transgotoPay = transgotoPay;
        
        function balancemanagement(params, callback) {
			return Api.call(Api.url.Trans.balancemanagement, params, callback);
		}
        Transaction.balancemanagement = balancemanagement;
        
        function gettransferrecord(params, callback) {
			return Api.call(Api.url.Trans.gettransferrecord, params, callback);
		}
        Transaction.gettransferrecord = gettransferrecord;
        
        function canceltransfer(params, callback) {
			return Api.call(Api.url.Trans.canceltransfer, params, callback);
		}
        Transaction.canceltransfer = canceltransfer;
        
        function applytransfer(params, callback) {
			return Api.call(Api.url.Trans.applytransfer, params, callback);
		}
        Transaction.applytransfer = applytransfer;
        
        function transfersubmit(params, callback) {
			return Api.call(Api.url.Trans.transfersubmit, params, callback);
		}
        Transaction.transfersubmit = transfersubmit;
        
        function getTotalMoney(params, callback) {
        	return Api.call(Api.url.Trans.getTotalMoney, params, callback);
        }
        Transaction.getTotalMoney = getTotalMoney;
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
	TextMessage.test = language ? "ログインしてください。" : "请先登录!";
	TextMessage.share = language ? "シェア" : "分享到";
	TextMessage.success = language ? "成功!" : "成功!";
	TextMessage.faile = language ? "失敗:" : "失败:";
	TextMessage.sharecontent = language ? "カンカンをシェアする" : "看看的分享";
	TextMessage.sharetitle = language ? "カンカン" : "看看";
	TextMessage.login = language ? "ログイン" : "登录";
	TextMessage.register = language ? "新規登録" : "注册";
	TextMessage.cancel = language ? "キャンセル" : "取消";
	TextMessage.towchatfrind = language ? "WeChatのチャットに送信" : "发送给微信好友";
	TextMessage.towchatcircle = language ? "WeChatのモーメンツ上で共有" : "分享到微信朋友圈";
	TextMessage.allshowmes = language ? "全て" : "全部";
	TextMessage.goodshowmes = language ? "良い" : "好评";
	TextMessage.normalshowmes = language ? "普通" : "中评";
	TextMessage.badshowmes = language ? "悪い" : "差评";
	TextMessage.datanull = language ? "お知らせはありません。" : "暂无数据";
	TextMessage.commentsnull = language ? "コメントがありません。" : "暂无评论";
	TextMessage.not_network = language ? "接続がタイムアウトしました。このサイトが一時的に利用できなくなっていたり、サーバーの負荷が高すぎて接続できなくなっている可能性があります。しばらくしてから再度お試しください。" : "当前网络不给力，请稍后再试";
	TextMessage.contentlength = language ? "レビュー内容(300字以内)" : "评论内容（不超过三百字）";
	TextMessage.commenttestnull = language ? "コメントが未入力です。" : "评论内容不能为空!";
	TextMessage.evecommenttestnull = language ? "評価のコメントが未入力です。" : "评价内容不能为空!";
	TextMessage.commenttestlength = language ? "レビューの内容(300字以内)!" : "评论内容不能超过三百字！!";
	TextMessage.send_code_ok = language ? "認証番号が入力したメールに送りました。ご確認をお願い致します。" : "验证码已发送至邮箱，请查收。";
	TextMessage.send_code_ng = language ? "認証番号発送が失敗しました、もう一度お試してください。" : "发送验证码失败，请重试。";
	TextMessage.wechat_not_install = language ? "Wechatはまだインストールされていません。" : "您尚未安装微信客户端";
	TextMessage.username = language ? "ユーザー名" : "用户名";
	TextMessage.verificationCode = language ? "認証番号" : "验证码";
	TextMessage.login_error = language ? "メールアドレスまたはパスワードが間違っています。" : "用户名或者密码错误";
	TextMessage.send_verification_code = language ? "認証番号を発信" : "发送验证码";
	TextMessage.commodity_descriptionlength = language ? "商品詳細(必須：1000文字まで)" : "商品说明（必须:1000字以内）";
	TextMessage.publishsure = language ? "出品しますか？" : "确认出品展出吗?";
	TextMessage.tackpicture = language ? "写真をとります" : "拍照";
	TextMessage.comdity_takepic = language ? "撮ります" : "拍摄";
	TextMessage.gallerychoose = language ? "アルバムから写真を選択する" : "从手机相册中选择";
	TextMessage.chooseimage = language ? "写真を選択します" : "选择照片";
	TextMessage.operation_error = language ? "自分で出品した商品は操作できません。" : "不允许对自己的商品操作";
	TextMessage.errorCode_1001 = language ? "認証番号の有効期限が切れています。" : "您输入的验证码已过期，请重试！";
	TextMessage.errorCode_1002 = language ? "入力してください" : "不能为空，请重新输入";
	TextMessage.errorCode_1000 = language ? "ログインしてください" : "请先登录";
	TextMessage.errorCode_1003 = language ? "フォーマットは正しくありません、再入力してください" : "格式不正确,请重新输入";
	TextMessage.errorCode_1004 = language ? "入力が間違っていますが、再入力して下さい" : "不一致，请重新输入";
	TextMessage.errorCode_1005 = language ? "すでに存在しましたので、再入力して下さい" : "已存在，请重新输入";
	TextMessage.errorCode_1006 = language ? "入力した文字列の長さは正しくなく、再入力して下さい" : "长度不正确，请重新输入";
	TextMessage.errorCode_1007 = language ? "画像サイズまたはフォーマットは正しくありません、再登録ください！" : "图片大小或格式不正确，请重新登录！";
	TextMessage.errorCode_0001 = language ? "再登録ください" : "请重新登录！";
	TextMessage.errorCode_0100 = language ? "通信が失敗しました、もう一度お試しください" : "系统出错啦，请稍后重试";
	TextMessage.errorCode_2001 = language ? "データーがありません" : "表示没有数据或者商品下架";
	TextMessage.errorCode_2002 = language ? "該当ユーザーが凍結、もしくは削除されました。" : "已冻结或已删除的用户";
	TextMessage.errorCode_2003 = language ? "商品が存在していません" : "要操作的商品不存在";
	TextMessage.errorCode_2004 = language ? "自分の商品に対して操作できません" : "不允许对自己的商品操作";
	TextMessage.errorCode_2005 = language ? "該当操作ができません" : "没有相关操作";
	TextMessage.errorCode_2006 = language ? "同じ商品に多重リクエストができません" : "不能对同一个商品多次提出交易申请";
	TextMessage.errorCode_2007 = language ? "チケットが不足です" : "用户ticket不足";
	TextMessage.errorCode_2008 = language ? "この商品はこの取引方法で引き取れません" : "该商品不支持这种交易方式";
	TextMessage.errorCode_2009 = language ? "選択した商品が不適切です" : "选择的商品有误";
	TextMessage.errorCode_2011 = language ? "選択した取引方法が間違っています" : "交易方式选择有误";
	TextMessage.errorCode_2012 = language ? "画像がありません" : "没有上传画像";
	TextMessage.errorCode_2013 = language ? "メール/ユーザー名が間違っています、もしくは存在しています" : "注册邮箱/用户名 错误，或已存在";
	TextMessage.errorCode_2014 = language ? "認証番号は無効になりました" : "验证码失效";
	TextMessage.errorCode_2015 = language ? "メールで失敗を発送する" : "邮件发送失败";
	TextMessage.errorCode_2016 = language ? "問い合わせ中商品なので、リクエストができません" : "该商品正在问合中，不能重复提交请求";
	TextMessage.errorCode_2017 = language ? "口座の殘高が不足して" : "您当前余额不足";
	TextMessage.errorCode_2018 = language ? "相手側の対応をお待ちください。" : "交易订单不存在或被删除";
	TextMessage.errorCode_2019 = language ? "コメントを発表したので、再度発表ができません" : "已发布评论，请勿重复发布";
	TextMessage.errorCode_2020 = language ? "既にリクエスト済みです。" : "已催促发货，请勿重复催促";
	TextMessage.errorCode_2021 = language ? "引取催促がすでに行ったので、再度操作できません" : "已催促收货，请勿重复催促";
	TextMessage.errorCode_3001 = language ? "ユーザー名またはパスワードが間違って" : "用户名或者密码错误";
	TextMessage.errorCode_3002 = language ? "注文が存在しません" : "订单不存在";
	TextMessage.errorCode_3003 = language ? "注文未提出" : "订单未提交";
	TextMessage.errorCode_3004 = language ? "注文が中止しました" : "订单已中止";
	TextMessage.errorCode_3005 = language ? "注文が完成しました" : "订单已完成";
	TextMessage.errorCode_3006 = language ? "請求者は存在していません" : "请求者不存在";
	TextMessage.errorCode_3008 = language ? "完備自分の情報をください" : "请完善自己的信息";
	TextMessage.errorCode_3009 = language ? "注文が存在していません" : "订单不存在或者失效";
	TextMessage.errorCode_3010 = language ? "操作故障" : "操作失效";
	TextMessage.errorCode_3011 = language ? "登録後に操作してください" : "请登录后操作";
	TextMessage.errorCode_3020 = language ? "メールの情報を完全にしてください" : "请完善邮箱信息";
	TextMessage.errorCode_5000 = language ? "ページエラー" : "页面出错啦";
	TextMessage.prostaute0 = language ? "新品・未使用" : "未使用过";
	TextMessage.prostaute1 = language ? "未使用に近い" : "几乎未使用过";
	TextMessage.prostaute2 = language ? "目立った傷や汚れなし " : "无使用痕迹";
	TextMessage.prostaute3 = language ? "傷や汚れあり " : "有使用过痕迹";
	TextMessage.pro_imagetest = language ? "商品を出品する為には、少なくとも一枚は画像が必要です!" : "请为商品至少选择一张图片!";
	TextMessage.pro_nametest = language ? "商品名称を入力してください。" : "商品名称不能为空";
	TextMessage.pro_namelength = language ? "商品名が40文字以内入力できます" : "商品名称必须在40字以内";
	TextMessage.pro_detaillength = language ? "商品詳細が1000文字以内入力できます" : "商品详情必须在1000字以内";
	TextMessage.pro_descriptiontest = language ? "商品の説明文を入力してください。" : "商品描述不能为空";
	TextMessage.pro_sorttest = language ? "商品のカテゴリを選択してください。" : "请选择商品分类";
	TextMessage.pro_stautetest = language ? "商品の状態を選択してください。" : "请选择商品状态";
	TextMessage.pro_pricetest = language ? "価格は数字のみを設定してください" : "价格只能是数字";
	TextMessage.pro_pricenumbtest = language ? "有効な数字（0円以上）を設定してください" : "价格必须大于0";
	TextMessage.pro_buywaytest = language ? "取引手段を選択してください。" : "请选择交易手段";
	TextMessage.numberRangeText = language ? "販売価格の範囲で金額を入力してください。" : "请在提示的金额范围内输入贩卖价格",
	TextMessage.pro_logininfo = language ? "出品しました" : "发布成功";
	TextMessage.pro_pricenulltest = language ? "商品価格を設定してください!" : "商品价格不能为空!";
	TextMessage.not_exist_email = language ? "無効なメールアドレスです。" : "该邮箱不存在";
	TextMessage.commodity_edit = language ? "商品編集" : "商品编辑";
	TextMessage.updatesuccessinfo = language ? "更新が成功しました!" : "更新成功!";
	TextMessage.edite_headimage = language ? "プロフィール画像の変更" : "修改头像";
	/*个人确认账户信息*/
	TextMessage.pleasebank = language ? "銀行を選択してください" : "请选择银行";
	TextMessage.pleaseAccount = language ? "アカウントの種類を選択してください" : "请选择账户类型";
	TextMessage.branchNumberNull = language ? "店舗番号は空ではありません" : "分店号不能为空";
	TextMessage.accountNumberNull = language ? "銀行カード番号は空欄にできません" : "银行卡号不能为空";
	TextMessage.sendtextrequest = language ? "にメールを送りますか" : "发送电子邮件";
	TextMessage.telrequesttext = language ? "に電話しますか" : "拨打电话";
	TextMessage.sedsuccseetext = language ? "ご利用頂きありがとうございます。" : "谢谢您的使用";
	TextMessage.mailsucetext = language ? "にメールを送りました。" : "给我发送了邮件";
	TextMessage.requestmailtext = language ? "連絡をお待ちください。" : "请回复";
	TextMessage.sendmailbutext = language ? "メール送信" : "发送邮件";
	TextMessage.calbutext = language ? "電話" : "电话";
	TextMessage.homebutext = language ? "ホームページへ" : "主页";
	TextMessage.comdity_null = language ? "データなし" : "暂无数据";
	TextMessage.email_error = language ? "このメールアドレスまたはユーザー名がすでに存在しております" : "注册邮箱/用户名 错误，或已存在";
	TextMessage.requireing = language ? "問い合わせ中" : "请求中";
	TextMessage.requresuces = language ? "取引成立" : "交易成立";
	TextMessage.userng = language ? "この口座利用できません" : "该账户不可用";
	TextMessage.pointnot = language ? "ポイントが不足です" : "Point点数不足";
	TextMessage.buywaynot = language ? "購入方法が無効になっています" : "购买方式无效";
	TextMessage.buyyes = language ? "購入成功" : "购买成功";
	TextMessage.sure = language ? "確認" : "确认";
	TextMessage.logoutconfirm = language ? "本当にログアウトしますか？" : "确定要退出登录吗?";
	TextMessage.logouttitle = language ? "ログアウト" : "退出登录";
	TextMessage.logoutsuccess = language ? "ログアウトしました" : "退出成功";
	TextMessage.requiresuccess = language ? "クレーム提出しました" : "申述成功提出";
	TextMessage.reportsuccess = language ? "それが正常に報告されています" : "已成功举报";
	TextMessage.namenotnull = language ? "ユーザー名を入力してください" : "姓名不能为空";
	TextMessage.contentnotnull = language ? "内容を入力してください" : "内容不能为空";
	TextMessage.noopen = language ? "サービー提供までお楽しみに" : "暂未开通，敬请期待";
	TextMessage.ticketng = language ? "チケット数が不足です" : "Ticket数量不足";
	TextMessage.yes = language ? "はい" : "好的";
	/*没有设置账号*/
	TextMessage.noAccount = language ? "プロフィール編集にて口座情報を入力してください" : "未设置账号，请到用户信息编辑中添加",
	TextMessage.input_email = language ? "メールアドレスを設定してください。" : "请完善邮箱信息";
	TextMessage.updatemailng = language ? "リフレッシュ失敗しました！" : "更新失败,未知错误!";
	TextMessage.emailnull = language ? "メールアドレスが未入力です。" : "邮箱不能为空！";
	TextMessage.username_null = language ? "ユーザー名が未入力です。" : "用户名不能为空!";
	TextMessage.nickname_null = language ? "ニックネームが未入力です。" : "请输入用户昵称!";
	TextMessage.username_error = language ? "ユーザー名が10桁以内に設定してください" : "用户名长度不能超过10位字符";
	TextMessage.addressnull = language ? "アドレスを入力してください!" : "地址不能为空！";
	TextMessage.codenull = language ? "認証番号を入力してください!" : "验证码不能为空！";
	TextMessage.delmessage = language ? "この記録を削除して確認しますか？" : "确认删除该条记录吗?";
	TextMessage.email_error1 = language ? "正しいメールアドレスを入力してください。" : "邮箱输入不正确。";
	TextMessage.loading = language ? "更新中" : "正在加载";
	TextMessage.no_data = language ? "該当カテゴリのデータがありません。" : "当前分类下没有数据";
	TextMessage.upmore = language ? "スクロールで更新" : "上拉显示更多";
	TextMessage.nomore = language ? "データがありません" : "没有更多数据了";
	TextMessage.nomorenews = language ? "お知らせはありません" : "暂无消息";
	TextMessage.release = language ? "離すと更新" : "释放立即刷新";
	TextMessage.update = language ? "更新中" : "正在刷新";
	TextMessage.pull_down = language ? "引っ張って更新" : "下拉可以刷新";
	TextMessage.pull_up = language ? "スクロールで更新" : "上拉显示更多";
	TextMessage.release = language ? "離すと更新" : "释放立即刷新";
	TextMessage.update = language ? "更新中" : "正在刷新";
	TextMessage.requestStop = language ? "取引を中止する" : "请求终止";
	TextMessage.transSuccess = language ? "取引成立" : "交易成功";
	TextMessage.transStop = language ? "取引を中止する" : "交易终止";
	TextMessage.transContact = language ? "入力してください" : "交谈内容不能为空";
	TextMessage.tranStatusRequest = language ? "問い合わせ中" : "请求中";
	TextMessage.tranStatusDeal = language ? "取引成立" : "交易成立";
	TextMessage.transStop = language ? "取引を中止する" : "交易终止";
	TextMessage.transStopMsg = language ? "取引を中止しました。継続したい場合は再度取引をしてください。" : "已终止交易，不能继续交易。如果要继续交易请重新请求!!!";
	TextMessage.transSuccessMsg = language ? "取引が完了しました。" : "交易已完成";
	TextMessage.transConfirm = language ? "取引を開始する" : "开始交易";
	TextMessage.transWaitConfirm = language ? "相手の確認を待つ" : "等待对方确认";
	TextMessage.transOrder = language ? "支払い手続きへ" : "去付款";
	TextMessage.transUrgeDelive = language ? "出荷をリクエストする" : "催促对方发货";
	TextMessage.transReceipt = language ? "品物受領" : "确认收货";
	TextMessage.transDelive = language ? "出荷完了" : "确认发货";
	TextMessage.transWaitOrder = language ? "相手の注文を待つ" : "等待对方下单";
	TextMessage.transUrgeReceipt = language ? "相手に品物を督促" : "催促对方收货";
	TextMessage.transFinish = language ? "取引完了" : "交易完成";
	TextMessage.transWaitReceipt = language ? "相手を待つ" : "等待对方收货";
	TextMessage.transStopTips = language ? "取引中止しますか？" : "确认终止交易吗?";
	TextMessage.transContinue = language ? "取引を継続します。" : "继续交易!";
	TextMessage.waitforConfirm = language ? "取引依賴確認待ち" : "等待确认交易";
	TextMessage.waitPay = language ? "入金待ち" : "等待付款";
	TextMessage.waitotherPay  =language ? "相手の支払いを待つ" : "等待对方付款";
	TextMessage.waitPayHandle = language ? "入金処理待ち" : "等待付款处理";
	TextMessage.waitSellerSend = language ? "発送待ち" : "等待卖家发货";
	TextMessage.waitBuyerConfirm = language ? "相手を待つ" : "等待买家收货";
	TextMessage.waitBuyerAgree = language ? "バイヤーの承諾を待つ" : "等待买家同意";
	TextMessage.waitSellerAgree = language ? "売家を待つ" : "等待卖家同意";
	TextMessage.agreeTerminate = language ? "承諾の中止" : "同意终止";
//	add
	TextMessage.accountsReceivable = language ? "振込先確認" : "确认收款账户";
	TextMessage.applyforPayment = language ? "振込申請" : "申请收款";
/*seller account page*/
    TextMessage.branchnumberRangeText = language ? "3桁に制限" : "限制为3位数字",
    TextMessage.cardnumberRangeText = language ? "7桁に制限" : "限制为7位数字",
/*balance management*/
    TextMessage.ok = language ? "OK" : "OK",
/*transfer application*/
    TextMessage.wouldtransfer = language ? "振込申請を行います。よろしいでしょうか。" : "将进行转账申请。确定吗？",
    TextMessage.reallyCancel = language ? "本当にキャンセルしたい": "真的要取消吗?",
	TextMessage.confirmBtnYes = language ? "はい" : "确认";
	TextMessage.confirmBtnNo = language ? "いいえ" : "取消";
	TextMessage.evaluateMsg = language ? "このコメントは取引完了後に評価一覧で公開されます。商品に問題がある場合などは、評価をせずに取引確認画面で伝えましょう。" : "";
	TextMessage.confirmcodeng = language ? "認証番号エラー" : "验证码错误";
	TextMessage.det_concerneds = language ? "出品者が気になる商品" : "出品者关注商品";
	TextMessage.emailsenderror = language ? "メールで失敗を発送する" : "邮件发送失败";
	TextMessage.password_notnull = language ? "パスワードを入力してください。" : "密码不能为空";
	TextMessage.exit_app = language ? "もう一度クリックして退出します。" : "再按一次退出应用";
	TextMessage.password_error = language ? "半角英字・数字(6～16桁)" : "密码长度不正确，请重新输入";
	TextMessage.confirmPwd_error = language ? "パスワードと確認パスワードが一致しませんでした。" : "确认密码与密码输入不一致,请重新输入";
	TextMessage.deletenewstext = language ? "削除" : "删除";
	TextMessage.commdNo = language ? "選択できる商品がありません。" : "您没有可供选择的商品";
	TextMessage.evelevel = language ? "評価レベルをご選択ください。" : "请选择评价等级";
	TextMessage.commdSelect = language ? "１つ以上の商品を選択してください。" : "请至少选择一个商品";
	TextMessage.transEve = language ? "取引評価" : "去评价";
	TextMessage.nicknamenull = language ? "ユーザー名未入力です。" : "用户名不能为空";
	TextMessage.ulanguagenull = language ? "一つ以上言語を選んでください。" : "至少选择一种语言";
	TextMessage.username_error = language ? "ユーザー名を１０文字以内に設定してください" : "用户名不能超过10位";
	TextMessage.nickname_error = language ? "ニックネームを１０文字以内に設定してください" : "昵称不能超过10位";
	TextMessage.pwdudsuccess = language ? "パスワードを変更しました。" : "密码更新成功";
	TextMessage.re_issue = language ? "パスワード発行画面より再度手続きを行ってください。" : "验证码失效,请重新发送验证码.";
	TextMessage.inputtext = language ? "入力文字数:" : "还能输入";
	TextMessage.inputpoint = language ? "文字" : "个字";
	TextMessage.representations = language ? "あなたのアカウントは凍結されています。申告する場合は、問い合わせ画面へ遷移します。" : "你的账户已被冻结,是否要申述?";
	TextMessage.no_data_tips_1 = language ? "該当する商品がありません。" : "该分类目前没有商品。";
	TextMessage.no_data_tips_2 = language ? "これからの出品にご期待ください。" : "敬请期待新品上线。";
	TextMessage.noemjoy = language ? "顔文字は入力できません" : "不能输入表情符号";
	TextMessage.nonetwork = language ? "ネットワーク接続がありません。" : "暂无网络,点此重试";
	TextMessage.nonetwork2 = language ? "ネットワークの接続状況を確認してください。" : "";
	TextMessage.timeouttext = language ? "接続がタイムアウトしました。" : "请求服务器超时,请稍后重试";
	TextMessage.timeouttext2 = language ? "しばらくしてから再度お試しください。" : "";
	TextMessage.intralerror	= language ? "通信エラーが発生しました。" : "服务器出错啦,请稍后重试";
	TextMessage.tranStatusclose= language ? "未公開" : "未公开";
	TextMessage.commodity_login= language ? "商品登録" : "商品发布";
	TextMessage.commodity_luo= language ? "出品を一旦停止する" : "落品";
	TextMessage.commodity_againlogin= language ? "出品を再開する" : "再出品";
	TextMessage.comoditylogin_success= language ? "出品しました。" : "出品成功";
	TextMessage.luopin_success= language ? "落品しました。" : "落品成功";
	TextMessage.delete_success= language ? "削除しました。" : "删除成功";
	TextMessage.complaintpro = language ? "不適切な商品の報告" : "举报此商品";
	TextMessage.comodityreport_success= language ? "報告しました。" : "举报成功";
	TextMessage.comodityrepot_repeat= language ? "この商品はすでに報告済みです" : "请勿重复举报";
	TextMessage.Compresserror = language ? "圧縮失敗" : "压缩失败";
	TextMessage.Compresserror_si = language ? "ファイルが存在しません" : "文件不存在";
	TextMessage.search_result = language ? "検索結果" : "检索结果";
	TextMessage.may_not_click = language ? "三分間後、発送ボタンをご押してください。" : "3分钟之内不可点击";
	TextMessage.urge_receipt_finish = language ? "取引相手に商品確認を催促しました。" : "已催促对方收货";
	TextMessage.urge_delive_finish = language ? "取引相手に商品発送を催促しました。" : "已催促对方发货";
	TextMessage.stop_user = language ? "このアカウントが既に利用停止されました。" : "该用户已被停止使用";
	TextMessage.transfersuccess = language ? "振込完了" : "转账完成";
	TextMessage.amountcheck= language ? "振替金額は0" : "转账金额必须大于0";
	TextMessage.balancecheck= language ? "口座の殘高が不足して" : "您当前余额不足";
	TextMessage.ammontlength= language ? "申請額は10桁を超えることはできない" : "申请金额不能超过十位";
	TextMessage.totolMoney = language ? "売上高" : "共赚了";
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
var ajax_error;
(function (ajax_error){
	var _check = null;
	ajax_error.checkNet = function() {
		_check = (function(){
			var _curNetType = plus.networkinfo.getCurrentType();
			switch (_curNetType){
				case 0:
				localStorage.setItem("$showConfirm", "1");
				break;
				case 1:
				localStorage.setItem("$showConfirm", "0");
					var isShow = localStorage.getItem("$showConfirm");
					if (isShow == null || isShow == "0") {
						_showConfirm();
					}
					break;
				default:
					break;
			}
		}());
	}
	_showConfirm = function() {
		localStorage.setItem("$showConfirm", "1");
		plus.nativeUI.confirm("当前网络不可用，请确认设备已连接网络。", function(event){
			switch (event.index){
				case 0:
					_settingNetWork();
					break;
//				case 1:
//					plus.runtime.quit();
//					break;
				default:
					break;
			}
			localStorage.setItem("$showConfirm", "0");
		}, "提示", ["设置网络", "取消"]);
	}
	_settingNetWork = function() {
		if (mui.os.ios) {
			var UIApplication = plus.ios.import("UIApplication");
			var NSURL = plus.ios.import("NSURL");
			var setting = NSURL.URLWithString("prefs:root=WIFI");
			var application = UIApplication.sharedApplication();
			application.openURL(setting);
			plus.ios.deleteObject(setting);
			plus.ios.deleteObject(application);
		} else if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var Intent = plus.android.importClass("android.content.Intent");
			var mIntent = new Intent('android.settings.WIFI_SETTINGS');
			main.startActivity(mIntent);
		} else {
			// TODO other os
		}
	}
})(ajax_error || (ajax_error = {}))
var error_tost;
(function(){
	error_tost.message=function(){
		mui.toast(TextMessage.not_network, {
					duration: 'long',
					type: 'div'
				});
	};
})(error_tost || (error_tost = {}))
var preventKeyBoardSubmit;
(function (preventKeyBoardSubmit){
    preventKeyBoardSubmit.closekeybord=function(){
    	$("input").keypress(function(e){
	        if(e.keyCode === 13){
	            e.preventDefault();
	            document.activeElement.blur();
	            $('input').blur();
	        }
	    });
    };
})(preventKeyBoardSubmit || (preventKeyBoardSubmit={}));
//Translate html
function HTMLDecode(text) {
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output;
}
//Translate text
function HTMLEncode(html) {
	var temp = document.createElement("div");
	(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output;
}
//iimgurl
function thumbnail(imgurl){
	var imgurlarr=imgurl.split("/");
	var imgurl0="";
	//console.log(imgsarr[0]);
	for(var m=0;m<imgurlarr.length;m++){
		//console.log(m+":"+imgurlarr[m]);
		if(m<=8){
			imgurl0+=imgurlarr[m]+"/";
		}else{
			imgurl0+="thumbnail/"+imgurlarr[9];
		}
	}
	return imgurl0;
}
