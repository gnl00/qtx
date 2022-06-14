// beautify account/mine

const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-beautify";
let body = JSON.parse($response.body);

if( body.hasOwnProperty('data') 
    && url.indexOf("x/v2/account/mine") !== -1 
    && method === getMethod ) {
  
  // 我的页面
  console.log('我的页面')
  if(body.data.hasOwnProperty('sections_v2')) {
      body.data.sections_v2 = body.data.sections_v2.filter(item => ['创作中心', '推荐服务'].indexOf(item.title) === -1)
  }
  
}