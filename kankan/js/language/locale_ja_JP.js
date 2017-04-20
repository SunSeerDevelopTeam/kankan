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
	"please-input-password":"半角英文字3文字以上20文字以内",
	"please-confirm-password":"パスワード確認",
	"please-input-introduction-code":"半角英数字6位",
	"please-input-verification-code":"コードを入力",
	"send-verification-code":"認証コードを発信",
	/*user login page message end*/
	/*detail page*/
	"det_spdescription":"商品説明 ",
	"det_spahare":"シェア",
	"det_goodconcel":"キャンセル",
	"det_goods":"いいね!",
	"det_comment":"コメント",
	"det_coments":"コメント",
	"det_producednum":"出品数",
	"det_concerneds":"さんが気になってる商品",
	"det_recommends":"お勧めの商品",
	"det_pointexch":"ポイント",
	"det_exchange":"交換",
	"det_send":"あげる",
	"detli_title":"商品リスト",
	"det_procoment":"商品評価",
	"det_pcercomment":"評価",
	"det_goodcomments":"良い",
	"det_normalcomments":"普通",
	"det_badcomments":"悪い",
	"det_all":"全て",
	
	// Home Page
	"app_name":"カンカン",
	"tab_1":"ホーム",
	"tab_2":"登録",
	"tab_3":"質問",
	"tab_4":"リクエスト"
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