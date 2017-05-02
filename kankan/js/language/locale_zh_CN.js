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
	"email": "邮箱",
	"username": "用户名",
	"password": "密码",
	"password-confirm": "确认密码",
	"address": "地址",
	"address-details": "未设定",
	"introduction-code": "介绍码",
	"verification-code": "验证码",
	"register": "确定",
	"register-tips": "注册真实可用，注册成功后的用户可用于登录。",
	"please-input-email": "请输入邮箱",
	"please-input-username": "请输入用户名",
	"please-input-password": "请输入密码",
	"please-confirm-password": "请再次输入密码",
	"please-input-introduction-code": "请输入介绍码",
	"please-input-verification-code": "请输入验证码",
	"send-verification-code": "发送验证码",
	/*user login page message end*/
	/*detail page*/
	"det_spdescription": "商品说明",
	"det_spahare": "分享至",
	"det_goodconcel": "取消",
	"det_goods": "赞",
	"det_comment": "留言",
	"det_coments": "评论",
	"det_producednum": "出品数",
	"det_concerneds": "出品者关注商品",
	"det_recommends": "推荐商品",
	"det_pointexch": "点数交易",
	"det_exchange": "交换",
	"det_send": "白送",
	"detli_title": "商品列表",
	"det_procoment": "商品评论",
	"det_pcercomment": "出品者评论",
	"det_goodcomments": "好评",
	"det_normalcomments": "中评",
	"det_badcomments": "差评",
	"det_all": "全部",
	"comdity_null": "暂无数据",
	"contentlength": "评论内容（不超过三百字）",
	"contentsend": "发 送",

	// Home Page
	"app_name": "看看",
	"tab_1": "首页",
	"tab_2": "发布",
	"tab_3": "求购",
	"tab_4": "请求",

	//commodity login page
	"commodity_login": "商品登录",
	"commodity_photos": "商品照片",
	"commodity_photodet": "确定要删除这张图片吗？",
	"commodity_name": "商品名和说明",
	"commodity_namelength": "商品名（40字以内）",
	"commodity_descriptionlength": "商品说明（1000字以内）",
	"commodity_detail": "商品详情",
	"commodity_sorts": "商品种类",
	"commodity_must": "必填",
	"commodity_stuates": "商品状态",
	"commodity_buyway": "交换手段",
	"commodity_switch": "交  换",
	"commodity_free": "白 送",
	"commodity_pointbuy": "point",
	"commodity_buttonsure": "发	布",
	"commodity_price": "价格",
	"commodity_forbidentext": "请确认被禁止的出品物以及行为。如果是名牌物品的话，请明示相关编号，假冒名牌的贩卖行为将会受到处罚以及追究相关责任。",
	"commodity_want":"求购商品发布",
	"commodity_want_butonsure":"发	布",
	"commodity_want_forbidentext":"",
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