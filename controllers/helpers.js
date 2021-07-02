const apiAdapter = require('../routes/apiAdapter');
const { URL_SERVICE_CLASS } = process.env;

const api = apiAdapter(URL_SERVICE_CLASS);

module.exports = async (req,res) => {
   // console.log(req);
    try{
        const studentCourse = await api.post('/api/students-courses/premium-access', req);
        //console.log(studentCourse);
        return studentCourse;

    }catch (err){
        if(err.code ==="ECONNREFUSED"){
            return res.status(500).json({
                status: 'error',
                message: 'Service Not Found (unavailable)'
            })
        }
        const {status, data} = err.response;
        return res.status(status).json(data);
    }
       
}
