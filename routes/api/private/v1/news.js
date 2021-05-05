var express = require('express')
var router = express.Router()
var path = require('path')
// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var newsServ = authorization.getService('NewsService')

//列表
router.get('/',
    //参数验证
    function(req,res,next){
        next();
    },
    //业务逻辑
    function(req,res,next){
        newsServ.getAllNews(req.params,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)
//创建新闻列表
router.post('/',
    //参数验证
    function(req,res,next){
        next()
    },
    function(req,res,next){
        var params = req.body;
        newsServ.createNews(params,function(err,newapply){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(newapply,201,"创建成功")
        })(req,res,next)
    }
)

// 删除新闻
router.delete('/:id',
    function(req,res,next){
        next()
    },
    function(req,res,next){
        newsServ.delNews(req.params.id,function(err,news){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(news, 200, "删除成功")
        })(req,res,next)
    }
)
module.exports = router;