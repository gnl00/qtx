const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "baidumap-pure";
let body = JSON.parse($response.body);

// splash
if(url.indexOf('afd/entry?') !== -1 && body) {
  if(body.res.ad.length) {
    body.res.ad.length = 0
  }
  if(body.res.splash) {
    delete body.res.splash
  }
}

body = JSON.stringify(body);
$done({
    body
});