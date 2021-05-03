module.exports = function(db,callback){
    // 学生模型
    db.define('StudentModel',{
        st_id: { type:'serial', key:true },
        mg_id: Number,
        st_number: Number,
        st_birthday: String,
        st_college: String
    },{
        table: 'pt_student'
    })
    return callback()
}