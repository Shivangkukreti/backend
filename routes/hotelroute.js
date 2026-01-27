const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const user = require('../models/user');
const {requireAuth,clerkClient}=require('@clerk/express');

    router.post('/addhotel',requireAuth(), async (req, res) => {
            let { name, address, contact, city } = req.body;
            let owner = req.auth.userId;
            let myuser = await clerkClient.users.getUser(req.auth.userId);
            let anyhotel=await Hotel.findOne({owner})
            
            if(anyhotel){
                return res.json({ success: false, message: 'Hotel already registered for this owner' });
            }
            await user.findByIdAndUpdate(owner,{hashotel:true})
            let newhotel = new Hotel({
                name,
                address,
                contact,
                owner,
                ownername:myuser.username,
                city
            });

            await newhotel.save();
            return res.json({ success: true, message: 'Hotel added successfully' });
        })






module.exports = router;