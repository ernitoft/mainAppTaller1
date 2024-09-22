const bcrypt = require('bcrypt');
const {generateToken} = require('../Middlewares/jwt.js');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');


const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                error: true,
                path: 'credentials',
                message: 'Credenciales incorrectas',
                errors: [{message: 'Credenciales incorrectas'}]
            });
        }

        const {data} = await axios.get('https://codelsoft-user-service.onrender.com/api/teaching')

        const user = data.find(user => user.email === email);
        if(!user || user.firstname !== password){
            return res.status(400).json({
                error: true,
                path: 'credentials',
                message: 'Credenciales incorrectas',
                errors: [{message: 'Credenciales incorrectas'}]
            });
        }
        
        const token = await generateToken(user.email);

        return res.status(200).json({
            error: false,
            message: 'Login exitoso',
            token
        });

    } catch (error){
        return res.status(500).json({
            error: true,
            message: error.message,
        })
    }
}

module.exports = {login}