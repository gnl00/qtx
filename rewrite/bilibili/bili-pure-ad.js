// author @app2smile
// modifier @gnl00

const url = $request.url;
const method = $request.method;
const notifyTitle = "bilibili-json";
if (!$response.body) {
    // 有undefined的情况
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (method !== "GET") {
    $notification.post(notifyTitle, "method错误:", method);
}
let body = JSON.parse($response.body);


if (!body.data) {
    console.log(url);
    console.log(`body:${$response.body}`);
    $notification.post(notifyTitle, url, "data字段错误");
} else {
    if (url.includes("x/v2/feed/index")) {
        console.log('推荐页');
        if (!body.data.items?.length) {
            console.log(`body:${$response.body}`);
            $notification.post(notifyTitle, '推荐页', "items字段错误");
        } else {
            body.data.items = body.data.items.filter(i => {
                const {card_type: cardType, card_goto: cardGoto} = i;
                if (cardType && cardGoto) {
                    if (cardType === 'banner_v8' && cardGoto === 'banner') {
                        console.log(`Banner 去除`);
                        return false;
                    } else if (cardType === 'cm_v2' && ['ad_web_s', 'ad_av', 'ad_web_gif', 'ad_player', 'ad_inline_3d'].includes(cardGoto)) {
                        // ad_player大视频广告 ad_web_gif大gif广告 ad_web_s普通小广告 ad_av创作推广广告 ad_inline_3d 上方大的视频3d广告
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
                    console.log(`body:${$response.body}`);
                    $notification.post(notifyTitle, '推荐页', "无card_type/card_goto");
                }
                return true;
            });
        }
    } else {
        $notification.post(notifyTitle, "路径匹配错误:", url);
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