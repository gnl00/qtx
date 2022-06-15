const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-beautify";
let body = JSON.parse($response.body);

if (!body.hasOwnProperty('data')) {
    console.log(url);
    console.log("body:" + $response.body);
    $notification.post(notifiTitle, url, "data字段错误");
} else {
    if (url.indexOf("x/v2/splash") !== -1 && method === getMethod) {
        console.log('bili-beautify 开屏页' + (url.indexOf("splash/show") !== -1 ? 'show' : 'list'));
        if (body.data.hasOwnProperty('show')) {
            // 有时候返回的数据没有show字段
            delete body.data.show;
        }
    } else if(url.indexOf('x/v2/splash/list') !== -1) {
        // 开屏广告预加载，不可强制删除 @Cuttlefish
        console.log('bili-beautify handle x/v2/splash/list')
        if(body.data.hasOwnProperty('list')) {
          body.data.list.forEach(item => {
            if(item.duration && item.duration !== 0) item.duration = 0
            // 2050 年
            if(item.begin_time) item.begin_time = 2524608000
            if(item.end_time) item.end_time = 2524608000
          })
        }
    } else if (url.indexOf("resource/show/tab/v2") !== -1 && method === getMethod) {
        // 右上角top栏
        if (body.data.hasOwnProperty('top')) {
            console.log('bili-beautify 首页 top 修改');
            body.data.top = body.data.top.filter(item => '消息' === item.name);
            fixPos(body.data.top);
        }
        // 顶部tab栏
        if (body.data.hasOwnProperty('tab'))  {
            console.log('bili-beautify 首页 tab 修改');
            body.data.tab = body.data.tab.filter(item => ['推荐', '热门', '追番'].indexOf(item.name) !== -1 );
            fixPos(body.data.tab);
        }
        // 底部bottom栏
        if (body.data.hasOwnProperty('bottom')) {
            console.log('bili-beautify 首页 bottom 修改');
            body.data.bottom = body.data.bottom.filter(item => ['首页', '动态', '我的'].indexOf(item.name) !== -1);
            fixPos(body.data.bottom);
        }
    } else if(url.indexOf('x/v2/activity/inline') !== -1 && body.data) {
        console.log('bili-beautify handle 顶部消息旁边的活动')
        body.data = {}
    } else if (url.indexOf("x/v2/feed/index") !== -1 && method === getMethod) {
        console.log('bili-beautify 推荐页');
        if (body.data.hasOwnProperty('items')) {
            body.data.items = body.data.items.filter(i => {
                if (i.hasOwnProperty('card_type') && i.hasOwnProperty('card_goto')) {
                    const cardType = i.card_type;
                    const cardGoto = i.card_goto;
                    if (cardType === 'banner_v8' && cardGoto === 'banner') {
                        if (!i.hasOwnProperty('banner_item')) {
                            console.log("body:" + $response.body);
                            $notification.post(notifiTitle, '推荐页', "banner_item错误");
                        } else {
                            for (const v of i.banner_item) {
                                if (!v.hasOwnProperty('type')) {
                                    console.log("body:" + $response.body);
                                    $notification.post(notifiTitle, '推荐页', "type错误");
                                } else {
                                    if (v.type === 'ad') {
                                        console.log('banner广告');
                                        return false;
                                    }
                                }
                            }
                        }
                    } else if (cardType === 'cm_v2' && ['ad_web_s', 'ad_av', 'ad_web_gif', 'ad_player'].includes(cardGoto)) {
                        // ad_player大视频广告 ad_web_gif大gif广告 ad_web_s普通小广告 ad_av创作推广广告
                        console.log(`${cardGoto}广告去除)`);
                        return false;
                    } else if (cardType === 'small_cover_v10' && cardGoto === 'game') {
                        console.log('游戏广告去除');
                        return false;
                    } else if (cardType === 'cm_double_v9' && cardGoto === 'ad_inline_av') {
                        console.log('创作推广-大视频广告');
                        return false;
                    }
                } else {
                    console.log("body:" + $response.body);
                    $notification.post(notifiTitle, '推荐页', "无card_type/card_goto");
                }
                return true;
            });
        }
    } else if (url.indexOf("x/resource/top/activity") !== -1 && method === getMethod) {
        console.log('bili-beautify 顶部 top 活动')
        if(body.data.hasOwnProperty('online')) {
            body.data = {}
        }
    } else {
        $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
    }
}

body = JSON.stringify(body);
$done({
    body
});

function fixPos(arr) {
    for (let i = 0; i < arr.length; i++) {
        // 修复pos
        arr[i].pos = i + 1;
    }
}