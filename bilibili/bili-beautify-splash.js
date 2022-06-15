// beautify splash/event
const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-beautify";
let body = $response.body;

if(url.indexOf('x/v2/splash/event/list2') && body) {
  
  // splash/event
  console.log('bilibeautify handle splash/event')
  body = null
  
}

$done({
    body
});