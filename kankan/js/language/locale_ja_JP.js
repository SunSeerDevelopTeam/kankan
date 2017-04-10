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
	"password-confirm":"パスワード再入力",
	"address":"都通府県",
	"address-details":"未設定",
	"introduction-code":"招待コード(任意)",
	"verification-code":"確認コード",
	"register":"確定",
	"register-tips":"あとからプロフィールは変更可能です",
	"please-input-email":"メールアドレス",
	"please-input-username":"アプリ内に表示されます",
	"please-input-password":"半角英数字3文字以上20字以内",
	"please-confirm-password":"パスワード確認",
	"please-input-introduction-code":"半角英数字6位",
	"please-input-verification-code":"コードを入力",
	"send-verification-code":"認証コードを発信"
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