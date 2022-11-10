const url = $request.url;
const method = $request.method;
const notifiTitle = "gdmap-pure";
let response = $response.body;
let body = null
let isJSON = true

// spalsh
if(url.indexOf('ws/aos/alimama/splash_screen_rt') !== -1) {
  console.log('gdmap-pure handle ws/aos/alimama/splash_screen_rt')
  try {
    body = JSON.parse(response);
    if(body.data) body.data = {}
    
    console.log('gdmap obj response')
  } catch (e) {
    isJSON = false
    console.log('gdmap string response')
  }
}

if(isJSON) {
  $done({
    body: JSON.stringify(body)
  })
} else {
  $done({
    body: null
  })
}