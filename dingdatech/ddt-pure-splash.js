const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "dingdatech-pure";
let rawBody = $response.body;

if(url.indexOf('/adReport') !== -1 && rawBody) {
  console.log('ddt-pure-splash handle adReport')
  rawBody = ''
}
if(url.indexOf('obj/ad-pattern/renderer/package.json') !== -1 && rawBody) {
  console.log('ddt-pure-splash handle obj/ad-pattern/renderer/package.json')
  rawBody = ''
}

$done({
  rawBody
});