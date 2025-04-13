const User = require('../models/User');

//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    try{
        console.log(req.body);

        const {name, telephone, email, password, role} = req.body;
        
        // Create user
        // Validation is handled in the User model (e.g., required fields, unique constraints, regex patterns)
        const user = await User.create({
            name,
            telephone,
            email,
            password,
            role
        });

        // Create token
        sendTokenResponse(user, 200, res);

    } catch(err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log(`Validation Error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Log unexpected errors
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Cannot register user'
        });
    }
};

//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req,res,next) => {
    try{
        const {email, password} = req.body;

        //Validate email & password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                msg: 'Please provide an email and password'
            });
        }

         // Validate email format
         const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
         if (!emailRegex.test(email)) {
             return res.status(400).json({
                 success: false,
                 message: 'Please provide a valid email address'
             });
         }
 
         // Validate password length
         if (password.length < 6) {
             return res.status(400).json({
                 success: false,
                 message: 'Password must be at least 6 characters long'
             });
         }

        //Check if the user exists
        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        //Check if the password matches
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        //Create token
        sendTokenResponse(user, 200, res);

    } catch(err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log(`Validation Error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
    }
    
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() +process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    })
}

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = async (req,res,next) => {
    res.cookie('token','none',{
        expires:new Date(Date.now()+ 10*1000),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        data:{}
    });
};