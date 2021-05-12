module.exports = function(db,callback){
    //专利授权模型
    db.define("GrantApplyModel",{
        grant_id: {type: 'serial', key: true},
        pt_apply_id : Number,
        pate_string : String,
        pt_username : String,
        pt_name: String,
        grant_time : String,
        ps_college : String,
        transfer_status : Number
    },{
        table : "pt_grant"
    });
    return callback()
}