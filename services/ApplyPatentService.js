var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
var Promise = require('bluebird')
var uniqid = require('uniqid')
const ApplyPatent = require('../models/ApplyPatentModel');
const { exists, update } = require('../dao/DAO');
const { info } = require('console');
const { result } = require('lodash');
var fs = require("fs");
var upload_config = require('config').get("upload_config");

databaseModule = require(path.join(process.cwd(),"modules/database"))


//查询以通过审核的申请数据
module.exports.getAllApplys = function(params,cb){
    //条件
    var condition = {}
    if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
    if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
    condition["columns"] = {};
    if(params.pt_apply_id){
        condition["columns"]["pt_apply_id"] = params.pt_apply_id
    }
    if(params.ps_number){
        condition["columns"]["ps_number"] = params.ps_number
    }
    if(params.pt_username){
        condition["columns"]["pt_username"] = params.pt_username
    }
    if(params.ps_college){
        condition["columns"]["ps_college"] = params.ps_college
    }
    if(params.pt_type){
        condition["columns"]["pt_type"] = params.pt_type
    }
    if(params.pt_name){
        condition["columns"]["pt_name"] = params.pt_name
    }
    if(params.pt_goal){
        condition["columns"]["pt_goal"] = params.pt_goal
    }
    if(params.pt_content){
        condition["columns"]["pt_content"] = params.pt_content
    }
    if(params.pt_compare){
        condition["columns"]["pt_compare"] = params.pt_compare
    }
    if(params.pt_example){
        condition["columns"]["pt_example"] = params.pt_example
    }
    if(params.review_opinion){
        condition["columns"]["review_opinion"] = params.review_opinion
    }
    if(params.review_name){
        condition["columns"]["review_name"] = params.review_name
    }
    if(params.review_visible){
        condition["columns"]["review_visible"] = params.review_visible
    }
    if(params.legal_status){
        condition["columns"]["legal_status"] = params.legal_status
    }
        condition["columns"]["accpet_status"] = 0
        condition["columns"]["review_status"] = 1
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
                applys.pt_example = upload_config.get('baseURL') + applys.pt_example
                if(applys.review_status === 0){
                    applys.review_status = false
                }else applys.review_status = true
                if(applys.accpet_status === 0){
                    applys.accpet_status = false
                }else applys.accpet_status =true
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
        if(!params.ps_number){
            return reject("学号或者工号不能为空")
        }
        if(!params.pt_username){
            return reject("发明人不能为空")
        }
        if(!params.pt_name){
            return reject("发明名称不能为空")
        }
        info.mg_id = params.mg_id
        info.ps_number = params.ps_number
        info.pt_username = params.pt_username
        info.ps_college = params.ps_college
        info.pt_type = params.pt_type
        info.pt_name = params.pt_name
        info.pt_goal = params.pt_goal
        info.pt_content = params.pt_content
        info.pt_compare = params.pt_compare
        var pic = params.pt_example
        var src = path.join(process.cwd(),pic)
        var tmp = src.split(path.sep)
        var filename = tmp[tmp.length - 1];
        info.pt_example = '/uploads/applyimg/' + filename
        clipImage(src,path.join(process.cwd(),info.pt_example))
        info.review_opinion = params.review_opinion
        info.review_name = params.review_name
        info.review_visible = 0
        info.legal_status = params.legal_status
        info.review_status = 0//未审核
        info.accpet_status = 0//未进入受理阶段
        resolve(info)
    });
}

function clipImage(srcPath,savePath){
    return new Promise(function(resolve,reject){
        readable = fs.createReadStream(srcPath)
        writeable = fs.createWriteStream(savePath)
        readable.pipe(writeable);
        readable.on('end',function(){
            resolve();
        })
    })
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
    if(!params.id) return cb("审核ID不能为空");
	if(isNaN(parseInt(params.id))) return cb("审核ID必须为数字");
    updateInfo = {}
    updateInfo["ps_number"] = paramsBody.ps_number
    updateInfo["pt_username"] = paramsBody.pt_username
    updateInfo["ps_college"] = paramsBody.ps_college
    updateInfo["pt_type"] = paramsBody.pt_type
    updateInfo["pt_name"] = paramsBody.pt_name
    updateInfo["pt_goal"] = paramsBody.pt_goal
    updateInfo["pt_content"] = paramsBody.pt_content
    updateInfo["pt_compare"] = paramsBody.pt_compare
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

//未审核信息
module.exports.NoReview = function(params,cb){
    var condition = {}
    if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
    if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
    condition['columns'] = {}
    if(params.pt_apply_id){
        condition["columns"]["pt_apply_id"] = params.pt_apply_id
    }
    if(params.ps_number){
        condition["columns"]["ps_number"] = params.ps_number
    }
    if(params.pt_username){
        condition["columns"]["pt_username"] = params.pt_username
    }
    if(params.ps_college){
        condition["columns"]["ps_college"] = params.ps_college
    }
    if(params.pt_type){
        condition["columns"]["pt_type"] = params.pt_type
    }
    if(params.pt_name){
        condition["columns"]["pt_name"] = params.pt_name
    }
    if(params.pt_goal){
        condition["columns"]["pt_goal"] = params.pt_goal
    }
    if(params.pt_content){
        condition["columns"]["pt_content"] = params.pt_content
    }
    if(params.pt_compare){
        condition["columns"]["pt_compare"] = params.pt_compare
    }
    if(params.pt_example){
        condition["columns"]["pt_example"] = params.pt_example
    }
    if(params.review_opinion){
        condition["columns"]["review_opinion"] = params.review_opinion
    }
    if(params.review_name){
        condition["columns"]["review_name"] = params.review_name
    }
    if(params.review_visible){
        condition["columns"]["review_visible"] = params.review_visible
    }
    if(params.legal_status){
        condition["columns"]["legal_status"] = params.legal_status
    }
        condition['columns']["review_status"] = 0

    if(params.accpet_status){
        condition["columns"]["accpet_status"] = params.accpet_status 
    }
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
                applys.pt_example = upload_config.get('baseURL') + applys.pt_example
                if(applys.review_status === 0){
                    applys.review_status = false
                }else applys.review_status = true
                return applys;
            })
            cb(err,resultData);
        })
    })
}


//已审核信息
module.exports.realReview = function(params,cb){
    var condition = {}
    if(!params.pagenum || params.pagenum <= 0) return cb("pagenum 参数错误")
    if(!params.pagesize || params.pagesize <= 0) return cb("pagesize 参数错误")
    condition['columns'] = {}
    if(params.pt_apply_id){
        condition["columns"]["pt_apply_id"] = params.pt_apply_id
    }
    if(params.ps_number){
        condition["columns"]["ps_number"] = params.ps_number
    }
    if(params.pt_username){
        condition["columns"]["pt_username"] = params.pt_username
    }
    if(params.ps_college){
        condition["columns"]["ps_college"] = params.ps_college
    }
    if(params.pt_type){
        condition["columns"]["pt_type"] = params.pt_type
    }
    if(params.pt_name){
        condition["columns"]["pt_name"] = params.pt_name
    }
    if(params.pt_goal){
        condition["columns"]["pt_goal"] = params.pt_goal
    }
    if(params.pt_content){
        condition["columns"]["pt_content"] = params.pt_content
    }
    if(params.pt_compare){
        condition["columns"]["pt_compare"] = params.pt_compare
    }
    if(params.pt_example){
        condition["columns"]["pt_example"] = params.pt_example
    }
    if(params.review_opinion){
        condition["columns"]["review_opinion"] = params.review_opinion
    }
    if(params.review_name){
        condition["columns"]["review_name"] = params.review_name
    }
    if(params.review_visible){
        condition["columns"]["review_visible"] = params.review_visible
    }
    if(params.legal_status){
        condition["columns"]["legal_status"] = params.legal_status
    }
        condition['columns']["review_status"] = 1

    if(params.accpet_status){
        condition["columns"]["accpet_status"] = params.accpet_status 
    }
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
                applys.pt_example = upload_config.get('baseURL') + applys.pt_example
                if(applys.accpet_status === 0){
                    applys.accpet_status = false
                }else applys.accpet_status = true
                return applys;
            })
            cb(err,resultData);
        })
    })
}




//审核意见
module.exports.addReviewInfo = function (params,paramsBody,cb){
    if(!params) return cb("参数不能为空");
    if(!params.id) return cb("审核ID不能为空");
    if(!paramsBody.mg_id) return cb("审核人ID不能为空")
	if(isNaN(parseInt(params.id))) return cb("审核ID必须为数字");
    updateInfo = {}
    updateInfo["mg_id"] = paramsBody.mg_id
    updateInfo["review_name"] = paramsBody.review_name
    updateInfo["review_opinion"] = paramsBody.review_opinion
    updateInfo["review_visible"] = paramsBody.review_visible
    updateInfo["review_status"] = paramsBody.review_status
    dao.update('ApplyPatentModel',params.id,updateInfo,
        function(err,newInfo){
            if(err) return cb(err)
            cb(null,{
                "mg_id": newInfo.mg_id,
                "review_name": newInfo.review_name,
                "review_opinion": newInfo.review_opinion,
                "review_visible": newInfo.review_visible,
                "review_status": newInfo.review_status
            })
        }
    )
}


// 根据申请id查找法律状态
module.exports.LegalList = function(paramsBody,cb){
    if(!paramsBody.pagenum || paramsBody.pagenum <= 0) return cb("pagenum 参数错误")
    if(!paramsBody.pagesize || paramsBody.pagesize <= 0) return cb("pagesize 参数错误")
    condition = {}
    condition['columns'] = {}
    condition['columns']['pt_apply_id'] = paramsBody.pt_apply_id
    dao.countByConditions("LegalModel",condition,function(err,count){
        if(err) return cb(err)
        pagenum = paramsBody.pagenum
        pagesize = paramsBody.pagesize
        pageCount = Math.ceil(count / pagesize)
        offset = (pagenum - 1) * pagesize
        if(offset >= count){
            offset = count
        }
        limit = pagesize;

        //构建条件
        condition["offset"] = offset;
        condition["limit"] = limit
        dao.list("LegalModel",condition,function(err,Legals){
            if(err) return cb(err)
            var resultData = {}
            resultData["total"] = count
            resultData["pagenum"] = pagenum
            resultData["Legals"] = _.map(Legals,function(Legals){
                return Legals;
            })
            cb(err,resultData);
        })
    })
}

module.exports.editLegal = function(paramsId,params,cb){
    if(!paramsId) return cb('参数不能为空')
    if(!paramsId.id) return cb('法律id不能为空')
    condition = {}
    if(params.legal_id){
        condition["legal_id"] = params.legal_id
    }
    if(params.pt_apply_id){
        condition["pt_apply_id"] = params.pt_apply_id
    }
    if(params.legal_time){
        condition["legal_time"] = params.legal_time
    }
    if(params.legal_status){
        condition["legal_status"] = params.legal_status
    }
    if(params.legal_info){
        condition["legal_info"] = params.legal_info
    }
    dao.update('LegalModel',paramsId.id,condition,
    function(err,newInfo){
        if(err) return cb(err)
        cb(null,{
            "legal_id": newInfo.mg_id,
            "pt_apply_id": newInfo.review_name,
            "legal_time": newInfo.review_opinion,
            "legal_status": newInfo.review_visible,
            "legal_info": newInfo.review_status
        })
    }
)
}

module.exports.createLegal = function(params,cb){
    dao.create('LegalModel',{
        "pt_apply_id": params.pt_apply_id,
        "legal_time": params.legal_time,
        "legal_status": params.legal_status,
        "legal_info": params.legal_info
    },function(err,legal){
        if(err) return cb(err);
        var result = {
            "id": legal.legal_id,
            "pt_apply_id": legal.pt_apply_id,
            "legal_time": legal.legal_time,
            "legal_status": params.legal_status,
            "legal_info": legal.legal_info
        };
        cb(null,result)
    });

}

module.exports.updateAccState = function(id,state,cb){
    dao.show('ApplyPatentModel',id,function(err,apply){
        if(err || !apply) cb('申请信息不存在');
        dao.update('ApplyPatentModel', id, {"pt_apply_id": apply.pt_apply_id,"accpet_status": state},function(err,newInfo){
            if(err) return cb("设置失败");
            cb(null,{
                "pt_apply_id": newInfo.pt_apply_id,
                "ps_number": newInfo.ps_number,
                "pt_username": newInfo.pt_username,
                "ps_college": newInfo.ps_college,
                "pt_type": newInfo.pt_type,
                "pt_name": newInfo.pt_name,
                "pt_goal": newInfo.pt_goal,
                "pt_content": newInfo.pt_content,
                "pt_compare": newInfo.pt_compare,
                "pt_example": newInfo.pt_example,
            })
        })
    })
}

//根据申请号找id
module.exports.getUserId = function(params,cb){
    dao.findOne('ApplyPatentModel',{'pt_apply_id': params.id},function(err,apply){
        if(err) return cb(err)
        return cb(null,{
            'mg_id': apply.mg_id
        })
    })
}


//根据用户名找专利
module.exports.getApply = function(params,cb){
    condition = {}
    condition['columns'] = {}
    condition['columns']['mg_id'] = params.id
    dao.list('ApplyPatentModel',condition,function(err,apply){
        if(err) return cb(err)
        return cb(null,apply)
    })
}