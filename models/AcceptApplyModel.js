module.exports = function(db,callback){
    //专利受理模型
    db.define("AcceptApplyModel",{
        accept_id: {type: 'serial', key: true},
        pt_apply_id : Number,
        apply_number : String,
        pt_name : String,
        accept_time : String,
        ps_college : String,
        open_status : Number,
    },{
        table : "pt_accept"
    });
    return callback()
}