const axios = require('axios').default;

class Client {
  constructor(host) {
    axios.defaults.baseURL = host;
  }

  async login(client_id, client_secret) {
    let config = { headers: {'Content-Type': 'application/json'} };
    let loginResponse = (await axios.post(`/authenticate`, { client_id, client_secret }, config));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginResponse.data;
  }

  async sendResults(projectName, testplan = '', requestBody) {
    let config = { headers: {'Content-Type': 'text/xml'} };
    let path = `/import/execution/junit?projectKey=${projectName}` + (testplan !== '') ? `&testPlanKey=${testplan}` : '';
    return await axios.post(path, requestBody, config);
  }
}

module.exports = {Client}