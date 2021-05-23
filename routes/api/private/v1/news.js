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

// 查询用户列表
router.get("/new",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		newsServ.getAllNews(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取新闻列表成功");
			}
		)(req,res,next);
		
	}
);
router.put("/:id/state/:state",
    function(req,res,next){
        if(!req.params.id) {
			return res.sendResult(null,400,"申请id不能为空");
		}
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"申请id必须是数字");

		next();
    },
    function(req,res,next){
        state = 0
        if(req.params.state && req.params.state == 'true') 
        state = 1
        newsServ.updateNewsState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"审核通过");
        })(req,res,next);
    }
)


module.exports = router;