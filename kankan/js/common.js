var secretKey = "justfortest00001xxxxOOOX";
var STATUS = {
	OK: "OK",
	NG: "NG"
};
var LOGIN_TYPE = {
	EMAIL: "0",
	OAUTH: "1"
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
	var baseUrl = 'http://124.114.150.138:7998';
	Api.url = {
		User: {
			checkEmail: baseUrl + '/user/emailCode',
			register: 　baseUrl + '/user/Register',
			login: baseUrl + '/user/login/login'
		},
		Commodity: {
			commodityDetail: baseUrl + '/commodity/commoditydetail',
			commodityList: baseUrl + '/index/index/',
			category: baseUrl + '/commodity/catalog/',
			praise: baseUrl + '/commodity/praise/',
			commodityulist: baseUrl + '/commodity/Commodityusers/',
			Usercomment: baseUrl + '/user/Usercomment/',
			Commoditycomment: baseUrl + '/commodity/Commoditycomment/',
			comments: baseUrl + '/commodity/comment/',
			imgupload: baseUrl + '/commodity/release/upload/',
			Commoditypublish:baseUrl + '/commodity/release/'
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
		vCode: 'verificationCode',
		rCode: 'recom_code'
	};

	function call(url, params, callback) {
		var $d = $.Deferred();
		params[Api.Params.token] = getToken();
		params[Api.Params.sign] = createSignInfo();
		mui.ajax(url, {
			data: params,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				Log.i(url);
				Log.i(data);
				setToken(data.tokencheck);
				if(data.result.status == STATUS.OK && Validator.isFunc(callback.ok))
					callback.ok(data.result)
				else if(data.result.status == STATUS.NG && Validator.isFunc(callback.ng))
					callback.ng(data.result.statuscode)
				$d.resolve();
			},
			error: function(xhr, type, errorThrown) {
				Log.e(url);
				Log.e(xhr);
				Log.e(type);
				Log.e(errorThrown);
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
		if(plus != null) {
			token = plus.storage.getItem('token');
			if(token == null) {
				return "+GGzMiM28W8dy+XxzQAl4x3L5fHNACXjh/PqKa19BIs=70760a3f4cbcc375c67df5c75919adbe09b8aca4fc25fa6d7068bcd66169a108";
			}
		}
		return token;
	}
	Api.getToken = getToken;

	/**
	 * save token info
	 */
	function setToken(token) {
		if(token != null && token != "" && plus != null) {
			plus.storage.setItem('token', token);
			Log.d("save token to storage.");
		}
	}
	Api.setToken = setToken;
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
	})(Commodity = Repository.Commodity || (Repository.Commodity = {}));
	Repository.Commodity = Commodity;
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
	TextMessage.comdity_takepic = language ? "商品に写真を撮る" : "为商品拍照";
	TextMessage.gallerychoose = language ? "携帯電話からアルバムを選ぶ" : "从手机相册中选择";
	TextMessage.chooseimage = language ? "写真を選択する" : "选择照片";

	TextMessage.errorCode_1001 = language ? "検証番号の有効期限が切れて、再び試みて下さい " : "您输入的验证码已过期，请重试！";
	TextMessage.errorCode_1002 = language ? "不能为空，请重新输入" : "不能为空，请重新输入";
})(TextMessage || (TextMessage = {}));
var Entity;
(function(Entity) {
	var Commodity = (function() {
		function Commodity() {
			var self = this;
			this.classes = null;
			this.commName = null;
			this.commodityId = null;
			this.imgs = null;
			this.praise = null;
			this.price = null;
		}
		Commodity.prototype.fromJson = function(json) {
			if(Validator.isNull(json)) return;
			this.classes = json.classes;
			this.commName = json.comm_name;
			this.commodityId = json.commodity_id;
			this.imgs = json.imgs;
			this.praise = json.praise;
			this.price = json.price;
		};
		Commodity.prototype.reset = function() {
			this.classes(null);
			this.commName(null);
			this.commodityId(null);
			this.imgs(null);
			this.praise(null);
			this.price(null);
		};
		return Commodity;
	}());
	Entity.Commodity = Commodity;
})(Entity || (Entity = {}));