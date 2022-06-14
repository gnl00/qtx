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

body = JSON.stringify(body);
$done({
    body
});