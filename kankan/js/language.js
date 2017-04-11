(function(mui, doc) {
	mui.plusReady(function() {
		var language = plus.os.language;
		console.log("current language is " + language);
		var dynamic1 = document.createElement("script");
		var dynamic2 = document.createElement("script");
		if(!language || language == "ja_JP") {
			dynamic1.src="../../js/language/locale_ja_JP.js";
			dynamic2.src="../../js/validation/localization/messages_ja.js";
		} else {
			dynamic1.src="../../js/language/locale_zh_CN.js";
			dynamic2.src="../../js/validation/localization/messages_zh.js";
		}
		document.head.appendChild(dynamic1);
		document.head.appendChild(dynamic2);
	});
})(mui, document);