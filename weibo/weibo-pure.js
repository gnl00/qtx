const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "xhs-pure";
let body = JSON.parse($response.body);

// 微博 移除推荐视频
if(url.indexOf('2/video/tiny_stream_video_list') !== -1 && body.hasOwnProperty('data')) {
  console.log('weibo-pure handle tiny_stream_video_list')
    body.data = {}
}
if(url.indexOf('2/!/multimedia/playback/batch_get') !== -1 && body.hasOwnProperty('list')) {
  console.log('weibo-pure handle batch_get')
  body.list = []
}
if(url.indexOf('2/video/tiny_stream_channel_list?') !== -1 && body) {
  body.channel_list.length = 0
  body.force_refresh_interval = '30000'
  delete body.select_id
}

// 微博 我的页面精简
if(url.indexOf('2/profile/me?') !== -1 && body) {
  console.log('weibo-pure profile 精简')

  // 移除顶部青少年模式按钮
  if(body.teenager_mode_btn) {
    delete body.teenager_mode_btn
  }

  body.items = body.items.filter(item => {
    // 移除 VipCenter 占位广告
    if(item.itemId && item.itemId.indexOf('profileme_mine') !== -1) {
      delete item.header.vipCenter
    }

    // 从 top8 移除我的钱包、我的订单、创作中心、广告中心
    if(item.itemId && item.itemId.indexOf('top8') !== -1) {
      item.items = item.items.filter(it => ["100505_-_pay", "100505_-_ordercenter", "100505_-_productcenter", "100505_-_promote"].indexOf(it.itemId) === -1)
    }

    // 移除任务中心
    if(item.itemId && item.itemId.indexOf('newusertask') !== -1) {
      return false
    }
    // 移除我的钱包
    if(item.itemId && item.itemId.indexOf('mypay') !== -1) {
      return false
    }

    // 移除为你推荐
    if(item.category && item.category.indexOf('mine') !== -1) {
      return false
    }

    return true
  })
}

// 微博 发现页面精简
if(url.indexOf('2/search/finder?') !== -1 && body) {
  console.log('weibo-pure simplify while open finder')
  simplifyFinder(body)
}
if(url.indexOf('2/search/container_timeline?') !== -1 && body) {
  console.log('weibo-pure simplify while dragdown refresh finder')
  simplifyOnFinderRefresh(body)
}


// 国际版/极速版 热搜移除娱乐内容
if(url.indexOf('/portal.php?a=search_topic') !== -1 && body.data.length !== 0) {
  console.log('weibo-pure handle /portal.php?a=search_topic')
  body.data = body.data.filter(entertainmentContentFilter)
}
if(url.indexOf('/portal.php?ct=feed&a=trends') !== -1 && body.data) {
  console.log('weibo-pure handle /portal.php?ct=feed&a=trends')
  body.data.search_topic.cards = body.data.search_topic.cards.filter(entertainmentContentFilter)
}
if(url.indexOf('/portal.php?ct=feed&a=search_topic') !== -1 && body.data) {
  console.log('weibo-pure handle /portal.php?ct=feed&a=search_topic')
  body.data = body.data.filter(entertainmentContentFilter)
}

// 国际版/极速版 移除文娱榜
if(url.indexOf('/portal.php?a=search_discover') !== -1 && body.data) {
  body.data = body.data.filter(item => '文娱榜' !== item.category_name || 'search_ent' !== item.type)
}
if(url.indexOf('/portal.php?a=search_ent') !== -1 && body.data) {
  body.data = {}
}

body = JSON.stringify(body);
$done({
    body
});

function entertainmentContentFilter(item) {
  return ['剧集', '电影', '综艺'].indexOf(item.subject_label) === -1
}

function simplifyFinder(body) {
  body.channelInfo.channels = body.channelInfo.channels.filter(item => item.name === '发现')

  body.channelInfo.channels.forEach(item => {
    if(item.payload.items.length !== 0) {
      item.payload.items = item.payload.items.filter(pitem=> {
        if(pitem.category && pitem.category === 'feed') {
          return false
        } else if(pitem.data && pitem.data.title && pitem.data.title === '热门微博') {
          return false
        } else if(pitem.category === 'card' && pitem.data.itemid === 'hot_search') {
          // 去除发现页面顶部热搜中的商业推广和娱乐内容
          console.log('weibo-pure handle finder')
          pitem.data.group = pitem.data.group.filter(gitem => {
            if(gitem.icon) return gitem.icon.indexOf('jian') === -1 || gitem.icon.indexOf('entertainment') === -1
          })
        }
        return true
      })
    }
  })
}

function simplifyOnFinderRefresh(body) {
  body.items = body.items.filter(item => {
    if(item.category && item.category === 'feed') return false
    if(item.data && item.data.title && item.data.title === '热门微博') return false
  })
}