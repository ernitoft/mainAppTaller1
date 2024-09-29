const { default: axios } = require("axios");

const searchBad = async () => {
    const url = 'https://codelsoft-search-service.onrender.com/api/search/grade'
    try{
        const response = await axios.get(url,
            { params: {
                minGrade: 1,
                maxGrade: 4
            }}
        )
        return response.data.data;
    }catch(error){
        console.log('Error al buscar malos: ', error);
        return [];
    }
}

const searchRegular = async () => {
    const url = 'https://codelsoft-search-service.onrender.com/api/search/grade'
    try{
        const response = await axios.get(url,
            { params: {
                minGrade: 4.1,
                maxGrade: 5
            }}
        )
        return response.data.data;
    }catch(error){
        console.log('Error al buscar regulares: ', error);
        return [];
    }
}

const searchGood = async () => {
    const url = 'https://codelsoft-search-service.onrender.com/api/search/grade'
    try{
        const response = await axios.get(url,
            { params: {
                minGrade: 5.1,
                maxGrade: 6
            }}
        )
        return response.data.data;
    }catch(error){
        console.log('Error al buscar buenos: ', error);
        return [];
    }
}

const searchExcellent = async () => {
    const url = 'https://codelsoft-search-service.onrender.com/api/search/grade'
    try{
        const response = await axios.get(url,
            { params: {
                minGrade: 6.1,
                maxGrade: 7
            }}
        )
        return response.data.data;
    }catch(error){
        console.log('Error al buscar excelentes: ', error);
        return [];
    }
}

const listSearchByGrade = async (req, res) => {
    const Excellent = [];
    const Good = [];
    const Regular = [];
    const Bad = [];

    try{
        
        Bad = await searchBad();
        if (Bad.length !== 0){
            for (const user of Bad){
                Bad.push(user);
            }
        }

        Regular = await searchRegular();
        if (Regular.length !== 0){
            for (const user of Regular){
                Regular.push(user);
            }
        }

        Good = await searchGood();
        if (Good.length !== 0){
            for (const user of Good){
                Good.push(user);
            }
        }
        Excellent = await searchExcellent();
        if (Excellent.length !== 0){
            for (const user of Excellent){
                Excellent.push(user);
            }
        }


        return res.status(200).json({
            error: false,
            message: 'Búsqueda por grado exitosa',
            data: [
                {
                    grade: 'Excelente',
                    students: Excellent
                },
                {
                    grade: 'Bueno',
                    students: Good
                },
                {
                    grade: 'Regular',
                    students: Regular
                },
                {
                    grade: 'Malo',
                    students: Bad
                }
            ]
        });

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
            error
        });
    }
};

module.exports = {listSearchByGrade};