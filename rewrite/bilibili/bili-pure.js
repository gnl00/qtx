const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-pure";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data')) {
  // 首页精简
  if (url.indexOf("resource/show/tab/v2") !== -1 && method === getMethod) {
    console.log('bili-pure handle 首页');

    // 首页 top 栏右侧，去掉除消息之外的内容
    if (body.data.hasOwnProperty('top')) {
        console.log('bili-pure handle 首页 top');
        body.data.top = body.data.top.filter(item => '消息' === item.name);
        fixPos(body.data.top);
    }
  // 首页 top 栏左侧，去掉头像左下角的 story
  if (body.data.hasOwnProperty('top_left')) {
    console.log('bili-pure handle 首页 story');
    delete body.data.top_left
  }

    // 首页 tab 栏
    if (body.data.hasOwnProperty('tab'))  {
        console.log('bili-pure handle 首页 tab');
        body.data.tab = body.data.tab.filter(item => ['推荐', '热门', '追番'].indexOf(item.name) !== -1 );
        fixPos(body.data.tab);
    }
    // 首页 bottom 栏
    if (body.data.hasOwnProperty('bottom')) {
        console.log('bili-pure handle 首页 bottom');
        body.data.bottom = body.data.bottom.filter(item => ['首页', '动态', '我的'].indexOf(item.name) !== -1);
        fixPos(body.data.bottom);
    }
  }
  // 去掉首页右上角 top 栏旁边的活动
  if(url.indexOf('x/v2/activity/inline') !== -1 && body.data) {
    console.log('bili-pure handle 首页 top 活动')
    body.data = {}
  }
  if (url.indexOf("x/resource/top/activity") !== -1 && method === getMethod) {
    console.log('bili-pure handle 首页 top 活动')
    if(body.data.hasOwnProperty('online')) {
        body.data = {}
    }
  }

  // 去广告 @app2smile
  if (url.indexOf("x/v2/feed/index") !== -1 && method === getMethod) {
    console.log('bili-pure handle 推荐页广告');
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