var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
const { result } = require('lodash');
databaseModule = require(path.join(process.cwd(),"modules/database"));

//查询所有的事件
module.exports.getAllNews = function(){
    
}