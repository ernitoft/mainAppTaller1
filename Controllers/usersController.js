
const axios = require('axios');

const createStudent = async (req, res) => {
    try{
        const {firstname, lastname, email} = req.body;

        if (!firstname || !lastname || !email){
            return res.status(400).json({
                error: true,
                message: 'Faltan datos',
            });
        }

        //Users service
        const createResponse = await axios.post('https://codelsoft-user-service.onrender.com/api/student', {
            firstname,
            lastname,
            email,
        });

        if (createResponse.status == 409){
            return res.status(400).json({
                error: true,
                message: createResponse.message,
            });
        }
        
        if (createResponse.status !== 201){
            return res.status(400).json({
                error: true,
                message: 'Error al crear estudiante',
            });
        }
        
        //Search service
        const searchResponse = await axios.post('codelsoft-search-service.onrender.com/api/auth/register', {
            'name': firstname,
            lastname,
            email,
            'password': firstname,
            'phone': '+123456789',
            'roleName': 'STUDENT'
        });

        if (searchResponse.status == 409){
            return res.status(400).json({
                error: true,
                message: searchResponse.message,
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Estudiante creado',
            response: createResponse.data
        });


    }catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 409) {
                return res.status(409).json({
                    error: true,
                    message: data.message || 'Conflicto: el estudiante ya existe.',
                });
            }
            return res.status(status).json({
                error: true,
                message: data.message || 'Error en la creación del estudiante',
            });
        } else {
            return res.status(500).json({
                error: true,
                message: 'Error del servidor: ' + error.message,
            });
        }
    }
};

module.exports = {createStudent}