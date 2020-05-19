const qs = require('qs')
const axios = require('axios');

const api = {
  post: async (endpoint, params) => {
    return await axios.post('http://localhost:4000/api' + endpoint, qs.stringify(params),
      { headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
  },
  get: async (endpoint, params = {}) => {
    return await axios.get('http://localhost:4000/api' + endpoint, {params: params})
  }
}

module.exports = api
