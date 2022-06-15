// beautify account/mine and account/mode

const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-beautify";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data')) {

  // 精简我的页面
  if(url.indexOf("x/v2/account/mine") !== -1 && body.data.hasOwnProperty('sections_v2')) {
    console.log('bili-beautify handle 我的')
    body.data.sections_v2 = body.data.sections_v2.filter(item => ['创作中心', '推荐服务'].indexOf(item.title) === -1)
  }

  // 去除青少模式每天两次提醒
  if(url.indexOf('x/v2/account/mode/status') !== -1 && body.data.length !== 0) {
    console.log('bili-beautify handle account/mode/status')
    body.data.forEach(item => {
      if(item.mode === 'teenagers') item.daily_dialog_ab = 0
    })
  }
  
}

body = JSON.stringify(body);
$done({
    body
});