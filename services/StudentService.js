var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
const { result } = require('lodash');
databaseModule = require(path.join(process.cwd(),"modules/database"));

//添加用户信息
module.exports.addStudent = function(paramsBody,cb){
    if(!paramsBody) return cb("参数不能为空")
    if(!paramsBody.mg_id) return cb("管理id不能为空")
    dao.create('StudentModel',{
        "mg_id": paramsBody.mg_id,
        "st_number": paramsBody.st_number,
        "st_birthday": paramsBody.st_birthday,
        "st_college": paramsBody.st_college
    },function(err,info){
        if(err) return cb(err);
        var result = {
            "id": info.st_id,
            "mg_id": info.mg_id,
            "st_number": info.st_number,
            "st_birthday": info.st_birthday,
            "st_college": info.st_college
        };
        cb(null,result)
    });
    
}


//根据用户名和申请名找时间线
module.exports.getStudent = function(params,cb){
    conditions = {}
    conditions["columns"] = {}
    conditions["columns"]["mg_id"] = params.mg_id
    dao.list('StudentModel',conditions,function(err,infoData){
        if(err) return cb(err)
        var resultData = {}
        resultData["infoData"] = _.map(infoData,function(infoData){
            return infoData
        });
        cb(err,resultData)
    });
}