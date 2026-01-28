const express=require('express')
const booking = require('../models/booking')
const Room=require('../models/room')
const Hotel=require('../models/hotel')
const {requireAuth, clerkClient}=require('@clerk/express');
const  transporter  = require('../utils/nodemailer');
const router=express.Router()



router.post('/checkavailability',async(req,res)=>{
    let {inn,out,room}=req.body
    let roomisavail=true
    let book=await booking.find({room,inn:{$lte:out},out:{$gte:inn}})
    roomisavail=book.length==0
    res.json({success:true,roomisavail})
})





router.post('/bookroom',requireAuth(),async(req,res)=>{
    let {inn,out,room,guests}=req.body
    let userid=req.auth.userId
    let book=await booking.find({room,inn:{$lte:out},out:{$gte:inn}})
    if (book.length>0) {
        return res.json({success:false,message:"Room not available"})
    }  
    inn=new Date(inn)
    out=new Date(out)
    let myroom=await Room.findById(room)
    let totalamount= myroom.price* Math.ceil((out-inn)/(1000*60*60*24))
    let newbooking=new booking({
        inn,
        out,
        hotel:myroom.hotel,
        room,
        user:userid,
        price:totalamount,
        guests
    })
    await newbooking.save()
const myuser = await clerkClient.users.getUser(req.auth.userId);
    
let mail={
    from:process.env.SENDER_EMAIL,
    to:myuser.emailAddresses[0].emailAddress,
    subject:"Booking Confirmation",
    text:`${myuser.firstName} Your booking has been confirmed with booking id ${newbooking._id}. We look forward to hosting you! `  
}
await transporter.sendMail(mail)

    res.json({success:true,message:"Room booked successfully"})
})





router.get('/mybookings',requireAuth(),async(req,res)=>{
    let userid=req.auth.userId
    let bookings=await booking.find({user:userid}).populate('room hotel')
    res.json({success:true,bookings})
})


    

router.get('/hotelbookings',requireAuth(),async(req,res)=>{
    let hotel=await Hotel.findOne({owner:req.auth.userId})
    if(!hotel){
        return res.json({success:false,message:"No hotel found"})
    }
    let bookings=await booking.find({hotel:hotel._id}).populate('room user')
    let totalbookings=bookings.length
    let totalrevenue=555 
    res.json({success:true,totalbookings,totalrevenue})
})
module.exports=router