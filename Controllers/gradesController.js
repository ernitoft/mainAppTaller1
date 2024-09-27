const { default: axios } = require("axios");
const { getIdJWT } = require('../Middlewares/jwt.js');

const Assign = async (req, res) => {
    try {
        const data = req.body;

        // Si es un array, procesar múltiples calificaciones
        if (Array.isArray(data)) {
            const responses = await sendIndividualGrade(data);

            if (responses.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: 'Ninguna calificación se ha asignado correctamente.',
                });
            }

            const errorResponses = responses.filter(response => response.error === true);
            const successResponses = responses.filter(response => response.error === false);

            return res.status(200).json({
                success: true,
                message: 'Resultado de la asignación de calificaciones',
                errorResponses,
                successResponses,
            });
        } 
        // Procesar calificación individual
        else {
            const { subjectName, grade, gradeName, comment, studentId } = data;

            // Verificar que todos los datos necesarios estén presentes
            if (!subjectName || !grade || !gradeName || !comment || !studentId) {
                return res.status(400).json({
                    error: true,
                    message: 'Faltan datos para asignar la calificación.',
                });
            }

            // Obtener el token JWT del header de autorización
            const header = req.headers['authorization'];
            const token = header && header.split(' ')[1];
            const userId = getIdJWT(token); // Asumiendo que esta función extrae el userId del JWT

            if (!userId) {
                return res.status(401).json({
                    error: true,
                    message: 'Token de autenticación inválido o no proporcionado.'
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


const sendIndividualGrade = async (grades) => {
    const ResponsesList = [];

    for (const grade of grades) {
        if (!grade.subjectName || !grade.grade || !grade.gradeName || !grade.comment || grade.userId || grade.studentId) {
            ResponsesList.push({
                error: true,
                message: 'Faltan datos',
                gradeWithError: grade,
            });
        }

        const response = await axios.post('https://codelsoft-grades-service.onrender.com/api/grades', {
            subjectName: grade.subjectName,
            grade: grade.grade,
            gradeName: grade.gradeName,
            comment: grade.comment,
            userId: grade.userId,
            studentId: grade.studentId,
        });

        if (response.status !== 201) {
            ResponsesList.push({
                error: true,
                message: response.message,
                gradeWithError: grade,
            });
        }

        ResponsesList.push({
            success: true,
            message: 'La calificación se ha asignado correctamente.',
            grade: response,
        });
    };
};

module.exports = { Assign };