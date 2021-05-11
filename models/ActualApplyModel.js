module.exports = function(db,callback){
    //专利公开模型
    db.define("ActualApplyModel",{
        actual_id: {type: 'serial', key: true},
        pt_apply_id : Number,
        apply_number : String,
        pt_name : String,
        actual_time : String,
        ps_college : String,
        reject_status : Number,
        grant_status : Number
    },{
        table : "actual_examination"
    });
    return callback()
}