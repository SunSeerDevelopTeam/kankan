var JSLocale = {
	/*common message*/
	"back": "戻る",

	/*login page message begin*/
	"login": "登録",
	"wechat_login": "Wechatで登録する",
	"line_login": "Lineで登録する",
	"facebook_login": "Facebookで登録する",
	"twitter_login": "Twitterで登録する",
	"email_login": "メールアドレスで登録する",
	"protocol agreement": "利用規約に同意する"
	/*login page message end*/
}

$(function(){
	$(".lang").each(function(e){
		var msg_key = $(this).attr("data-locale");
		$(this).text(JSLocale[msg_key]);
	});
});