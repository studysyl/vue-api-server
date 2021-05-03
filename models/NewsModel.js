module.exports = function(db,callback){
	// 新闻模型
	db.define("NewsModel",{
		news_id : {type: 'serial', key: true},
		news_img : String,
		news_time : String,
        news_title: String,
        news_info: String,
        news_visible: Number,
        news_type: Number
	},{
		table : "social_news"
	});
	return callback();
}