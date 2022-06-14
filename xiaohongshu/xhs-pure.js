const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data') && body.data) {
  // app splash
  if(url.indexOf('v2/system_service/splash_config') && body.data.hasOwnProperty('ads_groups')){
    console.log('xhs-pure handle app splash')
    body.data = {}
  }

  // app ads
  if(url.indexOf('v1/ads/resource') && body.data.length !== 0) {
    body.data.length = 0
  }

  // homefeed tabbar
  if(url.indexOf('v1/system_service/config') && body.data.hasOwnProperty('tabbar')) {
    console.log('xhs-pure handle homefeed tabbar')

    body.data.tabbar.tabs = body.data.tabbar.tabs.filter(item => ['购买', '购物'].indexOf(item.title) === -1);
  }

  // homefeed categories
  if(url.indexOf('v6/homefeed/categories')) {
    console.log('xhs-pure handle homefeed categories')

    // if(body.data.hasOwnProperty('categories')) {
    //   body.data.categories = body.data.categories.map(item => {
    //     if(item.oid.indexOf('_v3') === -1) {
    //       item.oid = item.oid.concat('_v3');
    //   }
    //   return item;
    //   })
    // }

    if(body.data.hasOwnProperty('rec_categories')) {
      delete body.data.rec_categories
    }
  }

  // force enable download
  // if(url.indexOf('v10/note/video/save') && body.data) {
  //   body.data = {
  //     ...body.data,
  //     msg: '正在下载',
  //     disable: false
  //   }
  // }

  // picture watermark
  if(url.indexOf('v2/note/feed') !== -1) {
    for(let i = 0; i < body.data.length; i++) {
      body.data[i].note_list.forEach(item => {
        if(item.hasOwnProperty('media_save_config')) {
          item.media_save_config.disable_watermark = true
        }
      })
    }
  }

  //video watermark
  if(url.indexOf('v3/note/videofeed') !== -1) {
    body.data.forEach(item => {
      if(item.hasOwnProperty('media_save_config')) {
          item.media_save_config.disable_watermark = true
      }
  })
  }
}

body = JSON.stringify(body);
$done({
    body
});