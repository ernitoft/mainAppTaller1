const jwt = require('jsonwebtoken');

/**
 * Obtiene el uuid del usuario a partir del token JWT.
 * @param {string} token - El token JWT.
 * @returns {string} El ID del usuario.
 */
const getIdJWT = (token) => {
    const secret = process.env.SECRET;
    const { uuid, email } = jwt.verify(token, secret);

    return uuid;
}

/**
 * Genera un nuevo token JWT para el usuario.
 * @param {string} email - El email del usuario.
 * @returns {Promise<string>} El token JWT generado.
 */
const generateToken = (email = '', uuid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { email, uuid };

        jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' }, (error, token) => {
            if (error) {
                reject('No se pudo generar el token: ', error);
            }
            else {

                resolve(token);

            }
        });
    });
}

/**
 * Middleware para validar el token JWT en las solicitudes HTTP.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de siguiente middleware.
 * @returns {Promise<void>}
 */
const validateJWT = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                msg: 'No se ha proporcionado un token de autenticación'
            });
        }

        const { email } = jwt.verify(token, process.env.SECRET);

        if (!email) {
            return res.status(401).json({
                error: true,
                msg: 'Token inválido'
            });
        }

        const user = getUser(email);

        if (!user) {
             return res.status(401).json({
                 error: true,
                 msg: 'Token inválido, usuario no encontrado'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                msg: 'Token expirado'
            });
        }
        return res.status(401).json({
            error: true,
            msg: 'Token no válido',
        });
    }
};

const getUser = async (email) => {
    try {
        const response = await axios.get('https://codelsoft-user-service.onrender.com/api/teaching');
        const users = response.data;
        const user = users.find(user => user.email === email);

        if (!user) {
            return null;
        }
        return user;

    } catch (error) {
        console.log('Error al obtener el usuario: ', error.message);
        return null;
    }
}




module.exports = { validateJWT, getIdJWT, generateToken };
