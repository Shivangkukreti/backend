const mongoose=require('mongoose')
const Schema=mongoose.Schema


let sch=new Schema({
    _id:{type:String,required:true},
    email:{type:String,required:true},
    username:{type:String,required:true},
    image:{type:String,required:true},
})

let user=mongoose.model('user',sch)
module.exports=user

