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
	"forget_password": "パスワードを忘れました",
	/*login page message end*/

	/*user login page message begin*/
	"user-login": "ユーザー登録",
	"email": "メールアドレス",
	"username": "ユーザー名",
	"password": "パスワード",
	"new_password": "新しいパスワード",
	"password-confirm": "パスワード再入力",
	"address": "都通府県",
	"address-details": "未設定",
	"introduction-code": "招待コード(任意)",
	"verification-code": "確認コード",
	"register": "確定",
	"register-tips": "あとからプロフィールは変更可能です",
	"please-input-email": "メールアドレス",
	"please-input-username": "アプリ内に表示されます",
	"please-input-password": "半角英文字3文字以上20文字以内",
	"please-confirm-password": "パスワード確認",
	"please-input-introduction-code": "半角英数字6位",
	"please-input-verification-code": "コードを入力",
	"send-verification-code": "認証コードを発信",
	"retrieve_password":"パスワード再発行",
	"forget_password_msg": "カンカンで登録しているE-mailを入力してください 入力頂いたE-mailに新しいパスワードを送信します",
	/*user login page message end*/
	/*detail page*/
	"det_spdescription": "商品説明 ",
	"det_spahare": "シェア",
	"det_goodconcel": "キャンセル",
	"det_goods": "いいね!",
	"det_comment": "コメント",
	"det_coments": "コメント",
	"det_producednum": "出品数",
	"det_concerneds": "さんが気になってる商品",
	"det_recommends": "お勧めの商品",
	"det_pointexch": "ポイント",
	"det_exchange": "交換",
	"det_send": "あげる",
	"detli_title": "商品リスト",
	"det_procoment": "商品評価",
	"det_pcercomment": "評価",
	"det_goodcomments": "良い",
	"det_normalcomments": "普通",
	"det_badcomments": "悪い",
	"det_all": "全て",
	"comdity_null": "暫時データ",
	"contentlength": "レビューの内容（300字を超えない）",
	"contentsend": "送 信",

	// Home Page
	"app_name": "カンカン",
	"tab_1": "ホーム",
	"tab_2": "登録",
	"tab_3": "質問",
	"tab_4": "リクエスト",

	//commodity login page
	"commodity_login": "商品登録",
	"commodity_photos": "商品写真",
	"commodity_photodet": "この画像を削除しますか？",
	"commodity_name": "商品名と説明",
	"commodity_namelength": "商品名（必須４０文字まで）",
	"commodity_descriptionlength": "商品説明（1000文字まで）",
	"commodity_detail": "商品詳細",
	"commodity_sorts": "カテゴリー",
	"commodity_must": "必須",
	"commodity_stuates": "商品状態",
	"commodity_buyway": "交換手段",
	"commodity_switch": "交 換",
	"commodity_free": "あげる",
	"commodity_pointbuy": "ポイント",
	"commodity_buttonsure": "出品する",
	"commodity_price": "価  格",
	"commodity_forbidentext": "禁止されている出品、行為を必ず確認ください。またブランド品でシリアルナンバー等がある場合はご記載ください。偽ブランドの販売は犯罪であり処罰される可能性があります。",
	"commodity_want":"物探す登録",
	"commodity_want_butonsure":"投稿する",
	"commodity_want_forbidentext":"法律に禁止されているもの或は非常識ものを登録しないで下さい、投稿した情報の有効期限は一ヶ月内になりますので、ご了承ください。",
	//user page
	"ticknumber":"チケット数",
	"userinforbutntext":"プロフィール編集",
	"userpointtext":"ポイント",
	"onshowingtext":"出品中アイテム",
	"praiseprotext":"いいねしたアイテム",
	"favoriteprotext":"気になる",
	"uinfousername":"ユーザ名",
	"introducetext":"紹介文",
	"userlanguage":"言語",
	"jpanese_user":"日本語",
	"chinese_user":"漢語",
	"english_user":"英語",
	"korean_user":"韓国語",
	"infoeditetitle":"プロフィール編集",
	//logisticslist page
	"sendmes":"は",
	"logistic":"物流",
	
	//point change to ticket page
	"point_to_ticket_title":"チケット購入",
	"point_to_ticket_num1":"チケット1枚",
	"point_to_ticket_num4":"チケット4枚(3枚+1枚)",
	"point_to_ticket_num7":"チケット7枚(5枚+2枚)",
	"point_to_ticket_num15":"チケット15枚(10枚+5枚)",
	"buy":"購入",
	
	//buy point page
	"change":"チャージ",
	//request
	"requesttitle":"リクエスト",
	"requesthistory":"交易履历",
	"requestedpro":"リクエストされた",
	"requestpro":"リスエストした"
}

$(function() {
	$('.lang').not('input').each(function(e) {
		var msg_key = $(this).attr('data-locale');
		$(this).text(JSLocale[msg_key]);
	});

	$('input.lang').each(function(e) {
		var msg_key = $(this).attr('data-locale');
		$(this).attr('placeholder', JSLocale[msg_key]);
	});
	$('textarea.lang').each(function(e) {
		var msg_key = $(this).attr('data-locale');
		$(this).attr('placeholder', JSLocale[msg_key]);
	});
});