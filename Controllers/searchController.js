const { default: axios } = require("axios");

const listSearchByGrade = async (req, res) => {
    const Excellent = [];
    const Good = [];
    const Regular = [];
    const Bad = [];

    const url = 'https://codelsoft-search-service.onrender.com/api/search/grade'
    try{
        const BadResponse = await axios.get(url,
            { params: {
                minGrade: 1,
                maxGrade: 4
            }},
        )

        const RegularResponse = await axios.get(url,
            { params: {
                minGrade: 4.1,
                maxGrade: 5
            }}
        )

        const GoodResponse = await axios.get(url,
            { params: {
                minGrade: 5.1,
                maxGrade: 6
            }}
        )

        const ExcellentResponse = await axios.get(url,
            { params: {
                minGrade: 6.1,
                maxGrade: 7
            }}
        )

        for (const user of ExcellentResponse.data.data){
            Excellent.push(user);
        }

        for (const user of GoodResponse.data.data){
            Good.push(user);
        }

        for (const user of RegularResponse.data.data){
            Regular.push(user);
        }

        for (const user of BadResponse.data.data){
            Bad.push(user);
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