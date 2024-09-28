const axios = require('axios');


const createRestrictions = async (req, res) => {
    try{
        const {studentId, reason} = req.body;
        if (!studentId || !reason){
            return res.status(400).json({
                error: true,
                message: 'Faltan datos',
            });
        }
        const response = await axios.post('https://api-restrictions.onrender.com/restrictions',
            params = {
                studentId,
                reason,
            },
        );

        return res.status(200).json({
            error: false,
            message: 'Restricción creada',
            data: [
                response.data
            ],
        });

    } catch (error){
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

module.exports = { createRestrictions };