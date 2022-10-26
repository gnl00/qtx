const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "keep-pure";
let body = JSON.parse($response.body);

// remove data flow from home page
if(url.indexOf('homepage/v6/tab') !== -1 && body.hasOwnProperty('data')) {
  body.data.sections = body.data.sections.filter(item => item.contentStyle === "quickEntranceV3")
}

// remove homePrime tab
if(url.indexOf('config/v3/basic') !== -1 && body.hasOwnProperty('data')) {
  body.data.homeTabs = body.data.homeTabs.filter(item => item.type === 'homeRecommend')
}

body = JSON.stringify(body);

$done({
    body
});