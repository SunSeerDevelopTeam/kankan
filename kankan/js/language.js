(function(mui, doc) {
	mui.plusReady(function() {
		var language = plus.os.language;
		console.log("current language is " + language);
		var dynamic = document.createElement("script");
		if(!language || language == "ja_JP") {
			dynamic.src="../../js/language/locale_ja_JP.js";
		} else {
			dynamic.src="../../js/language/locale_zh_CN.js";
		}
		document.head.appendChild(dynamic);
	});
})(mui, document);