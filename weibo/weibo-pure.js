const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

// recommand video
if(url.indexOf('2/video/tiny_stream_video_list') !== -1 && body.hasOwnProperty('data')) {
  console.log('weibo-pure handle tiny_stream_video_list')
    body.data = {}
  }
if(url.indexOf('2/!/multimedia/playback/batch_get') !== -1 && body.hasOwnProperty('list')) {
  console.log('weibo-pure handle batch_get')
  body.list = []
}

// 热搜移除娱乐内容
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

body = JSON.stringify(body);
$done({
    body
});

const entertainmentContentFilter = item => ['剧集', '电影', '综艺'].indexOf(item.subject_label) === -1