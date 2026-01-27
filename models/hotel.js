const mongoose=require('mongoose')
const Schema=mongoose.Schema

let sch=new Schema({
    name:{type:String,required:true},
    address:{type:String,required:true},
    contact:{type:String,required:true},
    owner:{type:String,required:true,ref:'user'},
    ownername:{type:String},
    city:{type:String,required:true}
})

let hotel = mongoose.model('hotel', sch)
module.exports=hotel




