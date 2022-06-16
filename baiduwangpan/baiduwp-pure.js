const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "baiduwp-pure";
let body = JSON.parse($response.body);

// 去除首页营销占位
if(url.indexOf('api/usercfg?') !== -1 && body) {
  body.user_new_define_cards = body.user_new_define_cards.filter(item => card_area_name && ['首页笔记-卡片', '最近', '卡片管理-卡片'].indexOf(card_area_name) !== -1)
}

body = JSON.stringify(body);
$done({
    body
});