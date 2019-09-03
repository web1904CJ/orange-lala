//使用express构建web服务器
const express = require('express');
const bodyParser = require('body-parser');

const index=require("./routes/index");
const user=require("./routes/user")
// const details=require("./routes/details");

/*引入路由模块*/


//跨域
const cors=require("cors"); 
//session配置
const session = require("express-session");
var app = express();

var server = app.listen(5050);//部署新浪云，硬性要求必须监听5050端口
//这句话是用来解决跨域问题
app.use(cors({
  //允许跨域访问程序地址列表
  origin:["http://127.0.0.1:8080",
  "http://localhost:8080"],
  credentials:true //请求验证
}))

//配置session模块
app.use(session({
  secret:"128位字符串",     //安全字符串
  resave:true,             //请求更新数据
  saveUninitialized:true   //保存 初始数据
}));

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
//托管静态资源到public目录下
app.use(express.static('public'));
/*使用路由器来管理路由*/
app.use("/index",index);
app.use("/user",user)
// app.use("/details",details);


