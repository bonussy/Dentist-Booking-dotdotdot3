//@desc Get all dentists
//@rotue GET /api/v1/dentists
//@access Public
exports.getDentists = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all dentists' });
};