module.exports = function(db,callback){
    //专利申请模型
    db.define("ApplyPatentModel",{
        pt_apply_id: {type: 'serial', key: true},
        ps_number : String,
        pt_username : String,
        ps_college : String,
        pt_type : String,
        pt_name : String,
        pt_goal : String,
        pt_content : String 
    },{
        table : "pt_apply"
        
    });
    return callback()
}