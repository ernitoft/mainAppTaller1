const axios = require('axios');

const listSearchByGrade = (req, res) => {
    try{
        
        

    }catch(error){
        console.log('Error al listar búsqueda por grado: ', error);
        if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({
                error: true,
                message: data.message || 'Error al listar búsqueda por grado.',
            });
        }
        return res.status(500).json({
            error: true,
            message: 'Error al listar búsqueda por grado.',
        });
    }
};

module.exports = {listSearchByGrade};