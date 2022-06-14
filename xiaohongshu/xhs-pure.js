const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

if(body.hasOwnProperty('data') && body.data) {

  // homefeed tabbar
  if(url.indexOf('v1/system_service/config') && body.data.hasOwnProperty('tabbar')) {
    body.data.tabbar.tabs = body.data.tabbar.tabs.filter(item => item.title !== '购买');
  }

  // homefeed categories
  if(url.indexOf('v6/homefeed/categories')) {
    if(body.data.hasOwnProperty('categories')) {
      body.data.categories = body.data.categories.map(item => {
        if(item.oid.indexOf('_v3') === -1) {
          item.oid = item.oid.concat('_v3');
      }
      return item;
      })
    }

    if(body.data.hasOwnProperty('rec_categories')) {
      body.data.rec_categories = [];
    }
  }
  
  // watermark
  if(url.indexOf('v2/note/feed') !== -1 && body.data[0].note_list[0].media_save_config.hasOwnProperty('disable_watermark')) {
    body.data[0].note_list[0].media_save_config.disable_watermark = true;
  }
}

body = JSON.stringify(body);
$done({
    body
});