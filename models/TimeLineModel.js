module.exports = function(db,callback){
    //时间轴模型
    db.define('TimeLineModel',{
        time_id: { type:'serial', key:true },
        mg_id: Number,
        pt_apply_id:Number,
        time: String,
        message:String
    },{
        table: 'timeLine'
    })
    return callback()
}