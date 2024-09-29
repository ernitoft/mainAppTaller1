
const axios = require('axios');


const createStudent = async (req, res) => {
    try {
        const { name, lastName, email} = req.body;

        // Verificar si faltan datos
        if (!name || !lastName || !email) {
            return res.status(400).json({
                error: true,
                message: 'Faltan datos',
            });
        }

        // Llamada al servicio de usuarios para crear el estudiante
        const createResponse = await axios.post('https://codelsoft-user-service.onrender.com/api/student', {
            firstname: name, // Ajuste clave para cumplir con la API
            lastname: lastName,
            email,
        });

        console.log('createResponse: ', createResponse);
        
        // Manejo de posibles errores en la creación
        if (createResponse.status === 409) {
            return res.status(409).json({
                error: true,
                message: createResponse.data.message || 'El estudiante ya existe.',
            });
        }

        if (createResponse.status !== 201) {
            return res.status(400).json({
                error: true,
                message: createResponse.data.message || 'Error al crear estudiante.',
            });
        }

        // Llamada al servicio de búsqueda para crear el estudiante en el sistema de búsqueda
        const searchResponse = await axios.post('https://codelsoft-search-service.onrender.com/api/users/create', {
            name, // Ajuste clave para cumplir con la API
            lastName,
            email,
            roleName: 'STUDENT',
        });

        console.log('searchResponse: ', searchResponse);

        // Manejo de posibles errores en el servicio de búsqueda
        if (searchResponse.status === 409) {
            return res.status(409).json({
                error: true,
                message: searchResponse.data.message || 'Conflicto: el usuario ya existe en el sistema de búsqueda.',
            });
        }

        if (searchResponse.status !== 201) {
            return res.status(400).json({
                error: true,
                message: searchResponse.data.message || 'Error al registrar el estudiante en el sistema de búsqueda.',
            });
        }

        // Respuesta exitosa
        return res.status(200).json({
            error: false,
            message: 'Estudiante creado correctamente.',
            response: createResponse.data,
        });

    } catch (error) {
        // Manejo de errores de Axios y otros errores inesperados
        console.log('Error al crear estudiante: ', error);

        if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({
                error: true,
                message: data.message || 'Error en la creación del estudiante.',
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