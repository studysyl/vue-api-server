var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var studentServ = authorization.getService("StudentService")

//根据mg_id找出信息
router.post("/",
    function(req,res,next){
        next()
    },
    function(req,res,next){
        var conditon = {}; 
        conditon["mg_id"] = req.body.mg_id;
        studentServ.getStudent(conditon,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200, "获取成功")
        })(req,res,next);
    }
);

// 添加信息
router.put('/',
        //参数验证
        function(req,res,next){
            next()
        },
        function(req,res,next){
            var params = req.body;
            studentServ.addStudent(params,function(err,result){
                if(err) return res.sendResult(null, 400, err)
                res.sendResult(result, 201 ,"添加成功")
            })(req,res,next);
        }
);


module.exports = router