var _ = require('lodash');
var path = require('path');
var orm = require('orm');
var dao = require(path.join(process.cwd(),"dao/DAO"));
const { exists, update } = require('../dao/DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));
var gm = require("gm");
var Promise = require("bluebird");
var fs = require("fs");
var uniqid = require('uniqid');
const { cwd } = require('process');
var upload_config = require('config').get("upload_config");

//查询所有的事件
module.exports.getAllNews = function(params,cb){
    var condition = {}
    condition["columns"] = {}
    if(params.news_img){
        condition["columns"]["news_img"] = params.news_img
    }
    if(params.news_time){
        condition["columns"]["news_time"] = params.news_time
    }
    if(params.news_title){
        condition["columns"]["news_title"] = params.news_title
    }
    if(params.news_info){
        condition["columns"]["news_info"] = params.news_info
    }
    if(params.news_visible){
        condition["columns"]["news_visible"] = params.news_visible
    }
    if(params.news_type){
        condition["columns"]["news_type"] = params.news_type
    }
    dao.list('NewsModel',condition,function(err,news){
        if(err) return cb(err)
        // _(news).forEach(function(pic){
        //     pic.news_img = upload_config.get('baseURL') + pic.news_img
        // });
        var resultData = {}
        resultData["news"] = _.map(news,function(news){
            news.news_img = upload_config.get('baseURL') + news.news_img
            return news
        })
        cb(err,resultData)
    })

}

module.exports.createNews = function(params,cb){
    var condition = {}
    var pic = params.news_img
    var src = path.join(process.cwd(),pic)
    var tmp = src.split(path.sep)
    var filename = tmp[tmp.length - 1];
    condition.news_img = '/uploads/NewsImg/' + filename
    condition.news_time = params.news_time
    condition.news_title = params.news_title
    condition.news_info = params.news_info
    condition.news_visible = params.news_visible
    condition.news_type = params.news_type
    clipImage(src,path.join(process.cwd(),condition.news_img))
    dao.create('NewsModel',condition,function(err,news){
        if(err) return cb(err);
        var result = {
            "id": news.news_id,
            "news_img": news.news_img,
            "news_time": news.news_time,
            "news_title": news.news_title,
            "news_info": news.news_info,
            "news_visible": news.news_visible,
            "news_type": news.news_type
        };
        cb(null,result)
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

// 删除新闻
module.exports.delNews = function(id,cb){
    // dao.list('NewModel',{"columns":{"news_id":id}},function(err,news){
    //     if(err) return cb(err)
    //     fs.unlink(path.join(process.cwd(),news.news_img))
    // })
    dao.destroy('NewsModel',id,function(err){
        if(err) return cb(err)
        return cb(null)
    })
}
