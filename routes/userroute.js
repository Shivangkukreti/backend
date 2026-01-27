const express=require('express')
const router=express.Router() 
let {requireAuth}=require('@clerk/express')
let user=require('../models/user')


router.get('/profile',requireAuth(),async (req,res)=>{
 let userid=req.auth.userId
 let myuser =await user.findById(userid).select('-password')
 res.json({success:true,myuser})
})





module.exports=router