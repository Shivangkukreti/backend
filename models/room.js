const mongoose=require('mongoose')
const Schema=mongoose.Schema

let sch=new Schema({
    amenities:{type:[String],required:true},
    images:{type:[String],required:true},
    isavailable:{type:Boolean,required:true,default:true},
    roomtype:{type:String,required:true},
    price:{type:Number,required:true},
    hotel:{type:Schema.Types.ObjectId,ref:'hotel',required:true}
});



let room=mongoose.model('room',sch)
module.exports=room