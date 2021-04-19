var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
var Promise = require('bluebird')
var uniqid = require('uniqid')
const ApplyPatent = require('../models/ApplyPatentModel');
const { exists } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"))


//查询所有申请数据
module.exports.getAllApplys = function(params,cb){
    //条件
    var condition = {}
    if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
    if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
    condition["columns"] = {};
    if(params.pt_apply_id){
        condition["columns"]["pt_apply_id"] = params.pt_apply_id
    }
    if(params.pt_apply_id){
        condition["columns"]["ps_number"] = params.ps_number
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_username"] = params.pt_username
    }
    if(params.pt_apply_id){
        condition["columns"]["ps_college"] = params.ps_college
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_type"] = params.pt_type
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_name"] = params.pt_name
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_goal"] = params.pt_goal
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_content"] = params.pt_content
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_compare"] = params.pt_compare
    }
    if(params.pt_apply_id){
        condition["columns"]["pt_example"] = params.pt_example
    }
    //获取总的数目
    dao.countByConditions("ApplyPatentModel",condition,function(err,count){
        if(err) return cb(err)
        pagenum = params.pagenum
        pagesize = params.pagesize
        pageCount = Math.ceil(count / pagesize)
        offset = (pagenum - 1) * pagesize
        if(offset >= count){
            offset = count
        }
        limit = pagesize;

        //构建条件
        condition["offset"] = offset;
        condition["limit"] = limit

        dao.list("ApplyPatentModel",condition,function(err,applys){
            if(err) return cb(err)
            var resultData = {}
            resultData["total"] = count
            resultData["pagenum"] = pagenum
            resultData["applys"] = _.map(applys,function(applys){
                return applys;
            })
            cb(err,resultData);
        })
    });
}

//检查申请申请
function doCheckParams(params){
    return new Promise(function(resolve,reject){
        var info = {};
        // if(!params.pt_apply_id) return reject("申请id为空")
        // if(isNaN(parseInt(params.pt_apply_id))) return reject("申请id非数字") 
        // info.pt_apply_id = params.pt_apply_id
        if(!params.ps_number){
            return reject("学号或者工号不能为空")
        }
        if(!params.pt_username){
            return reject("发明人不能为空")
        }
        if(!params.pt_name){
            return reject("发明名称不能为空")
        }
        info.ps_number = params.ps_number
        info.pt_username = params.pt_username
        info.pt_name = params.pt_name
        info.ps_college = params.ps_college
        info.pt_type = params.pt_type
        info.pt_name = params.pt_name
        info.pt_goal = params.pt_goal
        info.pt_content = params.pt_content
        info.pt_compare = params.pt_compare
        info.pt_example = params.pt_example
        resolve(info)
    });
}

//新建申请信息函数
function doCreateInfo(info){
    return new Promise(function(resolve,reject){
        dao.create("ApplyPatentModel",_.clone(info),function(err,newInfo){
            if(err){
                return reject(err)
            }
            info.apply = newInfo
            resolve(info)
        })
    })
}

//检测是否存在申请信息
function Exists(ptName,cb){
    var db = databaseModule.getDatabase()
    var Model = db.models.ApplyPatentModel
    Model.exists({"pt_name": ptName},function(err,isExists){
        if(err) return cb(err)
        cb(null,isExists)
    })
}


//新建申请
module.exports.createApply = function(params,cb){
    Exists(params.pt_name,function(err,isExists){
        if(err) return cb(err)
        if(isExists) return cb("申请已存在")
        doCheckParams(params)
        .then(doCreateInfo)
        .then(function(info){
            cb(null,info.apply)
        })
        .catch(function(err){
            cb(err);
        });
    })
}

//删除申请
module.exports.delApplyPatent = function(applyId,cb){
    dao.destroy("ApplyPatentModel",applyId,function(err){
        if(err) return cb(err)
        return cb(null)
    })
}

//更新申请数据
module.exports.updateApply = function(params,paramsBody,cb){
    if(!params) return cb("参数不能为空");
    if(!params.id) return cb("证书ID不能为空");
	if(isNaN(parseInt(params.id))) return cb("证书ID必须为数字");
    updateInfo = {}
    updateInfo["ps_number"] = paramsBody.ps_number
    updateInfo["pt_username"] = paramsBody.pt_username
    updateInfo["ps_college"] = paramsBody.ps_college
    updateInfo["pt_type"] = paramsBody.pt_type
    updateInfo["pt_name"] = paramsBody.pt_name
    updateInfo["pt_goal"] = paramsBody.pt_goal
    updateInfo["pt_content"] = paramsBody.pt_content
    updateInfo["pt_compare"] = paramsBody.pt_compare
    updateInfo["pt_example"] = paramsBody.pt_example
    dao.update('ApplyPatentModel',params.id,updateInfo,
    function(err,newInfo){
        if(err) return cb(err)
        cb(null,{
            "ps_number": newInfo.ps_number,
            "pt_username": newInfo.pt_username,
            "ps_college": newInfo.ps_college,
            "pt_type": newInfo.pt_type,
            "pt_name": newInfo.pt_name,
            "pt_goal": newInfo.pt_goal,
            "pt_content": newInfo.pt_content,
            "pt_compare": newInfo.pt_compare,
            "pt_example": newInfo.pt_example,
        });
    })
}