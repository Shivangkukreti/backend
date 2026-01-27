let jwt = require('jsonwebtoken');
require('dotenv').config()
let user = require('../models/user'); 

async function authjwt(req, res, next) {
  let token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({ success: false, message: 'not authorized' });
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await user.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}



function gentoken(id) {
return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
module.exports={gentoken,authjwt}