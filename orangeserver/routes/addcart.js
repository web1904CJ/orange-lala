const express = require("express");
const router = express.Router();
const pool=require("../pool");

//http://127.0.0.1:5050/user/login?uname=1&upwd=1
// http://127.0.0.1:5050/addcart/addcart?lid=1&lname=1&price=49
router.get("/addcart",(req,res)=>{
    //加入购物车功能
    //获取当前用户uid值
    var uid=req.session.uid;
    //判断用户是否登录
    if(!uid){
        res.send({code:-1,msg:"请先登录"});
        return;
    }
    //获取商品编号 价格 名称
    var lid=req.query.lid;
    var lname=req.query.lname;
    var price=req.query.price;
    //查询当前用户是否有已经加入过购物车
    var sql="SELECT id FROM orange_cart WHERE uid =? AND lid=?";
    pool.query(sql,[uid,lid],(err,result)=>{
        if(err) throw err;
        var sql="";
        if(result.length==0){
            //没有加入购物车的商品添加入购物车
            sql=`INSERT INTO orange_cart VALUES(null,${lid},${uid},1,'${lname}',${price},'01.jpg')`;
        }else{
            //已有商品添加
            sql=`UPDATE orange_cart SET count=count+1 WHERE uid=${uid} AND lid=${lid}`;
        }
        //5:购买过此商品更新
        pool.query(sql,(err,result)=>{
        if(err)throw err;
        // console.log(result);
        res.send({code:1,msg:"添加成功"})
        })
    })
})

module.exports=router;