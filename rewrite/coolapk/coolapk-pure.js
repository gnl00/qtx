const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "coolapk-pure";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data')) {
    // 首页 banner
    if(url.indexOf('v6/main/indexV8') !== -1) {
        console.log('coolapk-pure index banner')
        body.data = body.data.filter(item => {
        if(item.hasOwnProperty('entityTemplate')) {
            return ['listCard', 'sponsorCard'].indexOf(item.entityTemplate) === -1;
        }
        return item;
        })
    }

    // 首页信息流
    if(url.indexOf('v6/feed/detail') !== -1){
        console.log('coolapk-pure feed detail')

        if(body.data.hasOwnProperty('detailSponsorCard')) {
            body.data.detailSponsorCard = null
        }

        if(body.data.hasOwnProperty('hotReplyRows')) {
            body.data.hotReplyRows = body.data.hotReplyRows.filter(item => !item.entityTemplate)
        }
    }

    // 帖子回复流
    if(url.indexOf('v6/feed/replyList') !== -1){
        console.log('coolapk-pure feed reply')

        body.data = body.data.filter(item => !item.entityTemplate)
    }
}

body = JSON.stringify(body);
$done({
    body
});