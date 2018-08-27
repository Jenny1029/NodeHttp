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
var rp = require('request-promise');

return;
//console.log(fileDir);
//var file = fs.readFileSync('./data')
/* fileDir.map((fileItem, index) => {
  console.log(fileItem);
})
let contentString = fs.readFileSync('./data/download.json', 'utf-8');
let contentArr = JSON.parse(contentString);
console.log(contentArr[0].ordStatusName);
//console.log(mime); */

let qualicationList = [], responseParse;
const excelTitle = ['orderId','创建时间','公司名称', '管理员号码', '申请说明'];
/* 孔孟珍, 张鹍, 镇远, 张涛, 闫乐, 韩国芳, 凌壹, 般石  */
const auditers = ['WB309432', 'WB301668', '143577', 'WB354936', 'WB293417', 'WB367548', '101022', '139782'];
let i =0;
/* do
{
  httpRequestServerPromise(auditers[i], 1);
  //httpRequestServer(auditers[i], 1);
}
while(i < auditers.length) {
  writeExcelFile();
} */

//httpRequestServerPromise(auditers[0], 1);
httpRequestServer(auditers[0], 1);

function writeExcelFile() {
  console.log('哈哈')
  let qualicationBuffer = xlsx.build([{name: 'qualication'}, {data: qualicationList}]);
  console.log('==========42', qualicationBuffer);
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
}

function httpRequestServerPromise(auditer, page) {
  console.log('promise httpRequest Server');
  const options = {
    uri: `https://dayu.alibaba-inc.com/dayubg/defaultScreen.do?event_submit_do_Qry_All_Ord_For_Super_Admin=anything&action=viewAction&_input_charset=UTF-8&startDate=2014-01-01%2000%3A00%3A00&endDate=2018-07-30%2023%3A59%3A59&curPage=${page}&pageSize=10&auditerUser=${auditer}&ordLevel=IMPORTANT&auditStates=1&custFrom=1`,
    headers: {
      'Accept':'*/*',
      'Accept-Encoding':'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
      'Accept-Language':'zh-CN,zh;q=0.8',
      Cookie: 'UM_distinctid=164f501aaa822e-02d78c4519788e-163f6952-13c680-164f501aaa9e70; dayu-bg-web_USER_COOKIE=82B17C000765EEB9BB7E0DF9FDF45C414CB82113D65212035A14D53ACE0300D7A5989BCCAAA4C07EAAD477A92ABCC63D0722537C8DE33997A7300E5F1A48F167F277B192F3B6D3D7329DDC1D3D2ACCD6A2D6BC00352ABC5BC72FBA4144D0A8D3383D8F9C9DF156B6527FE1CA7EDACB035E797754559FD8C5AC9E287C10D4C3DD343AD4E8A751042A18D9B54B5C14B8963DB071969331F72435E2937BA1C05D3EC388718CD170202F2ABFC6DE6C90ACB1; cna=nmboEzPNS1QCAWoLIgW2OQvm; fusion-role=developer; fusion-locale=zh_CN; fusion-bu=51; fusion-pkg=next; fusion-next-base=0; JSESSIONID=96CE1D74E0D50C41A23EDCF851F173AF; dayu-bg-web_SSO_TOKEN=B09F8440F22B456D4C1A674A1DA56EF391C085A9148073838C5D78122C20D0DD1ED252EB03BFBC83C06A882CDCADE75E; dayu-bg-web_LAST_HEART_BEAT_TIME=2D9B629CB466BB332B30D4B0273C6D8E; isg=BBsbLD-fxMpG6jgPeTV7wVJTqnlFWC6UI75kJg1YZJox7D7OlcJVQoAqgw5Hb4fq',
      charset: 'utf-8',
    }
  };
  rp(options)
    .then((res) => {
      //i++;
      console.log(res);
    })
}


function httpRequestServer(auditer, page) {
  console.log('11111111httpRequestServer====>>>');
  const options = {
    hostname: 'dayu.alibaba-inc.com',
    path: `/dayubg/defaultScreen.do?event_submit_do_Qry_All_Ord_For_Super_Admin=anything&action=viewAction&_input_charset=UTF-8&startDate=2014-01-01%2000%3A00%3A00&endDate=2018-07-30%2023%3A59%3A59&curPage=${page}&pageSize=10&auditerUser=${auditer}&ordLevel=IMPORTANT&auditStates=1&custFrom=1`,
    port:80,
    method: 'GET',
    headers: {
      'Accept':'*/*',
      'Accept-Encoding':'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
      'Accept-Language':'zh-CN,zh;q=0.8',
      Cookie: 'UM_distinctid=164f501aaa822e-02d78c4519788e-163f6952-13c680-164f501aaa9e70; dayu-bg-web_USER_COOKIE=82B17C000765EEB9BB7E0DF9FDF45C414CB82113D65212035A14D53ACE0300D7A5989BCCAAA4C07EAAD477A92ABCC63D0722537C8DE33997A7300E5F1A48F167F277B192F3B6D3D7329DDC1D3D2ACCD6A2D6BC00352ABC5BC72FBA4144D0A8D3383D8F9C9DF156B6527FE1CA7EDACB035E797754559FD8C5AC9E287C10D4C3DD343AD4E8A751042A18D9B54B5C14B8963DB071969331F72435E2937BA1C05D3EC388718CD170202F2ABFC6DE6C90ACB1; cna=nmboEzPNS1QCAWoLIgW2OQvm; fusion-role=developer; fusion-locale=zh_CN; fusion-bu=51; fusion-pkg=next; fusion-next-base=0; JSESSIONID=96CE1D74E0D50C41A23EDCF851F173AF; dayu-bg-web_SSO_TOKEN=B09F8440F22B456D4C1A674A1DA56EF391C085A9148073838C5D78122C20D0DD1ED252EB03BFBC83C06A882CDCADE75E; dayu-bg-web_LAST_HEART_BEAT_TIME=2D9B629CB466BB332B30D4B0273C6D8E; isg=BK2tfd0FimS7Hm6529_Ff1BZvE_nouC6YYTSMO-yDMSzZsUYt1gIrE5wVXglR_mU',
      charset: 'utf-8',
    }
  };
  let response;
  qualicationList.push(excelTitle);
  const req = http.request(options, (res) => {
    res.charset = 'utf-8';
    //res.setEnCoding('utf-8');
    //res.header("Content-Type", "application/json;charset=utf-8");
    var header = res.headers;
    //console.log(header);
    /* if(res.headers['content-encoding']=='gzip'){
      var gzip=zlib.createGunzip();
      res.pipe(gzip);
      output=gzip;
    }else{
        output=res;
    } */
    res.on('data', (chunk) => {
       response = chunk.toString('utf-8');
    });
    res.on('end', () => {
      console.log("哈哈哈哈=======》》》》》》》》")
      responseParse = JSON.parse(response);
      auditerTotalPage = responseParse.totalPage;
      console.log('========+++++++++', responseParse, auditerTotalPage);
      responseParse.data.map(resData => {
        let data = [];
        data.push(resData.ordId);
        data.push(resData.createDate);
        let postParam = JSON.parse(resData.postParam.replace(/\\/g, ''));
        data.push(postParam.Param.CorpName);
        data.push(postParam.Param.ManagerContactPhoneNumber);
        data.push(postParam.Param.ApplyRemark);
        qualicationList.push(data);
        process.nextTick(httpRequestServer, i+=1);
      });
      console.log('100',qualicationList);
    });
  });
  req.end((res) => {
    console.log('request======>>>105',res);
  });
}
    

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
