var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));


//查询所有的驳回事件getAllreject
// module.exports.getAllreject = function(params,cb){
//     //条件
//     var conditions = {}
//     if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
//     if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
//     conditions["columns"] = {};
//     if(params.reject_id){
//         conditions["columns"]["reject_id"] = params.reject_id
//     }
//     if(params.pt_apply_id){
//         conditions["columns"]["pt_apply_id"] = params.pt_apply_id
//     }
//     if(params.apply_number){
//         conditions["columns"]["apply_number"] = params.apply_number
//     }
//     if(params.pt_name){
//         conditions["columns"]["pt_name"] = params.pt_name
//     }
//     if(params.reject_time){
//         conditions["columns"]["reject_time"] = params.reject_time
//     }
//     if(params.reject_info){
//         conditions["columns"]["reject_info"] = params.reject_info
//     }
//     if(params.ps_college){
//         conditions["columns"]["ps_college"] = params.ps_college
//     }
//     if(params.recheck_status){
//         conditions["columns"]["recheck_status"] = params.recheck_status
//     }
//     dao.countByConditions("RejectApplyModel",conditions,function(err,count){
//         if(err) cb(err)
//         pagenum = params.pagenum
//         pagesize = params.pagesize
//         pageCount = Math.ceil(count / pagesize)
//         offset = (pagenum - 1) * pagesize
//         if(offset >= count){
//             offset = count
//         }
//         limit = pagesize;

//         //构建条件
//         conditions["offset"] = offset;
//         conditions["limit"] = limit

//         dao.list('RejectApplyModel',conditions,function(err,reject){
//             if(err) return cb(err)
//             var resultData = {}
//             resultData["total"] = count
//             resultData["pagenum"] = pagenum
//             resultData["reject"] = _.map(reject,function(reject){

//                 if(reject.recheck_status === 0){
//                     reject.recheck_status = false
//                 }else {
//                     reject.recheck_status = true
//                 }
//                 return reject
//             })
//             cb(err,resultData)
//         });
//     })
// }

//添加驳回信息
module.exports.addreject = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('RejectApplyModel',{
        "reject_id": paramsBody.reject_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "apply_number": paramsBody.apply_number,
        "pt_name": paramsBody.pt_name,
        "reject_info": paramsBody.reject_info,
        "reject_time": paramsBody.reject_time,
        "ps_college": paramsBody.ps_college,
        "recheck_status": paramsBody.recheck_status
    },function(err,reject){
        if(err) return cb(err);
        var result = {
            "reject_id": reject.reject_id,
            "pt_apply_id": reject.pt_apply_id,
            "apply_number": reject.apply_number,
            "pt_name": reject.pt_name,
            "reject_info": paramsBody.reject_info,
            "reject_time": reject.reject_time,
            "ps_college": reject.ps_college,
            "recheck_status": reject.recheck_status
        };
        cb(null,result)
    });
    
}


//根据申请号或者学院找公开信息
module.exports.getreject = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }else {
        conditions["columns"]["apply_number"] = params.apply_number
    }
    dao.list('RejectApplyModel',conditions,function(err,reject){
        if(err) return cb(err)
        var resultData = {}
        resultData["reject"] = _.map(reject,function(reject){
            return reject
        });
        cb(err,resultData)
    });
}


// 修改复审状态
module.exports.updateTransferState = function(id,state,cb){
    dao.show('RejectApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('RejectApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"recheck_status": state},function(err,reject){
            if(err) return cb("设置失败");
            cb(null,{
                "reject_id": reject.reject_id,
                "pt_apply_id": reject.pt_apply_id,
                "apply_number": reject.apply_number,
                "pt_name": reject.pt_name,
                "reject_info": paramsBody.reject_info,
                "reject_time": reject.reject_time,
                "ps_college": reject.ps_college,
                "recheck_status": reject.recheck_status
            })
        })
    })
}



module.exports.getAllreject = function(conditions,cb) {
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
        sql = "SELECT * FROM pt_reject";
    
        if(key) {
            sql += " WHERE apply_number LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,reject){
                var retreject = [];
                for(idx in reject) {
                    var ga = reject[idx];
                    if(ga.recheck_status ===0){
                        ga.recheck_status = false
                    }else{
                        ga.recheck_status = true
                    }
                    retreject.push({
                        "reject_id": ga.reject_id,
                        "pt_apply_id": ga.pt_apply_id,
                        "apply_number": ga.apply_number,
                        "pt_name": ga.pt_name,
                        "reject_info": ga.reject_info,
                        "reject_time": ga.reject_time,
                        "ps_college": ga.ps_college,
                        "recheck_status": ga.recheck_status
                    });
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["reject"] = retreject;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,reject){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["reject"] = _.map(reject,function(reject){
                    if(reject.recheck_status ===0){
                        reject.recheck_status = false
                    }else{
                        reject.recheck_status = true
                    }
                    return reject
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM pt_reject";
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