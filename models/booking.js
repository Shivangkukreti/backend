const mongoose=require('mongoose')
const Schema=mongoose.Schema

let sch=new Schema({
    user:{type:String,required:true,ref:'user'},
    room:{type:Schema.Types.ObjectId,required:true,ref:'room'},
    hotel:{type:Schema.Types.ObjectId,required:true,ref:'hotel'},
    guests:{type:Number,required:true,default:1},
    inn:{type:Date,required:true},
    out:{type:Date,required:true},
    price:{type:Number,required:true},
    status:{type:String,enum:['Pending','Confirmed','Cancelled'],default:"Pending"},
    ispaid:{type:Boolean,default:false},
    payway:{type:String,required:true,default:"Pay At Hotel"}
})



let booking=mongoose.model('booking',sch)
module.exports=booking

