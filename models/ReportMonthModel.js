module.exports = function(db,callback){
	// 用户模型
	db.define("ReportMonthModel",{
		id : {type: 'serial', key: true},
		grantCount : Number,
        applyCount : Number,
		college : String,
		date : { type: "date", time: false }
	},{
		table : "pt_month_count"
	});
	return callback();
}