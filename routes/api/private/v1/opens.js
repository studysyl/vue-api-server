var express = require('express')
var router = express.Router()
var path = require('path')

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var openServ = authorization.getService('OpenApplyService')

// 公开列表
router.get('/',
    //参数验证
    function(req,res,next){
        if(!req.query.pagenum || req.query.pagenum <= 0)return res.sendResult(null, 400, "pagenum 参数错误")
        if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误")
        next();
    },
    //业务逻辑
    function(req,res,next){
        var conditions = {
            "pagenum" : req.query.pagenum,
            "pagesize" : req.query.pagesize
        };
        conditions["open_id"] = req.query.open_id
        conditions["pt_apply_id"] = req.query.pt_apply_id
        conditions["pt_name"] = req.query.pt_name
        conditions["open_time"] = req.query.open_time
        conditions["ps_college"] = req.query.ps_college
        conditions["pt_type"] = req.query.pt_type
        conditions["actual_status"] = req.query.actual_status
        openServ.getAllopen(conditions,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)


//创建公开阶段
router.post('/',
    //参数验证
    function(req,res,next){
        next();
    },
    function(req,res,next){
        var params = req.body;
        openServ.addOpen(params,function(err,newOpen){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(newOpen,201,"受理成功")
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
        openServ.getopen(params,function(err,newAccept){
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
        openServ.updateActualState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)


module.exports = router;