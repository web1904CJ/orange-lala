const express = require("express");
const router = express.Router();
const pool=require("../pool");

//查询轮播图图片
router.get("/carousel",(req,res)=>{
    var sql="SELECT *FROM  orange_index_carousel";
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send({code:1,msg:"轮播图片查询成功",data:result})
    })
})

module.exports=router;