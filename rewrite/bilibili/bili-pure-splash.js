// bili-beautify handle splash
const url = $request.url;
const method = $request.method;
const notifiTitle = "bili-beautify";
let rawBody = $response.body;

// spalsh/list
if(url.indexOf('x/v2/splash/list') !== -1 && rawBody) {
  console.log('bili-beautify handle splash/list')
  handleRawBody()
}

// splash/show
// if(url.indexOf('x/v2/splash/show') !== -1 && rawBody) {
//   console.log('bili-beautify handle splash/show')
//   handleRawBody()
// }

// splash/event/list2
if(url.indexOf('x/v2/splash/event/list2') !== -1 && rawBody) {
  console.log('bili-beautify handle splash/event/list2')
  handleRawBody()
}

// splash/brand/list
// bilibili 官方自定义开屏画面
// if(url.indexOf('x/v2/splash/brand/list') !== -1 && rawBody) {
//   console.log('bili-beautify handle splash/brand/list')
//   handleRawBody()
// }

function handleRawBody() {
  if(rawBody) {
    // check if it is json
    try {
      // json, convert json to js object
      const body = JSON.parse(rawBody)
      console.log('splash response is object')
      if(body && body.hasOwnProperty('data')) {
        if(body.data.hasOwnProperty('show')) body.data = {}
        if(body.data.hasOwnProperty('list') && body.data.list.length !== 0) {
          body.data.list.forEach(item => {
            if(item.duration) item.duration = 0
            // 2050 年
            if(item.begin_time) item.begin_time = 2524608000
            if(item.end_time) item.end_time = 2524608000
          })
        }
      }
      // convert js object back to json
      rawBody = JSON.stringify(body)
    } catch(e) {
      // not json
      console.log('splash response is string')
      rawBody = null
    }
  }
}

$done({
  body: rawBody
});
