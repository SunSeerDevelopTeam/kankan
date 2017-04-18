var emailLogin = 0;
var weixinLogin = 1;
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
			commoditydetail: baseUrl + '/commodity/commoditydetail'
		}
	};
	Api.Params = {
		email: 'email',
		username: 'username',
		password: 'user_pwd',
		token: 'tokencheck',
		sign: 'signcheck',
		loginType: 'enroll_type'
	};

	function call(url, params, callback) {
		params[Api.Params.token] = getToken();
		params[Api.Params.sign] = createSignInfo();
		mui.ajax(url, {
			data:params,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.result.status == STATUS.OK && Validator.isFunc(callback.success))
					callback.ok(data)
				else if(data.result.status == STATUS.NG && Validator.isFunc(callback.error))
					callback.ng(data)
			},
			error: function(xhr, type, errorThrown) {
				plus.ui.alert(type);
			}
		});
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
		// TODO return token info
		return "";
	}
	Api.getToken = getToken;
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
	(function(Commodity){
		function commoditydetail(params, callback) {
			return Api.call(Api.url.Commodity.commoditydetail, params, callback);
		}
		Commodity.commoditydetail = commoditydetail;
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