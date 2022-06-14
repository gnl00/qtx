const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data')) {
  if(url.indexOf('2/video/tiny_stream_video_list') !== -1) {
    body.data = {}
  }
}

body = JSON.stringify(body);
$done({
    body
});