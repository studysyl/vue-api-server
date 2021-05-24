var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

//通过验证模块获得专利证书管理
var certServ = authorization.getService("CertificateService")

//证书列表
router.get("/",
    //参数验证
    function(req,res,next){
        //参数验证
        if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null, 400, "pagenum 参数错误");
        if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null, 400, "pagesize 参数错误");
        next();
    },
    //业务逻辑
    // function(req,res,next){
    //     var conditions = {
    //         "pagenum": req.query.pagenum,
    //         "pagesize": req.query.pagesize
    //     };

    //     if(req.query.pate_string){
    //         conditions["pate_string"] = req.query.pate_string;
    //     }
    //     if(req.query.inven_name){
    //         conditions["inven_name"] = req.query.inven_name;
    //     }
    //     if(req.query.apply_date){
    //         conditions["apply_date"] = req.query.apply_date;
    //     }
    //     if(req.query.post_string){
    //         conditions["post_string"] = req.query.post_string;
    //     }
    //     if(req.query.cert_name){
    //         conditions["cert_name"] = req.query.cert_name;
    //     }
    //     if(req.query.post_date){
    //         conditions["post_date"] = req.query.post_date;
    //     }
    //     if(req.query.accept_date){
    //         conditions["accept_date"] = req.query.accept_date;
    //     }
    //     if(req.query.accept_number){
    //         conditions["accept_number"] = req.query.accept_number;
    //     }
    //     if(req.query.pate_name){
    //         conditions["pate_name"] = req.query.pate_name;
    //     }

    //     certServ.getAllCerts(
    //         conditions,
    //         function(err,result){
    //             if(err) return res.sendResult(null,400,err);
    //             res.sendResult(result,200,"获取成功");
    //         }
    //     )(req,res,next);
    // }
    function(req,res,next) {
		certServ.getAllCerts(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取证书列表成功");
			}
		)(req,res,next);
	}
);


router.post('/',
    //参数验证
    function(req,res,next){
       next();
    },
    //业务逻辑
    function(req,res,next){
        var params = req.body;
        certServ.createCert(params,function(err,newCert){
            if(err) return res.sendResult(null,400,err);
            res.sendResult(newCert,201,"创建证书成功");
        })(req,res,next)
    }
);


//删除
router.delete('/:id',
        // 验证参数
    function(req,res,next){
        if(!req.params.id) return res.sendResult(null,400,"证书id不能为空");
        if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,'证书ID必须为数字')
        next()
    },
    //业务逻辑
    function(req,res,next){
        certServ.deleteCert(req.params.id,function(err){
            if(err) return res.sendResult(null,400,err)
            return res.sendResult(null,200,'删除成功')
        })(req,res,next)
    }
)


//更新数据
router.put('/:id',
    function(req,res,next){
        if(!req.params.id) return res.sendResult(null,400,'证书id不能为空')
        if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,'证书ID必须是数字')
        next()
    },
    function(req,res,next){
        certServ.updateCert(req.params,req.body.params,function(err){
            if(err) return res.sendResult(null,400,err)
            return res.sendResult(null,200,'更新成功')
        })(req,res,next)
    }
)


module.exports = router;