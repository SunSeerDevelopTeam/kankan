var JSLocale = {
	/*common message*/
	"back": "返回",

	/*login page message begin*/
	"login": "登录",
	"wechat_login": "微信授权登录",
	"line_login": "Line授权登录",
	"facebook_login": "Facebook授权登录",
	"twitter_login": "Twitter授权登录",
	"email_login": "邮箱登录",
	"protocol agreement": "接受使用条款"
	/*login page message end*/
}

$(function(){
	$(".lang").each(function(e){
		var msg_key = $(this).attr("data-locale");
		$(this).text(JSLocale[msg_key]);
	});
});