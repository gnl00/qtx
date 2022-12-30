const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

const isQuanX = typeof $notify != "undefined";
const isSurgeiOS = typeof $utils != "undefined" && $environment.system == "iOS";
const isLooniOS = typeof $loon != "undefined" && /iPhone/.test($loon);

if(body.hasOwnProperty('data') && body.data) {
  // app splash
  if(url.indexOf('v2/system_service/splash_config') && body.data.hasOwnProperty('ads_groups')){
    console.log('xhs-pure handle app splash')
    delete body.data.store;
    delete body.data.splash;
    delete body.data.loading_img;
    body.data.ads_groups=null
    // body.data = {}
  }

  // homefeed 
  if(url.indexOf('v1/system_service/config') && body.data.hasOwnProperty('tabbar')) {
    console.log('xhs-pure handle homefeed')

    // tabbar remove '购买'
    body.data.tabbar.tabs = body.data.tabbar.tabs.filter(item => ['购买', '购物'].indexOf(item.title) === -1);

    // home splash
    if(body.data.splash && body.data.splash.length > 0) body.data.splash.length = 0
    
    // home store
    if(body.data.store) body.data.store = {}

    // home store_detect
    if(body.data.store_detect) body.data.store_detect = false

    // watermark_pic_path
    if(body.data.watermark_pic_path) body.data.watermark_pic_path = ''
  }

  // homefeed ads
  if(url.indexOf('v6/homefeed?client_volume') !== -1 && body.data.length !== 0) {
    body.data = body.data.filter(item => !item.is_ads)
    body.data = body.data.filter(item => !item.hasOwnProperty('note_attributes'))
  }

  // picture watermark
  if(url.indexOf('v2/note/feed') !== -1) {
    for(let i = 0; i < body.data.length; i++) {
      body.data[i].note_list.forEach(item => {
        if(item.hasOwnProperty('media_save_config')) {
          item.media_save_config.disable_watermark = true
        }
      })

      // show download notification
      body.data[i].note_list[i].images_list.forEach((item, idx) => {
        let picUrl = item.original
        notify(`Tab to download picture No.[${idx}]`, 'xhs-pure', picUrl, picUrl);
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

// @zZPiglet
function notify(title = "", subtitle = "", content = "", open_url) {
  if (isQuanX && /iOS/.test($environment.version)) {
      let opts = {};
      if (open_url) opts["open-url"] = open_url;
      if (JSON.stringify(opts) == "{}") {
          $notify(title, subtitle, content);
      } else {
          $notify(title, subtitle, content, opts);
      }
  } else if (isSurgeiOS) {
      let opts = {};
      if (open_url) opts["url"] = open_url;
      if (JSON.stringify(opts) == "{}") {
          $notification.post(title, subtitle, content);
      } else {
          $notification.post(title, subtitle, content, opts);
      }
  } else if (isLooniOS) {
      let opts = {};
      if (open_url) opts["openUrl"] = open_url;
      if (JSON.stringify(opts) == "{}") {
          $notification.post(title, subtitle, content);
      } else {
          $notification.post(title, subtitle, content, opts);
      }
  }
}