const express=require('express');
const router=express.Router()
const Room=require('../models/room')
const Hotel=require('../models/hotel')
const multer = require('multer');
const {requireAuth}=require('@clerk/express');
const {storage}=require('../utils/cloudinary')
const upload = multer({ storage: storage }); 



router.post('/addroom',upload.array('images',4),requireAuth(),async(req,res)=>{
let {roomtype,price,amenities}=req.body
let hotel=await Hotel.findOne({owner:req.auth.userId})
if(!hotel){
    return res.json({success:false,message:"No hotel found"})
}
 let images = [];
  if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

let newRoom=new Room({ 
    roomtype,
    price,
    amenities,
    images,
    hotel:hotel._id
})
await newRoom.save()
res.json({success:true,message:"Room added successfully"})})




router.get('/getrooms',async(req,res)=>{

    try {
      let rooms=await Room.find({isavailable:true}).populate('hotel')
       res.json({success:true,rooms})  
    } catch (error) {
        return res.json({success:false,message:error.message})
    }

})


router.get('/myrooms',requireAuth(),async(req,res)=>{
    let hotel=await Hotel.findOne({owner:req.auth.userId})
    let rooms=await Room.find({hotel:hotel._id})
    res.json({success:true,rooms})
})

router.post('/setavailability',requireAuth(),async(req,res)=>{
    let {roomid}=req.body
    let room=await Room.findById(roomid).populate('hotel')      
    if(!room){
        return res.json({success:false,message:"Room not found"})
    }
    if(room.hotel.owner!=req.auth.userId){
        return res.json({success:false,message:"You are not authorized to change this room's availability"})
    }
    room.isavailable= !room.isavailable
    await room.save()
    res.json({success:true,message:"Availability updated successfully"})
})

module.exports=router