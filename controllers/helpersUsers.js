const apiAdapter = require('../routes/apiAdapter');
const { URL_SERVICE_USERS } = process.env;

const api = apiAdapter(URL_SERVICE_USERS);


module.exports = async (req,res) => {
    try{
        //console.log(req);
        //arr = ['607b2fd4fafd0a555887c323','607b2fd4fafd0a555887c323', '607b2fd4fafd0a555887c323'];
        //arr = [1,2,3];
        //console.log(typeof req[0]);
        const users = await api.get('/users', {
            params: {
                user_ids:req
            }
        });
        //console.log(users.data);
        return users.data;
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
