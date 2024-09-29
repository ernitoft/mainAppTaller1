const { default: axios } = require("axios");
const { getIdJWT } = require('../Middlewares/jwt.js');
const e = require("express");

const Assign = async (req, res) => {
    try {
        const data = req.body;
        const { subjectName, grade, gradeName, comment, studentId } = data;
        // Obtener el token JWT del header de autorización
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];

        const userId = getIdJWT(token);

        if (!userId) {
            return res.status(401).json({
                error: true,
                message: 'Token de autenticación inválido o no proporcionado.'
            });
        }
  

        // Si es un array, procesar múltiples calificaciones
        if (Array.isArray(data)) {
            const responses = await sendIndividualGrade(data, userId, studentId);
        

            if (responses.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: 'Ninguna calificación se ha asignado correctamente.',
                });
            }
        
            const errorResponses = [];
            const successResponses = [];
        
            for (const response of responses) {

                if (response.error) {
                    errorResponses.push(response);
                } else {
                    // Extrae solo la información relevante de la respuesta Axios
                    successResponses.push({
                        success: true,
                        message: response.message || 'La calificación se ha asignado correctamente.',
                        grade: {
                            response,
                        }
                    });
                }
            }
            return res.status(200).json({
                success: true,
                message: 'Resultado de la asignación de calificaciones',
                errorResponses,
                successResponses,
            });
        }
        
        // Procesar calificación individual
        else {
            // Verificar que todos los datos necesarios estén presentes
            if (!subjectName || !grade || !gradeName || !comment || !studentId) {
                return res.status(400).json({
                    error: true,
                    message: 'Faltan datos para asignar la calificación.',
                });
            }

            console.log('studentId individual: ', studentId);
            const isRestrictions = await axios.get('https://api-restrictions.onrender.com/restrictions/student/'+studentId);
            console.log('isRestrictions individual: ', isRestrictions.data);
    
            if (isRestrictions.data) {
                return res.status(400).json({
                    error: true,
                    message: 'El estudiante tiene restricciones.',
                });
            }
    

            // Hacer la solicitud para asignar la calificación
            const response = await axios.post('https://codelsoft-grades-service.onrender.com/grades', {
                subjectName,
                grade,
                gradeName,
                comment,
                userId,
                studentId,
            });

            if (response.status !== 201) {
                return res.status(400).json({
                    error: true,
                    message: response.data.message || 'Error al asignar la calificación.',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'La calificación se ha asignado correctamente.',
                grade: response.data,
            });
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 409) {
                return res.status(409).json({
                    error: true,
                    message: data.message || 'Conflicto: la calificación ya existe.',
                });
            }

            console.log('Error: ', error);
            return res.status(status).json({
                error: true,
                message: data.message || 'Error en la asignación de la calificación.',
            });
        } else {
            return res.status(500).json({
                error: true,
                message: 'Error del servidor: ' + error.message,
            });
        }
    }
};


const sendIndividualGrade = async (grades, userId) => {
    const ResponsesList = [];
    console.log('------------------ sendIndividualGrade ------------------');

    for (const grade of grades) {
        if (!grade.subjectName || !grade.grade || !grade.gradeName || !grade.comment || !grade.studentId) {
            console.log('Faltan datos');
            ResponsesList.push({
                error: true,
                message: 'Faltan datos',
                gradeWithError: grade,
            });
            continue;
        }
        
        // Verificar que el usuario exista
        const userExist = await verifyUserExist(grade.studentId); 
        if (!userExist) {
            ResponsesList.push({
                error: true,
                message: 'El usuario no existe.',
                gradeWithError: grade,
            });
            continue;
        }
        try {
            const isRestrictions = await axios.get('https://api-restrictions.onrender.com/restrictions/student/'+grade.studentId);

            if (Array.isArray(isRestrictions.data) && isRestrictions.data.length > 0) {
                ResponsesList.push({
                    error: true,
                    message: 'Error al asignar la calificación, el estudiante tiene restricciones.',
                    gradeWithError: grade,
                });
                continue;
            }

            const response = await axios.post('https://codelsoft-grades-service.onrender.com/grades', {
                subjectName: grade.subjectName,
                grade: grade.grade,
                gradeName: grade.gradeName,
                comment: grade.comment,
                userId: userId,
                studentId: grade.studentId,
            });

            const {_id} = await getUser(grade.studentId);

            const responseSearch = await axios.post('https://codelsoft-search-service.onrender.com/api/grades/create', {
                subjectName: grade.subjectName,
                grade: grade.grade,
                gradeName: grade.gradeName,
                comment: grade.comment,
                userId: userId,
                studentId: _id,
            });


            if (response.status !== 201) {
                ResponsesList.push({
                    error: true,
                    message: 'Error al asignar la calificación.',
                    gradeWithError: grade,
                });
            } else {
                ResponsesList.push({
                    success: true,
                    message: 'La calificación se ha asignado correctamente.',
                    grade: response.data,
                });
            }
        } catch (error) {
            ResponsesList.push({
                error: true,
                message: error.message,
                gradeWithError: grade,
            });
        }
    }

    return ResponsesList;
};


const verifyUserExist = async (studentId) => {
    try{
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
                return userr;
            }
        }

    } catch (error) {
        console.log('Error al obtener el usuario: ', error.message);
        return null;
    }
}

module.exports = { Assign };