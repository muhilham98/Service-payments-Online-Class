const axios = require('axios');
const { TIMEOUT } = process.env;

module.exports = (url) => {
    return axios.create ({
        baseURL : url,
        timeout : parseInt(TIMEOUT)
    });
}