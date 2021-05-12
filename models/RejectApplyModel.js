module.exports = function(db,callback){
    //专利授权模型
    db.define("RejectApplyModel",{
        reject_id: {type: 'serial', key: true},
        pt_apply_id : Number,
        apply_number : String,
        pt_name: String,
        reject_time : String,
        reject_info : String,
        ps_college : String,
        recheck_status : Number
    },{
        table : "pt_reject"
    });
    return callback()
}