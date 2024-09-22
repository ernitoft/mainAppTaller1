
express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const logger = require('morgan');

class Server {
    constructor() {
        this.app = express();
        this.secret = this.secretGenerate();
        this.port = process.env.PORT;
        process.env.SECRET = this.secret;
        this.Server = require('http').createServer(this.app);

        // Rutas de la API
        this.paths = {
            auth: '/api/auth',
            grades: '/api/grades',
            users: '/api/users',
            restrictions: '/api/restrictions',
            search: '/api/search',
        }

        // Middlewares
        this.middlewares();

        // Rutas de la API
        this.routes();

    }

    // Método para configurar las rutas
    routes(){
        this.app.use(this.paths.auth, require('../Routes/authRoutes'));
        this.app.use(this.paths.grades, require('../Routes/gradesRoutes'));
        this.app.use(this.paths.users, require('../Routes/usersRoutes'));
        this.app.use(this.paths.restrictions, require('../Routes/restrictionsRoutes'));
        this.app.use(this.paths.search, require('../Routes/searchRoutes'));
    }

    // Método para configurar los middlewares
    middlewares() {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(cors());
    }

    // Método para iniciar el servidor
    listen() {
        this.Server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    // Método para generar un secreto aleatorio para JWT
    secretGenerate() {
        const newSecret = crypto.randomBytes(32).toString('Hex');
        return newSecret;
    }

    // Método para obtener el secreto generado
    getSecret() {
        return this.secret;
    }

}

module.exports = Server;