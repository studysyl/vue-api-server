module.exports = function(db,callback){
    //专利申请模型
    db.define('LegalModel',{
        legal_id: {type: 'serial', key: true},
        pt_apply_id: Number,
        legal_time: String,
        legal_status: String,
        legal_info: String
    },{
        table : 'legalsta'
    });
    return callback()
}