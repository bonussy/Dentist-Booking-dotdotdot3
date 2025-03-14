const Dentist = require('../models/Dentist');

//@desc Get all dentists
//@rotue GET /api/v1/dentists
//@access Public
exports.getDentists = async (req, res, next) => {
    try{
        const dentists = await Dentist.find();

        res.status(200).json({
            success: true,
            count: dentists.length,
            data: dentists
        });

    } catch(err){
        res.status(400).json({ success: false , message: err.message });
    }
};