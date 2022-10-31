const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bili-beautify";
let body = JSON.parse($response.body);

if(body && body.hasOwnProperty('data')) {
  // 首页精简
  if (url.indexOf("resource/show/tab/v2") !== -1 && method === getMethod) {
    console.log('bili-beautify handle 首页');

    // 首页 top 栏右侧，去掉除消息之外的内容
    if (body.data.hasOwnProperty('top')) {
        console.log('bili-beautify handle 首页 top');
        body.data.top = body.data.top.filter(item => '消息' === item.name);
        fixPos(body.data.top);
    }
    
  // 首页 top 栏左侧，去掉头像左下角的 story
  if (body.data.hasOwnProperty('top_left')) {
    console.log('bili-beautify handle 首页 story');
    delete body.data.top_left
  }

    // 首页 tab 栏
    if (body.data.hasOwnProperty('tab'))  {
        console.log('bili-beautify handle 首页 tab');
        body.data.tab = body.data.tab.filter(item => ['推荐', '热门', '追番'].indexOf(item.name) !== -1 );
        fixPos(body.data.tab);
    }
    
    // 首页 bottom 栏
    if (body.data.hasOwnProperty('bottom')) {
        console.log('bili-beautify handle 首页 bottom');
        body.data.bottom = body.data.bottom.filter(item => ['首页', '动态', '消息','我的'].indexOf(item.name) !== -1);
        fixPos(body.data.bottom);
    }
  }
  
  // 去掉首页右上角 top 栏旁边的活动
  if(url.indexOf('x/v2/activity/inline') !== -1 && body.data) {
    console.log('bili-beautify handle 首页 top 活动')
    body.data = {}
  }
  
  if (url.indexOf("x/resource/top/activity") !== -1 && method === getMethod) {
    console.log('bili-beautify handle 首页 top 活动')
    if(body.data.hasOwnProperty('online')) {
        body.data = {}
    }
  }
}

body = JSON.stringify(body);

$done({
    body
});

function fixPos(arr) {
    for (let i = 0; i < arr.length; i++) {
        // 修复pos
        arr[i].pos = i + 1;
    }
}