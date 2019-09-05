const express=require("express")
const router=express.Router();
const pool=require("../pool")

// app.use("/details",Details)
// 客户端请求时:
// http://127.0.0.1:5050/details?lid=1
router.get("/details",(req,res)=>{
  var lid=req.query.lid;
  var output={
    product:{},
    specs:[],
    pics:[]
  }
  if(lid!==undefined){
    var sql1=`select * from orange_details where lid=?`;
    pool.query(sql1,[lid],(err,result)=>{
        if(err) console.log(err);
        output.product=result[0];
        console.log(output);
        var sql2=`select * from orange_details_pic where laptop_id=?`
        pool.query(sql2,[lid],(err,result)=>{
            if(err) console.log(err);
            output.pics=result;
            console.log(output);
            res.send(output);
        })
    })
  }else{
    res.send(output);
  }
})

module.exports=router;