var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));


//查询所有的实审事件getAllactual
module.exports.getAllactual = function(params,cb){
    //条件
    var conditions = {}
    if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
    if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
    conditions["columns"] = {};
    if(params.actual_id){
        conditions["columns"]["actual_id"] = params.actual_id
    }
    if(params.pt_apply_id){
        conditions["columns"]["pt_apply_id"] = params.pt_apply_id
    }
    if(params.apply_number){
        conditions["columns"]["apply_number"] = params.apply_number
    }
    if(params.pt_name){
        conditions["columns"]["pt_name"] = params.pt_name
    }
    if(params.actual_time){
        conditions["columns"]["actual_time"] = params.actual_time
    }
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }
    if(params.reject_status){
        conditions["columns"]["reject_status"] = params.reject_status
    }
    if(params.grant_status){
        conditions["columns"]["grant_status"] = params.grant_status
    }

    dao.countByConditions("ActualApplyModel",conditions,function(err,count){
        if(err) cb(err)
        pagenum = params.pagenum
        pagesize = params.pagesize
        pageCount = Math.ceil(count / pagesize)
        offset = (pagenum - 1) * pagesize
        if(offset >= count){
            offset = count
        }
        limit = pagesize;

        //构建条件
        conditions["offset"] = offset;
        conditions["limit"] = limit

        dao.list('ActualApplyModel',conditions,function(err,actual){
            if(err) return cb(err)
            var resultData = {}
            resultData["total"] = count
            resultData["pagenum"] = pagenum
            resultData["actual"] = _.map(actual,function(actual){

                if(actual.reject_status === 0){
                    actual.reject_status = false
                }else {
                    actual.reject_status = true
                }
                if(actual.grant_status === 0){
                    actual.grant_status = false
                }else {
                    actual.grant_status = true
                }
                return actual
            })
            cb(err,resultData)
        });
    })
}

//添加实审信息
module.exports.addactual = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('ActualApplyModel',{
        "actual_id": paramsBody.actual_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "apply_number": paramsBody.apply_number,
        "pt_name": paramsBody.pt_name,
        "actual_time": paramsBody.actual_time,
        "ps_college": paramsBody.ps_college,
        "reject_status": paramsBody.reject_status,
        "grant_status": paramsBody.grant_status
    },function(err,actual){
        if(err) return cb(err);
        var result = {
            "actual_id": actual.actual_id,
            "pt_apply_id": actual.pt_apply_id,
            "apply_number": actual.apply_number,
            "pt_name": actual.pt_name,
            "actual_time": actual.actual_time,
            "ps_college": actual.ps_college,
            "reject_status": actual.reject_status,
            "grant_status": actual.grant_status
        };
        cb(null,result)
    });
    
}


//根据申请号或者学院找公开信息
module.exports.getactual = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }else {
        conditions["columns"]["apply_number"] = params.apply_number
    }
    dao.list('ActualApplyModel',conditions,function(err,actual){
        if(err) return cb(err)
        var resultData = {}
        resultData["actual"] = _.map(actual,function(actual){
            return actual
        });
        cb(err,resultData)
    });
}


// 修改驳回状态
module.exports.updateRejectState = function(id,state,cb){
    dao.show('ActualApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('ActualApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"reject_status": state},function(err,actual){
            if(err) return cb("设置失败");
            cb(null,{
                "actual_id": actual.actual_id,
                "pt_apply_id": actual.pt_apply_id,
                "apply_number": actual.apply_number,
                "pt_name": actual.pt_name,
                "actual_time": actual.actual_time,
                "ps_college": actual.ps_college,
                "reject_status": actual.reject_status,
                "grant_status": actual.grant_status
            })
        })
    })
}

// 修改实审状态
module.exports.updateGrantState = function(id,state,cb){
    dao.show('ActualApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('ActualApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"grant_status": state},function(err,actual){
            if(err) return cb("设置失败");
            cb(null,{
                "actual_id": actual.actual_id,
                "pt_apply_id": actual.pt_apply_id,
                "apply_number": actual.apply_number,
                "pt_name": actual.pt_name,
                "actual_time": actual.actual_time,
                "ps_college": actual.ps_college,
                "reject_status": actual.reject_status,
                "grant_status": actual.grant_status
            })
        })
    })
}


module.exports.getAllactual = function(conditions,cb) {
	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	// 通过关键词获取管理员数量
	countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;
        db = databaseModule.getDatabase();
        sql = "SELECT * FROM actual_examination";
    
        if(key) {
            sql += " WHERE apply_number LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,actual){
                var retactual = [];
                for(idx in actual) {
                    var ac = actual[idx];
                    if(ac.reject_status === 0){
                        ac.reject_status = false
                    }else {
                        ac.reject_status = true
                    }
                    if(ac.grant_status === 0){
                        ac.grant_status = false
                    }else {
                        ac.grant_status = true
                    }
                    retactual.push({
                        "actual_id": ac.actual_id,
                        "pt_apply_id": ac.pt_apply_id,
                        "apply_number": ac.apply_number,
                        "pt_name": ac.pt_name,
                        "actual_time": ac.actual_time,
                        "ps_college": ac.ps_college,
                        "reject_status": ac.reject_status,
                        "grant_status": ac.grant_status
                    });
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["actual"] = retactual;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,actual){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["actual"] = _.map(actual,function(actual){
                    if(actual.reject_status === 0){
                        actual.reject_status = false
                    }else {
                        actual.reject_status = true
                    }
                    if(actual.grant_status === 0){
                        actual.grant_status = false
                    }else {
                        actual.grant_status = true
                    }
                    return actual
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM actual_examination";
	if(key) {
		sql += " WHERE apply_number LIKE ?";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
}
