var express = require('express')
var router = express.Router()
var path = require('path')

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

//通过验证模块获得专利证书管理
var applyServ = authorization.getService("ApplyPatentService")

// 申请列表
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
        conditions["ps_number"] = req.query.ps_number
        conditions["pt_username"] = req.query.pt_username
        conditions["ps_college"] = req.query.ps_college
        conditions["pt_type"] = req.query.pt_type
        conditions["pt_name"] = req.query.pt_name
        conditions["pt_goal"] = req.query.pt_goal
        conditions["pt_content"] = req.query.pt_content
        conditions["pt_compare"] = req.query.pt_compare
        conditions["pt_example"] = req.query.pt_example
        applyServ.getAllApplys(conditions,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200 ,"获取成功");
        })(req,res,next)
    }
)

//创建申请列表
router.post('/',
    //参数验证
    function(req,res,next){
        next()
    },
    function(req,res,next){
        var params = req.body;
        applyServ.createApply(params,function(err,newapply){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(newapply,201,"申请成功")
        })(req,res,next)
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
        applyServ.delApplyPatent(req.params.id,function(err){
            if(err) return res.sendResult(null, 400, err)
            return res.sendResult(null,200,'删除成功')
        })(req,res,next)
    }
)

//更新数据
router.put('/:id',
    //验证参数
    function(req,res,next){
        if(!req.params.id) return res.sendResult(null, 400, "申请id不能为空")
        if(isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "申请id非数字")
        next()
    },
    //业务逻辑
    function(req,res,next){
        applyServ.updateApply(req.params,req.body.params,function(err){
            if(err) return res.sendResult(null,400,err)
            return res.sendResult(null,200,'更新成功')
        })(req,res,next)
    }
)
router.get("/status",
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
            conditions["ps_number"] = req.query.ps_number
            conditions["pt_username"] = req.query.pt_username
            conditions["ps_college"] = req.query.ps_college
            conditions["pt_type"] = req.query.pt_type
            conditions["pt_name"] = req.query.pt_name
            conditions["pt_goal"] = req.query.pt_goal
            conditions["pt_content"] = req.query.pt_content
            conditions["pt_compare"] = req.query.pt_compare
            conditions["pt_example"] = req.query.pt_example
            conditions["review_status"] = req.query.review_status
            applyServ.NoReview(conditions,function(err,result){
                if(err) return res.sendResult(null, 400, err)
                res.sendResult(result, 200, "获取成功");
            })(req,res,next)
        }
)

// 添加审核意见
router.put('/review/:id',
    //验证参数
    function(req,res,next){
        if(!req.params.id) return res.sendResult(null, 400, "申请id不能为空")
        if(isNaN(parseInt(req.params.id))) return res.sendResult(null, 400, "申请id非数字")
        next()
    },
    //业务逻辑
    function(req,res,next){
        applyServ.addReviewInfo(req.params,req.body.params,function(err){
            if(err) return res.sendResult(null,400,err)
            return res.sendResult(null,200,'审核成功')
        })(req,res,next)
    }
)

// 查询法律信息
router.get('/legal',
    function(req,res,next){
        if(!req.query.pagenum || req.query.pagenum <= 0)return res.sendResult(null, 400, "pagenum 参数错误")
        if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误")
        next();
    },
    function(req,res,next){
        var condition = {
            "pagenum" : req.query.pagenum,
            "pagesize" : req.query.pagesize
        };
        condition["pt_apply_id"] = req.query.pt_apply_id
        applyServ.LegalList(condition,function(err,result){
            if(err) return res.sendResult(null, 400, err)
            res.sendResult(result, 200, "获取成功")
        })(req,res,next)
    }
)

//添加法律信息
router.post('/addlegal',
    function(req,res,next){
        next()
    },
    function(req,res,next){
        params = {
            "pt_apply_id": req.body.pt_apply_id,
            "legal_time": req.body.legal_time,
            "legal_status": req.body.legal_status,
            "legal_info": req.body.legal_info
        }
        applyServ.createLegal(params,function(err,legal){
            if(err) return res.sendResult(null,400,err)
            res.sendResult(legal,201,'添加成功')
        })(req,res,next)
    }
)
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
        applyServ.updateAccState(req.params.id,state,function(err,apply){
            if(err) return res.sendResult(null,400,err);
			res.sendResult(apply,200,"设置状态成功");
        })(req,res,next);
    }
)

module.exports = router;