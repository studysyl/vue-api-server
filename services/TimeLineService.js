var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
const { result } = require('lodash');
databaseModule = require(path.join(process.cwd(),"modules/database"));

//查询所有的时间轴事件
module.exports.getAllTime = function(params,cb){
    //条件
    var conditions = {}
    conditions["columns"] = {};
    if(params.mg_id){
        conditions["columns"]["mg_id"] = params.mg_id
    }
    if(params.time){
        conditions["columns"]["time"] = params.time
    }
    if(params.message){
        conditions["columns"]["message"] = params.message
    }
    dao.list('TimeLineModel',conditions,function(err,timeData){
        if(err) return cb(err)
        var resultData = {}
        resultData["timeData"] = _.map(timeData,function(timeData){
            return timeData
        })
        cb(err,resultData)
    })
}

//添加时间线
module.exports.addTimeLine = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.pt_apply_id) return cb("申请id不能为空")
    dao.create('TimeLineModel',{
        "mg_id": paramsBody.mg_id,
        "pt_apply_id": paramsBody.pt_apply_id,
        "time": paramsBody.time,
        "message": paramsBody.message
    },function(err,timeLs){
        if(err) return cb(err);
        var result = {
            "id": timeLs.time_id,
            "mg_id": timeLs.mg_id,
            "pt_apply_id": timeLs.pt_apply_id,
            "time": timeLs.time,
            "message": timeLs.message
        };
        cb(null,result)
    });
    
}


//根据用户名和申请名找时间线
module.exports.getTime = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    conditions["columns"]["pt_apply_id"] = params.id
    dao.list('TimeLineModel',conditions,function(err,timeData){
        if(err) return cb(err)
        var resultData = {}
        resultData["timeData"] = _.map(timeData,function(timeData){
            return timeData
        });
        cb(err,resultData)
    });
}