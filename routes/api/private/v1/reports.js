var express = require('express');
var router = express.Router();
var path = require("path");


// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

// 通过验证模块获取用户管理服务
var reportsServ = authorization.getService("ReportsService");

router.get("/type/:typeid/:yearValue",
	// 参数验证
	function(req,res,next){
		if(!req.params.typeid) {
			return res.sendResult(null,400,"报表类型不能为空");
		}
		if(isNaN(parseInt(req.params.typeid))) return res.sendResult(null,400,"报表类型必须是数字");
		console.log(req.params)
		next();
	},
	// 业务逻辑
	function(req,res,next) {
		reportsServ.reports(req.params.typeid,req.params.yearValue,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取报表成功");
		})(req,res,next);
	}
);

router.get("/line/:collegeValue",
	// 参数验证
	function(req,res,next){
		next();
	},
	// 业务逻辑
	function(req,res,next) {
		reportsServ.line(req.params.collegeValue,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取报表成功");
		})(req,res,next);
	}
);

router.get("/monthline/:collegeValue",
	// 参数验证
	function(req,res,next){
		next();
	},
	// 业务逻辑
	function(req,res,next) {
		reportsServ.monthline(req.params.collegeValue,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取报表成功");
		})(req,res,next);
	}
);

module.exports = router;