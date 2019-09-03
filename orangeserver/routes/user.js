const express=require("express");
const router=express.Router();
const pool=require("../pool");

//注册接口
router.get("/reg",(req,res)=>{
    var uname=req.query.uname;
    var upwd=req.query.upwd;
    var upwds=req.query.upwd;
    var email=req.query.email;
    var uphone=req.query.uphone;
    // 查询语句
    var sql="INSERT INTO orange_user(uname,upwd,upwds,email,uphone) VALUES(?,md5(?),md5(?),?,?)";
    pool.query(sql,[uname,upwd,upwds,email,uphone],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:1,msg:"注册成功"})
        }else{
            res.send({code:-1,msg:"注册失败"})
        }
    })
})
//登录接口
router.get("/login",(req,res)=>{
    //参数方式：?uname=tom&upwd=123
    var uname=req.query.uname;
    var upwd=req.query.upwd;
    console.log(req.body)
    var sql="SELECT uid FROM orange_user WHERE uname=? AND upwd=md5(?)";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) throw err;
        if(result.length==0){
            res.send({code:-1,msg:"用户名或密码错误"})
        }else{
            //登录成功 1:保存凭据在session中
            //2：吧成功的信息发送给脚手架
            req.session.uid=result[0].uid;
            // console.log(req.session)
            res.send({code:1,msg:"登录成功"})
        }
    })
})


module.exports=router