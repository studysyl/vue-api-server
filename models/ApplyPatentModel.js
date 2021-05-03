module.exports = function(db,callback){
    //专利申请模型
    db.define("ApplyPatentModel",{
        pt_apply_id: {type: 'serial', key: true},
        mg_id : Number,
        ps_number : String,
        pt_username : String,
        ps_college : String,
        pt_type : String,
        pt_name : String,
        pt_goal : String,
        pt_content : String,
        pt_compare : String,
        pt_example : String,
        review_opinion : String,
        review_name : String,
        review_visible : Number,
        legal_status : String,
        review_status : Number
    },{
        table : "pt_apply"
        
    });
    return callback()
}