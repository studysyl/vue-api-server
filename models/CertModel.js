module.exports = function(db,callback){
    //用户模型
    db.define("CertModel",{
        cert_id : {type: 'serial', key: true},
        pate_string : String,
        inven_name : String,
        apply_date : String,
        post_string : String,
        cert_name : String,
        post_date : String,
        accept_date : String,
        accept_number : String,
        pate_name : String
    },{
        table : "pt_certificate"
    });
    return callback();
}