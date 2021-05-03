var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var timeServ = authorization.getService("TimeLineService")

//根据mg_id和apply_id查找时间事件
router.post("/",
    function(req,res,next){
        next()
    },
    function(req,res,next){
        var conditon = {}; 
        conditon["mg_id"] = req.body.params.mg_id;
        conditon["pt_apply_id"] = req.body.params.pt_apply_id;
        timeServ.getTime(conditon,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200, "获取成功")
        })(req,res,next);
    }
);

// 添加事件
router.put('/',
        //参数验证
        function(req,res,next){
            next()
        },
        function(req,res,next){
            var params = req.body;
            timeServ.addTimeLine(params,function(err,newTime){
                if(err) return res.sendResult(null, 400, err)
                res.sendResult(newTime, 201 ,"添加成功")
            })(req,res,next);
        }
);

//查找全部事件
router.get('/',
        function(req,res,next){
            next();
        },
        function(req,res,next){
            timeServ.getAllTime(req.params,function(err,newTime){
                if(err) return res.sendResult(null, 400, err)
                res.sendResult(newTime, 201, "查询成功")
            })(req,res,next);
        }
);

module.exports = router