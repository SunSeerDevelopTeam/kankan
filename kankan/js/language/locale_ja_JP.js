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
	"forget_password": "",
	/*login page message end*/
	
	/*user login page message begin*/
	"user-login": "ユーザー登録",
	"email":"メールアドレス",
	"username":"ユーザー名",
	"password":"パスワード",
	"password-confirm":"",
	"address":"",
	"address-details":"",
	"introduction-code":"",
	"verification-code":"",
	"register":"",
	"register-tips":"",
	"please-input-email":"",
	"please-input-username":"",
	"please-input-password":"",
	"please-confirm-password":"",
	"please-input-introduction-code":"",
	"please-input-verification-code":""
	/*user login page message end*/
}

$(function(){
	$('.lang').not('input').each(function(e){
		var msg_key = $(this).attr('data-locale');
		$(this).text(JSLocale[msg_key]);
	});
	
	$('input.lang').each(function(e){
		var msg_key = $(this).attr('data-locale');
		$(this).attr('placeholder',JSLocale[msg_key]);
	});
});