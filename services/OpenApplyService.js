var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));


//查询所有的公开事件getAllOpen
// module.exports.getAllopen = function(params,cb){
//     //条件
//     var conditions = {}
//     if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
//     if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
//     conditions["columns"] = {};
//     if(params.open_id){
//         conditions["columns"]["open_id"] = params.open_id
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
//     if(params.pt_type){
//         conditions["columns"]["pt_type"] = params.pt_type
//     }
//     if(params.open_time){
//         conditions["columns"]["open_time"] = params.open_time
//     }
//     if(params.ps_college){
//         conditions["columns"]["ps_college"] = params.ps_college
//     }
//     if(params.actual_status){
//         conditions["columns"]["actual_status"] = params.actual_status
//     }

//     dao.countByConditions("OpenApplyModel",conditions,function(err,count){
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

//         dao.list('OpenApplyModel',conditions,function(err,open){
//             if(err) return cb(err)
//             var resultData = {}
//             resultData["total"] = count
//             resultData["pagenum"] = pagenum
//             resultData["open"] = _.map(open,function(open){
//                 if(open.actual_status === 0){
//                     open.actual_status = false
//                 }else {
//                     open.actual_status = true
//                 }
//                 return open
//             })
//             cb(err,resultData)
//         });
//     })
// }

//添加公开信息
module.exports.addOpen = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('OpenApplyModel',{
        "open_id": paramsBody.open_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "apply_number": paramsBody.apply_number,
        "pt_name": paramsBody.pt_name,
        "pt_type": paramsBody.pt_type,
        "open_time": paramsBody.open_time,
        "ps_college": paramsBody.ps_college,
        "actual_status": paramsBody.actual_status
    },function(err,open){
        if(err) return cb(err);
        var result = {
            "open_id": open.open_id,
            "pt_apply_id": open.pt_apply_id,
            "apply_number": open.apply_number,
            "pt_type": open.pt_type,
            "pt_name": open.pt_name,
            "open_time": open.open_time,
            "ps_college": open.ps_college,
            "actual_status": open.actual_status
        };
        cb(null,result)
    });
    
}


//根据申请号或者学院找公开信息
module.exports.getopen = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }else {
        conditions["columns"]["apply_number"] = params.apply_number
    }
    dao.list('OpenApplyModel',conditions,function(err,open){
        if(err) return cb(err)
        var resultData = {}
        resultData["open"] = _.map(open,function(open){
            return open
        });
        cb(err,resultData)
    });
}

// 修改实审状态
module.exports.updateActualState = function(id,state,cb){
    dao.show('OpenApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('OpenApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"actual_status": state},function(err,accept){
            if(err) return cb("设置失败");
            cb(null,{
                "open_id": accept.open_id,
                "pt_apply_id": accept.pt_apply_id,
                "apply_number": accept.apply_number,
                "pt_type": accept.pt_type,
                "pt_name": accept.pt_name,
                "open_time": accept.open_time,
                "ps_college": accept.ps_college,
                "actual_status": accept.actual_status
            })
        })
    })
}




module.exports.getAllopen = function(conditions,cb) {
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
        sql = "SELECT * FROM pt_open";
    
        if(key) {
            sql += " WHERE apply_number LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,open){
                var retopen = [];
                for(idx in open) {
                    var op = open[idx];
                    if(op.actual_status ===0){
                        op.actual_status = false
                    }else{
                        op.actual_status = true
                    }
                    retopen.push({
                        "open_id": op.open_id,
                        "pt_apply_id": op.pt_apply_id,
                        "apply_number": op.apply_number,
                        "pt_type": op.pt_type,
                        "pt_name": op.pt_name,
                        "open_time": op.open_time,
                        "ps_college": op.ps_college,
                        "actual_status": op.actual_status
                    });
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["open"] = retopen;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,open){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["open"] = _.map(open,function(open){
                    if(open.actual_status ===0){
                        open.actual_status = false
                    }else{
                        open.actual_status = true
                    }
                    return open
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM pt_open";
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