var _ = require('lodash');
var path = require("path");
var orm = require("orm");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var moment = require("moment")
var Promise = require("bluebird");
var uniqid = require("uniqid");
const CertModel = require('../models/CertModel');
databaseModule = require(path.join(process.cwd(),"modules/database"));


function doCheckCertParams(params){
    return new Promise(function(resolve,reject){
        var info = {};
        // if(params.cert_id) info.cert_id = params.cert_id;    //证书id
        // if(isNaN(parseInt(params.cert_id))) return reject("证书ID不能为空")
        if(!params.cert_id){
            if(!params.pate_string) return reject("专利号不能为空") 
        }

        if(params.pate_string) info.pate_string = params.pate_string   //专利号
        if(params.inven_name) info.inven_name = params.inven_name     //发明创造名称   
        
        if(params.apply_date){        //申请日
            info.apply_date = params.apply_date;  
        }else{
            info.apply_date = '2021-2-13';
        }

        if(params.post_string){      //发文序列号
            info.post_string = params.post_string;
        }else{
            info.post_string = "00000000";
        }
        
        if(params.cert_name){        //证书名称
            info.cert_name = params.cert_name;
        }else{
            return reject("证书名称不能为空")
        }
        
        if(params.post_date){        //发文日
            info.post_date = params.post_date;
        }else{
            info.post_date = '2021-2-13';
        }
        
        if(params.accept_date){     //授权公告日
            info.accept_date = params.accept_date;
        }else{
            info.accept_date = '2021-2-13';
        }
        
        if(params.accept_number){     //授权号
            info.accept_number = params.accept_number;
        }else{
            info.accept_number = "";
        }
        
        if(params.pate_name){        //专利权人
            info.pate_name = params.pate_name;
        }else{
            info.pate_name = "";
        }

        resolve(info);
    });
}

function doCreateCert(info){
    return new Promise(function(resolve,reject){
        dao.create("CertModel",_.clone(info),function(err,newCert){
            if(err) {
                console.log(err)
                return reject(err);
            }
            info.cert = newCert;
            resolve(info);
        });
    });
}

function checkCertPate(info){
    return new Promise(function(resolve,reject){
        dao.findOne("CertModel",{"pate_string": info.pate_string},function(err,cert){
            if(err||cert) return reject(err);
            if(cert.pate_string == info.pate_string) return resolve(info);
            return reject("专利证书已存在")
        })
    })
}

function doGetCert(info){
    return new Promise(function(resolve,reject){
        dao.show("CertModel",info.cert_id,function(err,newCert){
            if(err) return reject("获取证书信息失败");
            if(!newCert) return reject("证书信息不存在");
            info.cert = newCert;
            resolve(info)
        })
    })
}

function doUpdateCert(info){
    return new Promise(function(resolve,reject){
        dao.update("CertModel",info.cert_id,_.clone(info),function(err,newCert){
            if(err) return reject("更新失败");
            info.cert = newCert;
        });
    });

}
//判断是否存在证书
function exists(pateString,cb){
    var db = databaseModule.getDatabase()
    var Model = db.models.CertModel
    Model.exists({"pate_string":pateString},function(err,isExists){
        if(err) return cb(err)
        cb(null,isExists)
    })
}

module.exports.createCert = function(params,cb){
    exists(params.pate_string,function(err,isExists){
        if(err) return cb(err)
        if(isExists) return cb('证书已存在')
        doCheckCertParams(params)
        .then(doCreateCert)
        .then(function(info){
            cb(null,info.cert);
        })
        .catch(function(err){
            cb(err);
        });
    })
}

// module.exports.getAllCerts = function(params,cb){
//     // 条件
//     var conditions = {};
//     if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误");
//     if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误");
//     conditions["columns"] = {};
//     if(params.cert_id){
//         conditions["columns"]["cert_id"] = params.cert_id;
//     }

//     if(params.pate_string){
//         conditions["columns"]["pate_string"] = params.pate_string;
//     }
//     if(params.inven_name){
//         conditions["columns"]["inven_name"] = params.inven_name
//     }
//     if(params.apply_date){
//         conditions["columns"]["apply_date"] = params.apply_date
//     }
//     if(params.post_string){
//         conditions["columns"]["post_string"] = params.post_string
//     }
//     if(params.cert_name){
//         conditions["columns"]["cert_name"] = params.cert_name
//     }
//     if(params.post_date){
//         conditions["columns"]["post_date"] = params.post_date
//     }
//     if(params.accept_date){
//         conditions["columns"]["accept_date"] = params.accept_date
//     }
//     if(params.accept_number){
//         conditions["columns"]["accept_number"] = params.accept_number
//     }
//     if(params.pate_name){
//         conditions["columns"]["pate_name"] = params.pate_name
//     }
//     dao.countByConditions("CertModel",conditions,function(err,count){
//         if(err) return cb(err);
//         pagesize = params.pagesize;
//         pagenum = params.pagenum;
//         pageCount = Math.ceil(count / pagesize);
//         offset = (pagenum - 1) * pagesize;
//         if(offset >= count){
//             offset = count;
//         }
//         limit = pagesize;

//         //构建条件
//         conditions["offset"] = offset;
//         conditions["limit"] = limit;
//         //这里没写

//         dao.list("CertModel",conditions,function(err,certs){
//             if(err) return cb(err);
//             var resultData = {};
//             resultData["total"] = count;
//             resultData["pagenum"] = pagenum;
//             resultData["certs"] = _.map(certs,function(cert){
//                 return cert;
//             })
//             cb(err,resultData);
//         })
//     });
// }


//根据id查找证书
module.exports.getCert = function(certId,cb){
    if(!certId) return cb("证书id不能为空");
    if(isNaN(parseInt(certId))) return cb("证书id必须为数字")
    doGetCert({"cert_id":certId})
    .then(function(info){
        cb(null,info.cert);
    })
    .catch(function(err){
        cb(err);
    });
}


// 删除
module.exports.deleteCert = function(certId,cb){
    if(!certId) return cb('证书id不能为空')
    dao.destroy('CertModel', certId, function(err){
            if(err) return cb(err)
            return cb(null)
        }
    )
}

// 更新数据
module.exports.updateCert = function(params,paramsBody,cb){
    if(!params) return cb("参数不能为空");
	if(!params.id) return cb("证书ID不能为空");
	if(isNaN(parseInt(params.id))) return cb("证书ID必须为数字");
    updateInfo = {}
    updateInfo["pate_string"] = paramsBody.pate_string
    updateInfo["inven_name"] = paramsBody.inven_name
    updateInfo["apply_date"] = paramsBody.apply_date
    updateInfo["post_string"] = paramsBody.post_string
    updateInfo["cert_name"] = paramsBody.cert_name
    updateInfo["post_date"] = paramsBody.post_date
    updateInfo["accept_date"] = paramsBody.accept_date
    updateInfo["accept_number"] = paramsBody.accept_number
    updateInfo["pate_name"] = paramsBody.pate_name
    console.log(paramsBody)
    dao.update('CertModel',params.id,updateInfo,
    function(err,cert){
        if(err) return cb(err)
        cb(null,{
            'pate_string':cert.pate_string,
            'inven_name':cert.inven_name,
            'apply_date':cert.apply_date,
            'post_string':cert.post_string,
            'cert_name':cert.cert_name,
            'post_date':cert.post_date,
            'accept_date':cert.accept_date,
            'accept_number':cert.accept_number,
            'pate_name':cert.pate_name
        });
    }
  )
}




module.exports.getAllCerts = function(conditions,cb) {
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
        sql = "SELECT * FROM pt_certificate";
    
        if(key) {
            sql += " WHERE pate_string LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,cert){
                var retcert = [];
                for(idx in cert) {
                    var op = cert[idx];
                    // if(op.actual_status ===0){
                    //     op.actual_status = false
                    // }else{
                    //     op.actual_status = true
                    // }
                    retcert.push({
                        'cert_id':op.cert_id,
                        'pate_string':op.pate_string,
                        'inven_name':op.inven_name,
                        'apply_date':op.apply_date,
                        'post_string':op.post_string,
                        'cert_name':op.cert_name,
                        'post_date':op.post_date,
                        'accept_date':op.accept_date,
                        'accept_number':op.accept_number,
                        'pate_name':op.pate_name
                    });
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["cert"] = retcert;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,cert){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["cert"] = _.map(cert,function(cert){
                    return cert
                })
                cb(null,resultData);
            });
        }
	});
}


function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM pt_certificate";
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