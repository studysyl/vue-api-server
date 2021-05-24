var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));


//查询所有的受理事件getAllAccept
// module.exports.getAllAccept = function(params,cb){
//     条件
//     var conditions = {}
//     if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
//     if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
//     conditions["columns"] = {};
//     if(params.accept_id){
//         conditions["columns"]["accept_id"] = params.accept_id
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
//     if(params.accept_time){
//         conditions["columns"]["accept_time"] = params.accept_time
//     }
//     if(params.ps_college){
//         conditions["columns"]["ps_college"] = params.ps_college
//     }
//     if(params.open_status){
//         conditions["columns"]["open_status"] = params.open_status
//     }

//     dao.countByConditions("AcceptApplyModel",conditions,function(err,count){
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

//         dao.list('AcceptApplyModel',conditions,function(err,accept){
//             if(err) return cb(err)
//             var resultData = {}
//             resultData["total"] = count
//             resultData["pagenum"] = pagenum
//             resultData["accept"] = _.map(accept,function(accept){
//                 if(accept.open_status === 0){
//                     accept.open_status = false
//                 }else {
//                     accept.open_status = true
//                 }
//                 return accept
//             })
//             cb(err,resultData)
//         });
//     })
// }

//添加受理信息
module.exports.addAccept = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('AcceptApplyModel',{
        "accept_id": paramsBody.accept_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "apply_number": paramsBody.apply_number,
        "pt_name": paramsBody.pt_name,
        "accept_time": paramsBody.accept_time,
        "ps_college": paramsBody.ps_college,
        "open_status": paramsBody.open_status
    },function(err,accept){
        if(err) return cb(err);
        var result = {
            "accept_id": accept.accept_id,
            "pt_apply_id": accept.pt_apply_id,
            "apply_number": accept.apply_number,
            "pt_name": accept.pt_name,
            "accept_time": accept.accept_time,
            "ps_college": accept.ps_college,
            "open_status": accept.open_status
        };
        cb(null,result)
    });
    
}


//根据申请号或者学院找时间线
module.exports.getAccept = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }else {
        conditions["columns"]["apply_number"] = params.apply_number
    }
    dao.list('AcceptApplyModel',conditions,function(err,accept){
        if(err) return cb(err)
        var resultData = {}
        resultData["accept"] = _.map(accept,function(accept){
            return accept
        });
        cb(err,resultData)
    });
}



// 修改公开状态
module.exports.updateOpenState = function(id,state,cb){
    dao.show('AcceptApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('AcceptApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"open_status": state},function(err,accept){
            if(err) return cb("设置失败");
            cb(null,{
                "accept_id": accept.accept_id,
                "pt_apply_id": accept.pt_apply_id,
                "apply_number": accept.apply_number,
                "pt_name": accept.pt_name,
                "accept_time": accept.accept_time,
                "ps_college": accept.ps_college,
                "open_status": accept.open_status
            })
        })
    })
}



//删除受理
module.exports.delAcceptPatent = function(acceptId,cb){
    dao.destroy("AcceptApplyModel",acceptId,function(err){
        if(err) return cb(err)
        return cb(null)
    })
}


module.exports.getAllAccept = function(conditions,cb) {
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
        sql = "SELECT * FROM pt_accept";
    
        if(key) {
            sql += " WHERE apply_number LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,accept){
                var retaccept = [];
                for(idx in accept) {
                    var ac = accept[idx];
                    if(ac.open_status ===0){
                        ac.open_status = false
                    }else{
                        ac.open_status = true
                    }
                    retaccept.push({
                        "accept_id": ac.accept_id,
                        "pt_apply_id": ac.pt_apply_id,
                        "apply_number": ac.apply_number,
                        "pt_name": ac.pt_name,
                        "accept_time": ac.accept_time,
                        "ps_college": ac.ps_college,
                        "open_status": ac.open_status
                    });
                    console.log(ac)
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["accept"] = retaccept;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,accept){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["accept"] = _.map(accept,function(accept){
                    if(accept.open_status ===0){
                        accept.open_status = false
                    }else{
                        accept.open_status = true
                    }
                    return accept
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM pt_accept";
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
