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
	"forget_password": "忘记密码了",
	/*login page message end*/
	
	/*user login page message begin*/
	"user-login": "用户注册",
	"email":"邮箱",
	"username":"用户名",
	"password":"密码",
	"password-confirm":"确认密码",
	"address":"地址",
	"address-details":"未设定",
	"introduction-code":"介绍码",
	"verification-code":"验证码",
	"register":"确定",
	"register-tips":"注册真实可用，注册成功后的用户可用于登录。",
	"please-input-email":"请输入邮箱",
	"please-input-username":"请输入用户名",
	"please-input-password":"请输入密码",
	"please-confirm-password":"请再次输入密码",
	"please-input-introduction-code":"请输入介绍码",
	"please-input-verification-code":"请输入验证码",
	"send-verification-code":"发送验证码",
	/*user login page message end*/
	/*detail page*/
	"det_spdescription":"商品说明",
	"det_spahare":"分享至",
	"det_goodconcel":"取消",
	"det_goods":"赞",
	"det_comment":"留言",
	"det_coments":"评论",
	"det_producednum":"出品数",
	"det_concerneds":"出品者关注商品",
	"det_recommends":"推荐商品",
	"det_pointexch":"点数交易",
	"det_exchange":"交换",
	"det_send":"白送",
	"detli_title":"商品列表",
	"det_procoment":"商品评论",
	"det_pcercomment":"出品者评论",
	"det_goodcomments":"好评",
	"det_normalcomments":"中评",
	"det_badcomments":"差评",
	"det_all":"全部",
	
	// Home Page
	"app_name":"kankan",
	
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