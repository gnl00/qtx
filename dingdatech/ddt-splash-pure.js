const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "dingdatech-pure";
let body = $response.body;

if(url.indexOf('/adReport') !== -1 && body) {
  body = ''
}

$done({
    body
});