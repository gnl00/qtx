const url = $request.url;
const method = $request.method;
const notifiTitle = "gaodemap-pure";
let response = $response.body;
let body = null
let isJSON = true

// spalsh
if(url.indexOf('ws/aos/alimama/splash_screen_rt') !== -1) {
  console.log('gdmap-pure handle ws/aos/alimama/splash_screen_rt')
  try {
    body = JSON.parse(response);
    if(body.data) body.data = {}
  } catch (e) {
    isJSON = false
  }
}

let doneOBJ = null
if(isJSON) {
 doneOBJ = JSON.stringify(body)
}

$done({
  body: doneOBJ
});