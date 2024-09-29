const { default: axios } = require("axios");

const listSearchByGrade = async (req, res) => {
    const Excellent = [];
    const Good = [];
    const Regular = [];
    const Bad = [];
    
    try{

        const studentsByRange = await axios.get('https://codelsoft-search-service.onrender.com/api/search/',
            {params: {
                grade: gradeIterator
            }},
        )


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