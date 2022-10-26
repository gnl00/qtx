const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "quark-pro";
let body = JSON.parse($response.body);

console.log('quark-pro start')


if(url.indexOf('clouddrive/member?') !== -1 && body && body.data) {
  body.data.member_type = "SUPER_VIP"
  body.data.subscribe_status_map = {
	  "SUPER_VIP": {}
  }
  body.data.member_status.SUPER_VIP = "PAIED"
}

if(url.indexOf('clouddrive/user/insight?' !== -1 && body && body.data)) {
	body.data.member_status = 'PAIED'
	body.data.member_type = 'SUPER_VIP'
}

// clouddrive/file/v2/play
if(url.indexOf('clouddrive/file/v2/play' !== -1 && body && body.data)) {
	// body.data.default_resolution = 'super'
	body.data.origin_default_resolution = 'super'
	
	body.data.video_list.forEach(item => {
		// item.member_right = 'normal'
		
		item.trans_status = 'success'
		item.right = 'free_limit'
		item.accessable = true
		
		// resolution sidebar at right
		// item.resolution = 'high'
	})
	
}

console.log('quark-pro done')

body = JSON.stringify(body);
$done({
    body
});