const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

// 微博 推荐视频
if(url.indexOf('2/video/tiny_stream_video_list') !== -1 && body.hasOwnProperty('data')) {
  console.log('weibo-pure handle tiny_stream_video_list')
    body.data = {}
}
if(url.indexOf('2/!/multimedia/playback/batch_get') !== -1 && body.hasOwnProperty('list')) {
  console.log('weibo-pure handle batch_get')
  body.list = []
}
if(url.indexOf('2/video/tiny_stream_channel_list?') !== -1 && body) {
  body.channel_list.length = 0
  body.force_refresh_interval = '30000'
  delete body.select_id
}

// 国际版/极速版 热搜移除娱乐内容
if(url.indexOf('/portal.php?a=search_topic') !== -1 && body.data.length !== 0) {
  console.log('weibo-pure handle /portal.php?a=search_topic')
  body.data = body.data.filter(entertainmentContentFilter)
}
if(url.indexOf('/portal.php?ct=feed&a=trends') !== -1 && body.data) {
  console.log('weibo-pure handle /portal.php?ct=feed&a=trends')
  body.data.search_topic.cards = body.data.search_topic.cards.filter(entertainmentContentFilter)
}
if(url.indexOf('/portal.php?ct=feed&a=search_topic') !== -1 && body.data) {
  console.log('weibo-pure handle /portal.php?ct=feed&a=search_topic')
  body.data = body.data.filter(entertainmentContentFilter)
}

// 国际版/极速版 移除文娱榜
if(url.indexOf('/portal.php?a=search_discover') !== -1 && body.data) {
  body.data = body.data.filter(item => '文娱榜' !== item.category_name || 'search_ent' !== item.type)
}
if(url.indexOf('/portal.php?a=search_ent') !== -1 && body.data) {
  body.data = {}
}

body = JSON.stringify(body);
$done({
    body
});

function entertainmentContentFilter(item) {
  return ['剧集', '电影', '综艺'].indexOf(item.subject_label) === -1
}