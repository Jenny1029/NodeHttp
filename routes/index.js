var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var json = require("JSON");
var mime = require('mime');
/* 基于NodeJS解析excel文件数据 */
var xlsx = require('node-xlsx');
var fileDir = fs.readdirSync('./data');
var zlib = require('zlib');
console.log(fileDir);
//var file = fs.readFileSync('./data')
fileDir.map((fileItem, index) => {
  console.log(fileItem);
})
let contentString = fs.readFileSync('./data/download.json', 'utf-8');
let contentArr = JSON.parse(contentString);
console.log(contentArr[0].ordStatusName);
let excelTitle = [''];
console.log(mime);
const options = {
  hostname: 'dayu.alibaba-inc.com',
  path: '/dayubg/defaultScreen.do?event_submit_do_Qry_All_Ord_For_Super_Admin=anything&action=viewAction&_input_charset=UTF-8&startDate=2014-01-01%2000%3A00%3A00&endDate=2018-07-30%2023%3A59%3A59&curPage=1&pageSize=1&auditerUser=WB309432&ordLevel=IMPORTANT&auditStates=1&custFrom=1',
  port:80,
  method: 'GET',
  headers: {
    'Accept':'*/*',
    'Accept-Encoding':'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
    'Accept-Language':'zh-CN,zh;q=0.8',
    Cookie: 'UM_distinctid=164f501aaa822e-02d78c4519788e-163f6952-13c680-164f501aaa9e70; dayu-bg-web_USER_COOKIE=82B17C000765EEB9BB7E0DF9FDF45C414CB82113D65212035A14D53ACE0300D7A5989BCCAAA4C07EAAD477A92ABCC63D0722537C8DE33997A7300E5F1A48F167F277B192F3B6D3D7329DDC1D3D2ACCD6A2D6BC00352ABC5BC72FBA4144D0A8D3383D8F9C9DF156B6527FE1CA7EDACB035E797754559FD8C5AC9E287C10D4C3DD343AD4E8A751042A18D9B54B5C14B8963DB071969331F72435E2937BA1C05D3EC388718CD170202F2ABFC6DE6C90ACB1; cna=nmboEzPNS1QCAWoLIgW2OQvm; fusion-role=developer; fusion-locale=zh_CN; fusion-bu=51; fusion-pkg=next; fusion-next-base=0; JSESSIONID=0C36EFAFEE1DF72BB35B68F02B49842A; dayu-bg-web_SSO_TOKEN=0CC939A9E61AC78623DAC94F893C1951DA0339AF65C6E8CF822C4EA23E0728131ED252EB03BFBC83C06A882CDCADE75E; dayu-bg-web_LAST_HEART_BEAT_TIME=DAA7A31F20AEECE7BD855364FA8E9FAA; isg=BODgQpHbr0DWyhN-jlzA4E0Kseis8sj9bHePN1r1BfubVal_Avt7Qq0j6b_wZXyL',
    'Content-Type': 'application/json;charset=utf-8',
    /* 'Content-Type': 'application/json;charset=utf-8' */
  }
}
console.log("http.request begin");
let qualicationList = [], output, response;
const req = http.request(options, (res) => {
  res.charset = 'utf-8';
  //res.setEnCoding('utf-8');
  //res.header("Content-Type", "application/json;charset=utf-8");
  var header = res.headers;
  console.log(header);
  output = res;
  /* if(res.headers['content-encoding']=='gzip'){
    var gzip=zlib.createGunzip();
    res.pipe(gzip);
    output=gzip;
  }else{
      output=res;
  } */
  output.on('data', (chunk) => {
     response = chunk.toString('utf-8');
     console.log('==================++++++++++++++++>>>>>>>>>>>>>>>>', response);
  });
  output.on('end', () => {
    var responseParse = JSON.parse(response);
    responseParse.data.map(resData => {
      let data = [];
      data.push(resData.ordId);
      data.push(resData.createDate);
      let postParam = JSON.parse(resData.postParam.replace(/\\/g, ''));
      data.push(postParam.Param.CorpName);
      data.push(postParam.Param.ManagerContactPhoneNumber);
      data.push(postParam.Param.ApplyRemark);
      qualicationList.push(data);
    });
    console.log(qualicationList);
    let qualicationBuffer = xlsx.build([{name: 'qualication'}, {data: qualicationList}]);
    console.log(qualicationBuffer);
    fs.writeFile('./data/qualication.xlsx', qualicationBuffer, (err)=> {
      if(err) throw err;
      console.log('File is saved!');
    });
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }
    fs.writeFile(`./data/download.json`, JSON.stringify(responseParse.data), (res) => {
      console.log(res);
    });
  });
});
req.end((res) => {
  console.log(res);
});
    

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
