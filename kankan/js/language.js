(function(mui, doc) {
	mui.plusReady(function() {
		var language = plus.os.language;
		var dynamic = document.createElement("script");
		if(!language || language == "ja_JP") {
			dynamic.src="../../js/language/locale_ja_JP.js";
			alert("jp");
		} else {
			dynamic.src="../../js/language/locale_en_US.js";
			alert("en");
		}
		document.head.appendChild(dynamic);
	});
})(mui, document);