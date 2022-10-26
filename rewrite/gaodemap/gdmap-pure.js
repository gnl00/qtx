const url = $request.url;
const method = $request.method;
const notifiTitle = "gaodemap-pure";
let response = JSON.parse($response.body);

// spalsh
if(url.indexOf('ws/aos/alimama/splash_screen_rt') !== -1 && response.data) {
  response.data = {}
}

response = JSON.stringify(response);
$done({
  response
});