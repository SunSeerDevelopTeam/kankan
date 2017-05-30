(function(mui, doc) {
	function isInclude(filepath) {
		var  js =  /js$/i.test(filepath);
		var es = doc.getElementsByTagName(js ? 'script' : 'link');
		for(var i = 0; i < es.length; i++) {
			if(es[i][js ? 'src' : 'href'].indexOf(filepath) != -1) {
				return true;
			}
			return false;
		}
	}

	function appendJS(filepath) {
		if(!isInclude(filepath)) {
			var dynamic = doc.createElement("script");
			dynamic.src = filepath;
			doc.head.appendChild(dynamic);
		}
	}

	mui.plusReady(function() {
		var language = navigator.language;
		console.log("language is " + language);
		if(!language || language == "ja-jp" || language == "ja-JP") {
			//appendJS("../../js/language/locale_ja_JP.js");
			//appendJS("../../../js/language/locale_ja_JP.js");
			//appendJs("/js/langage/locale_ja_JP.js");
			appendJS("file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/www/js/language/locale_ja_JP.js");
		} else {
			//appendJS("../../js/language/locale_zh_CN.js");
			//appendJS("../../../js/language/locale_zh_CN.js");
			appendJS("file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/www/js/language/locale_zh_CN.js");
		}
	});

})(mui, document);