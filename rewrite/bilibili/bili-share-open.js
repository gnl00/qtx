const url = $request.url;
const notifiTitle = "Tab to Open BiliBili";
const notifiSubTitle = "bili-share";
//const biliScheme = 'bilibili://video/'

const isQuanX = typeof $notify != "undefined";
const isSurgeiOS = typeof $utils != "undefined" && $environment.system == "iOS";
const isLooniOS = typeof $loon != "undefined" && /iPhone/.test($loon);

// get share url
if(url.indexOf("m.bilibili.com/video/BV") !=-1 && url.indexOf("share_from") != -1) {
  let finalUrl = url.slice(0, url.indexOf('?'))
  
  console.log('bili-share-open url: ' + finalUrl)
  
  notify(notifiTitle, notifiSubTitle, finalUrl, finalUrl);
  
}

$done();

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
