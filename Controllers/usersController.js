

const createStudent = async (req, res) => {
    try{
        const {firstname, lastname, email} = req.body;

        if (!firstname || !lastname || !email){
            return res.status(400).json({
                error: true,
                message: 'Faltan datos',
            });
        }

        const createResponse = await axios.post('https://codelsoft-user-service.onrender.com/api/teaching', {
            firstname,
            lastname,
            email,
        });
        

        if (createResponse.status !== 201){
            return res.status(400).json({
                error: true,
                message: 'Error al crear estudiante',
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Estudiante creado',
        });


    }catch(error){
        return res.status(500).json({
            error: true,
            message: error.message,
        })
    }
};

module.exports = {createStudent}