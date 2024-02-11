
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

exports.verifyToken = asyncHandler ( async(req, res, next) => {
  let token;
  
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
  ) {

    token = req.headers.authorization.split(" ")[1];
    
    jwt.verify(token, process.env.AUTHORIZATION_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user;
      next();
    });
  
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

});
