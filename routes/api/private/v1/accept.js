var express = require('express')
var router = express.Router()
var path = require('path')

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var acceptServ = authorization.getService('AcceptApplyService')

// 受理列表
router.get('/',
    //参数验证
    function(req,res,next){
        if(!req.query.pagenum || req.query.pagenum <= 0)return res.sendResult(null, 400, "pagenum 参数错误")
        if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误")
        next();
    },
    //业务逻辑
    // function(req,res,next){
    //     var conditions = {
    //         "pagenum" : req.query.pagenum,
    //         "pagesize" : req.query.pagesize
    //     };
    //     conditions["accept_id"] = req.query.accept_id
    //     conditions["pt_apply_id"] = req.query.pt_apply_id
    //     conditions["pt_name"] = req.query.pt_name
    //     conditions["accept_time"] = req.query.accept_time
    //     conditions["ps_college"] = req.query.ps_college
    //     conditions["open_status"] = req.query.open_status
    //     acceptServ.getAllAccept(conditions,function(err,result){
    //         if(err) return res.sendResult(null, 400, err)
    //         res.sendResult(result, 200 ,"获取成功");
    //     })(req,res,next)
    // }
    function(req,res,next) {
		acceptServ.getAllAccept(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取受理列表成功");
			}
		)(req,res,next);
	}
)


//创建受理列表
router.put('/',
    //参数验证
    function(req,res,next){
        next()
    },
    function(req,res,next){
        var params = req.body;
        acceptServ.addAccept(params,function(err,newAccept){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(newAccept,201,"受理成功")
        })(req,res,next)
    }
)

router.put('/select',
    function(req,res,next){
        if(req.body) return res.sendResult(null,404,"获取参数不能为空")
        next()
    },
    function(req,res,next){
        var params = req.body
        acceptServ.getAccept(params,function(err,newAccept){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)

//修改公开状态
//修改状态
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
        acceptServ.updateOpenState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)

//删除数据
router.delete('/:id',
    //验证参数
    function(req,res,next){
        if(!req.params.id) return res.sendResult(null, 400, "申请id不能为空")
        if(isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "申请id非数字")
        next()
    },
    function(req,res,next){
        acceptServ.delAcceptPatent(req.params.id,function(err){
            if(err) return res.sendResult(null, 400, err)
            return res.sendResult(null,200,'删除成功')
        })(req,res,next)
    }
)


module.exports = router;