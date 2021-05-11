module.exports = function(db,callback){
    //专利公开模型
    db.define("OpenApplyModel",{
        open_id: {type: 'serial', key: true},
        pt_apply_id : Number,
        apply_number : String,
        pt_name : String,
        open_time : String,
        ps_college : String,
        actual_status : Number,
    },{
        table : "pt_open"
    });
    return callback()
}