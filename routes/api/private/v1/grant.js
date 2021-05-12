var express = require('express')
var router = express.Router()
var path = require('path')

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

var grantServ = authorization.getService('GrantApplyService')

// 授权列表
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
        conditions["grant_id"] = req.query.grant_id
        conditions["pt_apply_id"] = req.query.pt_apply_id
        conditions["pate_string"] = req.query.pate_string
        conditions["pt_username"] = req.query.pt_username
        conditions["pt_name"] = req.query.pt_name
        conditions["grant_time"] = req.query.grant_time
        conditions["ps_college"] = req.query.ps_college
        conditions["transfer_status"] = req.query.transfer_status
        grantServ.getAllgrant(conditions,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
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
        grantServ.addgrant(params,function(err,newOpen){
            if(err)
            return res.sendResult(null, 400, err)
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
        grantServ.getgrant(params,function(err,newAccept){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)

//修改转移状态
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
        grantServ.updateTransferState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)

module.exports = router;