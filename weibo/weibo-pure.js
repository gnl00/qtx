const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "weibo-pure";
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
  console.log('weibo-pure simplify while finder open')
  simplifyFinder(body)
}
if(url.indexOf('2/search/container_timeline?') !== -1 && body) {
  console.log('weibo-pure simplify while finder dragdown refresh')
  simplifyOnFinderRefresh(body)
}
if(url.indexOf('2/search/container_discover?') !== -1 && body) {
  console.log('weibo-pure simplify while finder auto refresh')
  simplifyOnFinderRefresh(body)
}

// 微博 热搜榜精简
if(url.indexOf('2/page?') !== -1 && body) {
  console.log('weibo-pure handle 2/page?')

  // 去掉除了热搜以外的 channel
  if(body.pageInfo && body.pageInfo.cardlist_head_cards.length !== 0) {
    body.pageInfo.cardlist_head_cards.forEach(item => {
      item.channel_list = item.channel_list && item.channel_list.length !== 0 ? item.channel_list.filter(citem => citem.name === '热搜') : item.channel_list
    })
  }

  // 去掉热搜 channel 中的文娱内容
  if(body.cards && body.cards.length !== 0) {
    body.cards = body.cards.filter(item => item.title && ['实时热点，每分钟更新一次', '实时上升热点'].indexOf(item.title) !== -1)
  
    // 去掉实时热点中的剧集|电影|综艺内容
    body.cards.forEach(item => {
      if(item.itemid && item.itemid === 'hotword' && item.card_group && item.card_group.length !==0) {
        item.card_group = item.card_group.filter(gitem => {
          if(gitem.desc_extr) {
            return gitem.desc_extr.indexOf('剧集') === -1 && gitem.desc_extr.indexOf('综艺') === -1 && gitem.desc_extr.indexOf('电影') === -1
          }
          return true
        })
      }
    })
  }
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

// 国际版/极速版 热搜移除文娱榜
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
  return ['剧集', '电影', '综艺', '音乐', '盛典'].indexOf(item.subject_label) === -1
}

function simplifyFinder(body) {
  body.channelInfo.channels = body.channelInfo.channels.filter(item => item.name === '发现')

  body.channelInfo.channels.forEach(item => {
    if(item.payload.items.length !== 0) {
      item.payload.items = item.payload.items.filter(pitem=> {
        // 只保留微博热搜内容
        if(pitem.data && pitem.data.itemid && pitem.data.itemid === 'hot_search') {
          // 展示单列内容
          pitem.data.col = 1

          // 过滤微博热搜内容
          pitem.data.group = pitem.data.group.length !== 0 ? pitem.data.group.filter(gitem => gitem.icon && gitem.icon.indexOf('jian') === -1 && gitem.icon.indexOf('entertainment') === -1 && gitem.icon.indexOf('recom') === -1) : pitem.data.group
          return true
        }
        return false
      })
    }
  })
}

function simplifyOnFinderRefresh(body) {
  // 只保留微博热搜内容
  body.items = body.items.filter(item => {
    if(item.data && item.data.itemid && item.data.itemid === 'hot_search') {
      // 展示单列内容
      item.data.col = 1

      // 过滤微博热搜内容
      item.data.group = item.data.group.length !== 0 ? item.data.group.filter(gitem => gitem.icon && gitem.icon.indexOf('jian') === -1 && gitem.icon.indexOf('entertainment') === -1 && gitem.icon.indexOf('recom') === -1) : item.data.group
      return true
    }
    return false
  })
}