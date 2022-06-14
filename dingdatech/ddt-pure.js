const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "dingdatech-pure";
let body = JSON.parse($response.body);

if(url.indexOf('page/js/adConfig') !== -1 && body.hasOwnProperty('time')) {
  body.time = 0
}

body = JSON.stringify(body);
$done({
    body
});