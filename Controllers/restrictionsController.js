const axios = require('axios');
const { getIdJWT } = require('../Middlewares/jwt.js');

const createRestrictions = async (req, res) => {
    try {
        const { studentIds, reason } = req.query; // Obtener los parámetros desde req.query

        // Verificar que los datos necesarios estén presentes
        if (!studentIds || !reason) {
            return res.status(400).json({
                error: true,
                message: 'Faltan datos: studentIds o reason.',
            });
        }

        // Convertir studentIds en un array
        const studentIdsArray = studentIds.split(',');

        // Aplicar restricciones
        const response = await applyRestrictions(studentIdsArray, reason);

        // Verificar si hay alguna respuesta válida
        if (!response || response.length === 0) {
            return res.status(500).json({
                error: true,
                message: 'No se pudieron aplicar las restricciones.',
            });
        }

        const errorResponses = [];
        const successResponses = [];

        for (const resp of response) {
            if (resp.error == true) {
                errorResponses.push(resp);
            } else {
                // Extrae solo la información relevante de la respuesta Axios
                successResponses.push({
                    success: true,
                    message: response.message || 'La calificación se ha asignado correctamente.',
                    restriction: {
                        response,
                    }
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Solicitud completada',
            errorResponses,
            successResponses,
        });

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({
                error: true,
                message: data.message || 'Error al crear la restricción.',
            });
        } else {
            return res.status(500).json({
                error: true,
                message: 'Error del servidor: ' + error.message,
            });
        }
    }
};

const deleteRestrictions = async (req, res) => {
    try{
        const { idRestriction } = req.body;

        const response = await axios.delete(`https://api-restrictions.onrender.com/restrictions/delete/${idRestriction}`);
        console.log('Response: ', response.data);


    } catch (error) {

        console.log('Error al eliminar restricción: ', error);
        if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({
                error: true,
                message: data.message || 'Error al eliminar la restricción.',
            });
        } else {
            return res.status(500).json({
                error: true,
                message: 'Error del servidor: ' + error.message,
            });
        }
    };
}

const applyRestrictions = async (studentIdsArray, reason) => {
    const ResponsesList = [];
    try {
        // Iterar sobre cada studentId para verificar si el usuario existe
        for (const studentId of studentIdsArray) {
            const userExist = await verifyUserExist(studentId);
            if (!userExist) {
                ResponsesList.push({
                    error: true,
                    message: 'Usuario no encontrado id: ' + studentId,
                });
                continue;
            }

            // Hacer la solicitud para cada ID de usuario
            const response = await axios.post(`https://api-restrictions.onrender.com/restrictions/assign`, null, {
                params: { studentId, reason },
            });

            console.log('Response: ', response.data);

            const {_id} = await getUser(studentId);

            const sync = await axios.post('https://codelsoft-search-service.onrender.com/api/restrictions/create',{
                studentId:_id,
                reason
            });

            console.log (response);
            // Verificar si la respuesta fue exitosa y agregar al ResponsesList
            if (response.status == 200) {
                ResponsesList.push(response.data);
                
            } else {
                ResponsesList.push({
                    error: true,
                    message: 'Error al asignar restricción a id: ' + studentId,
                });
            }
        }
    } catch (error) {
        console.log('Error al aplicar restricciones: ', error.message);
    }

    return ResponsesList; // Retornar la lista de respuestas
};

const verifyUserExist = async (studentId) => {
    try {
        const response = await axios.get('https://codelsoft-user-service.onrender.com/api/student');
        const users = response.data;
        const user = users.find(user => user.uuid === studentId);
        return !!user;
    } catch (error) {
        console.log('Error al verificar el usuario: ', error.message);
        return false;
    }
};

const getUser = async (studentId) => {
    try {
        const response = await axios.get('https://codelsoft-user-service.onrender.com/api/student');
        const users = response.data;
        const user = users.find(user => user.uuid === studentId);
        const responseSearch = await axios.get('https://codelsoft-search-service.onrender.com/api/users/all');

        for (const userr of responseSearch.data.data){
            if(user.email === userr.email){
                console.log('userr: ', userr);
                return userr;
            }
        }


    } catch (error) {
        console.log('Error al obtener el usuario: ', error.message);
        return null;
    }
}

module.exports = { createRestrictions, deleteRestrictions };
