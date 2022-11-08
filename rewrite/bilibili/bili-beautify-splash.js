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
  if(rawBody && typeof(rawBody) === 'string') {
    // check if it is json
    try {
      // json, convert json to js object
      const body = JSON.parse(rawBody)
      if(body && body.hasOwnProperty('data') && body.data.hasOwnProperty('show')) {
        body.data = {}
      } else if(body && body.hasOwnProperty('data') && body.data.hasOwnProperty('list') && body.data.list.length !== 0) {
        // 有些情况下不能强制删除开屏广告 @ddgksf2013
        body.data.list.forEach(item => {
          if(item.duration && item.duration !== 0) item.duration = 0
          // 2050 年
          if(item.begin_time) item.begin_time = 2524608000
          if(item.end_time) item.end_time = 2524608000
        })
      }

      // convert js object back to json
      rawBody = JSON.stringify(body)

    } catch(e) {
      // not json
      rawBody = null
    }
  } else {
    rawBody = null
  }
}

$done({
  rawBody
});