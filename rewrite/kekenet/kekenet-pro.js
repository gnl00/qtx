const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "kekenet-pro";
let body = JSON.parse($response.body);

if(body) {
  if(url.indexOf('keke/mobile/index.php') !== -1 && body.hasOwnProperty('Data')) {
    body.Data.is_vip = 1
    body.Data.end_time = 2524608000
  }
}

body = JSON.stringify(body);
$done({
    body
});