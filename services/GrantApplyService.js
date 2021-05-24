var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));


//查询所有的授权事件getAllgrant
// module.exports.getAllgrant = function(params,cb){
//     //条件
//     var conditions = {}
//     if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
//     if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
//     conditions["columns"] = {};
//     if(params.grant_id){
//         conditions["columns"]["grant_id"] = params.grant_id
//     }
//     if(params.pt_apply_id){
//         conditions["columns"]["pt_apply_id"] = params.pt_apply_id
//     }
//     if(params.pate_string){
//         conditions["columns"]["pate_string"] = params.pate_string
//     }
//     if(params.pt_username){
//         conditions["columns"]["pt_username"] = params.pt_username
//     }
//     if(params.pt_name){
//         conditions["columns"]["pt_name"] = params.pt_name
//     }
//     if(params.grant_time){
//         conditions["columns"]["grant_time"] = params.grant_time
//     }
//     if(params.ps_college){
//         conditions["columns"]["ps_college"] = params.ps_college
//     }
//     if(params.transfer_status){
//         conditions["columns"]["transfer_status"] = params.transfer_status
//     }
//     dao.countByConditions("GrantApplyModel",conditions,function(err,count){
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

//         dao.list('GrantApplyModel',conditions,function(err,grant){
//             if(err) return cb(err)
//             var resultData = {}
//             resultData["total"] = count
//             resultData["pagenum"] = pagenum
//             resultData["grant"] = _.map(grant,function(grant){

//                 if(grant.transfer_status === 0){
//                     grant.transfer_status = false
//                 }else {
//                     grant.transfer_status = true
//                 }
//                 return grant
//             })
//             cb(err,resultData)
//         });
//     })
// }

//添加授权信息
module.exports.addgrant = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('GrantApplyModel',{
        "grant_id": paramsBody.grant_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "pate_string": paramsBody.pate_string,
        "pt_username": paramsBody.pt_username,
        "pt_name": paramsBody.pt_name,
        "grant_time": paramsBody.grant_time,
        "ps_college": paramsBody.ps_college,
        "transfer_status": paramsBody.transfer_status
    },function(err,grant){
        if(err) return cb(err);
        var result = {
            "grant_id": grant.grant_id,
            "pt_apply_id": grant.pt_apply_id,
            "pate_string": grant.pate_string,
            "pt_username": grant.pt_username,
            "pt_name": grant.pt_name,
            "grant_time": grant.grant_time,
            "ps_college": grant.ps_college,
            "transfer_status": grant.transfer_status
        };
        cb(null,result)
    });
    
}


//根据申请号或者学院找公开信息
module.exports.getgrant = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    if(params.ps_college){
        conditions["columns"]["ps_college"] = params.ps_college
    }else {
        conditions["columns"]["pate_string"] = params.pate_string
    }
    dao.list('GrantApplyModel',conditions,function(err,grant){
        if(err) return cb(err)
        var resultData = {}
        resultData["grant"] = _.map(grant,function(grant){
            return grant
        });
        cb(err,resultData)
    });
}


// 修改转移状态
module.exports.updateTransferState = function(id,state,cb){
    dao.show('GrantApplyModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('GrantApplyModel', id, {"pt_apply_id": apply.pt_apply_id,"transfer_status": state},function(err,grant){
            if(err) return cb("设置失败");
            cb(null,{
                "grant_id": grant.grant_id,
                "pt_apply_id": grant.pt_apply_id,
                "pate_string": grant.pate_string,
                "pt_username": grant.pt_username,
                "pt_name": grant.pt_name,
                "grant_time": grant.grant_time,
                "ps_college": grant.ps_college,
                "transfer_status": grant.transfer_status
            })
        })
    })
}

//删除授权信息
module.exports.deleteGrant = function(applyId,cb){
    dao.destroy("GrantApplyModel",applyId,function(err){
        if(err) return cb(err)
        return cb(null)
    })
}



module.exports.getAllgrant = function(conditions,cb) {
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
        sql = "SELECT * FROM pt_grant";
    
        if(key) {
            sql += " WHERE pate_string LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,grant){
                var retgrant = [];
                for(idx in grant) {
                    var ga = grant[idx];
                    if(ga.transfer_status ===0){
                        ga.transfer_status = false
                    }else{
                        ga.transfer_status = true
                    }
                    retgrant.push({
                        "grant_id": ga.grant_id,
                        "pt_apply_id": ga.pt_apply_id,
                        "pate_string": ga.pate_string,
                        "pt_username": ga.pt_username,
                        "pt_name": ga.pt_name,
                        "grant_time": ga.grant_time,
                        "ps_college": ga.ps_college,
                        "transfer_status": ga.transfer_status
                    });
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["grant"] = retgrant;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,grant){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["grant"] = _.map(grant,function(grant){
                    if(grant.transfer_status ===0){
                        grant.transfer_status = false
                    }else{
                        grant.transfer_status = true
                    }
                    return grant
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM pt_grant";
	if(key) {
		sql += " WHERE pate_string LIKE ?";
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