const express = require("express");
const router = express.Router();
const pool=require("../pool");

//1:加入购物车功能
//http://127.0.0.1:5050/user/login?uname=1&upwd=1
// http://127.0.0.1:5050/cart/addcart?lid=1&lname=1&price=49
router.get("/addcart",(req,res)=>{
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

//2:查询当前登录用户购物车信息
//先行条件：用户登录
//请求方式get 请求地址
//http://127.0.0.1:5050/cart/cart
//http://127.0.0.1:5050/user/login?uname=1&upwd=1
//http://127.0.0.1:5050/cart/cart

router.get("/cart",(req,res)=>{
    //获取uid
    var uid=req.session.uid;
    if(!uid){
        res.send({code:-1,msg:"请登录"})
        return;
    }
    //创建sql语句 查询购物车内容
    var sql="SELECT id,lid,count,lname,price,img_url FROM orange_cart WHERE uid=?";
    //获取返回结果并发送给服务端
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,msg:"查询成功",data:result})
    })
})


//3:删除购物车中一个指定的商品
//先行条件登录
//http://127.0.0.1:5050/cart/del?id=1
//http://127.0.0.1:5050/user/login?uname=1&upwd=1
//http://127.0.0.1:5050/cart/del?id=1

router.get("/del",(req,res)=>{
    //获取id
    var id=req.query.id;
    //创建sql语句查询当前用户的购物车内容
    var sql="DELETE FROM orange_cart WHERE id=?"
    //获取返回结果并发送给客户端
    pool.query(sql,[id],(err,result)=>{
        if(err)throw err;
        //(4)判断条件  如果sql insert/delete/update 执行成功条件：影响行数
        if(result.affectedRows>0){
            res.send({code:1,msg:"删除成功"})
        }else{
            res.send({code:-1,msg:"删除失败"})
        }
    })
})

// http://127.0.0.1:5050/cart/delM?ids=8,9
//4:删除购物车中的多个指定商品
router.get("/delM",(req,res)=>{
    //(1)参数 ids=2，3
    var ids=req.query.ids;
    //(2)sql
    var sql=`DELETE FROM orange_cart WHERE id IN (${ids})`
    //(3)json
    pool.query(sql,(err,result)=>{
      if(err)throw err;
      //(4)判断条件  如果sql insert/delete/update 执行成功条件：影响行数
      if(result.affectedRows>0){
        res.send({code:1,msg:"删除成功"});
      }else{
        res.send({code:-1,msg:"删除失败"});
      }    
    })
  })


module.exports=router;