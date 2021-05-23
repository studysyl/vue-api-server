module.exports = function(db,callback){
	// 用户模型
	db.define("ReportYearModel",{
		id : {type: 'serial', key: true},
		count : Number,
		college : String,
		date : { type: "date", time: false }
	},{
		table : "pt_college_cout"
	});
	return callback();
}