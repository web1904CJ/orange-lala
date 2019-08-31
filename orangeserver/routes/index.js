const express=require("express");
const router=express.Router();
const pool=require("../pool");

// 商品详情
//http:127.0.0.1:5050/index/index
router.get("/index",(req,res)=>{
    var sql="SELECT * FROM orange_index_product";
    pool.query(sql,(err,result)=>{
        // console.log(result)
        if(err) throw err;
        res.send({code:1,msg:"商品查询成功",data:result});
    })
})


module.exports=router;