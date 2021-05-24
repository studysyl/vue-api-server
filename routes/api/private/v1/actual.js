var express = require('express')
var router = express.Router()
var path = require('path')

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var actualServ = authorization.getService('ActualApplyService')

// 授权列表
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
    //     conditions["actual_id"] = req.query.actual_id
    //     conditions["pt_apply_id"] = req.query.pt_apply_id
    //     conditions["apply_number"] = req.query.apply_number
    //     conditions["pt_name"] = req.query.pt_name
    //     conditions["actual_time"] = req.query.actual_time
    //     conditions["ps_college"] = req.query.ps_college
    //     conditions["reject_status"] = req.query.reject_status
    //     conditions["grant_status"] = req.query.grant_status
    //     actualServ.getAllactual(conditions,function(err,result){
    //         if(err) return res.sendResult(null, 400, err)
    //         res.sendResult(result, 200 ,"获取成功");
    //     })(req,res,next)
    // }
    function(req,res,next) {
		actualServ.getAllactual(
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


//创建授权阶段
router.post('/',
    //参数验证
    function(req,res,next){
        // if(!req.body.pt_apply_id) return res.sendResult(null,400,"申请id为空")
        next();
    },
    function(req,res,next){
        var params = req.body;
        actualServ.addactual(params,function(err,newOpen){
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
        actualServ.getactual(params,function(err,newAccept){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)
//修改驳回状态

router.put("/:id/rejectState/:state",
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
        actualServ.updateRejectState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)

//修改授权状态
router.put("/:id/grantState/:state",
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
        actualServ.updateGrantState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)
module.exports = router;