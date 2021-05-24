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
    condition.news_visible = 0
    condition.news_type = params.news_type
    dao.exists('NewsModel',{'news_title': params.news_title},function(err,isExists){
        if(err) return cb(err)
        if(isExists){
            return cb("信息已存在")
        }
        clipImage(src,path.join(process.cwd(),condition.news_img))
        dao.create('NewsModel',condition,function(err,news){
            if(err) return cb(err);
            var result = {
                "id": news.news_id,
                "news_img": news.news_img,
                "news_time": news.news_time,
                "news_title": news.news_title,
                "news_info": news.news_info,
                "news_visible": 0,
                "news_type": news.news_type
            };
            cb(null,result)
        });
    })
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
    dao.destroy('NewsModel',id,function(err){
        if(err) return cb(err)
        return cb(null)
    })
}



module.exports.getAllNews = function(conditions,cb) {
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
        sql = "SELECT * FROM social_news";
    
        if(key) {
            sql += " WHERE news_title LIKE ? LIMIT ?,?";
            database.driver.execQuery(
                sql
            ,["%" + key + "%",offset,limit],function(err,News){
                var retNews = [];
                for(idx in News) {
                    var nw = News[idx];
                    if(nw.news_visible ===0){
                        nw.news_visible = false
                    }else{
                        nw.news_visible = true
                    }
                    retNews.push({
                        "id": nw.news_id,
                        "news_img": upload_config.get('baseURL') + nw.news_img,
                        "news_time": nw.news_time,
                        "news_title": nw.news_title,
                        "news_info": nw.news_info,
                        "news_visible": nw.news_visible,
                        "news_type": nw.news_type
                    });
                    console.log(nw)
                }
                var resultDta = {};
                resultDta["total"] = count;
                resultDta["pagenum"] = pagenum;
                resultDta["news"] = retNews;
                cb(err,resultDta);
            });
        } else {
            sql += " LIMIT ?,? ";
            database.driver.execQuery(sql,[offset,limit],function(err,news){
                if(err) return cb("查询执行出错");
                var resultData = {}
                resultData["total"] = count;
                resultData["pagenum"] = pagenum;
                resultData["news"] = _.map(news,function(news){
                    news.news_img = upload_config.get('baseURL') + news.news_img
                    return news
                })
                cb(null,resultData);
            });
        }
	});
}




function countByKey(key,cb){
    db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM social_news";
	if(key) {
		sql += " WHERE news_title LIKE ?";
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

// 修改实审状态
module.exports.updateNewsState = function(id,state,cb){
    dao.show('NewsModel',id,function(err,apply){
        if(err || !apply) cb('需求信息不存在');
        dao.update('NewsModel', id, {"news_id": apply.news_id,"news_visible": state},function(err,news){
            if(err) return cb("设置失败");
            cb(null,{
                "news_id": news.news_id,
                "news_img": upload_config.get('baseURL') + news.news_img,
                "news_time": news.news_time,
                "news_title": news.news_title,
                "news_info": news.news_info,
                "news_visible": news.news_visible,
                "news_type": news.news_type
            })
        })
    })
}