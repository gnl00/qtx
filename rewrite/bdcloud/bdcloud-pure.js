const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bdcloud-pure";
let body = JSON.parse($response.body);

console.log('bdcloud-pure start')

// [首页] 去除营销占位
if(url.indexOf('api/usercfg?') !== -1 && body && body.user_new_define_cards) {
  body.user_new_define_cards = body.user_new_define_cards.filter(item => item.card_area_name && ['首页笔记-卡片', '最近', '卡片管理-卡片'].indexOf(item.card_area_name) !== -1)
}

// [我的] 去除 vip 滚动广告
if(url.indexOf('act/v2/bchannel/list?') !== -1 && body.data.length !== 0) {
  body.data.length = 0
}

// [我的] 去除专属福利广告
if(url.indexOf('act/v2/welfare/list?') !== -1 && body.data.length !== 0) {
  body.data.length = 0
}

console.log('bdcloud-pure done')

body = JSON.stringify(body);
$done({
    body
});