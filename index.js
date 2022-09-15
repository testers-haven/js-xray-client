const {Client} = require("./client");
const {Worker} = require("./worker");
const {AllureWorker} = require("./allure_worker");

async function reportToXrayWithAllureReport(options) {
    try {
        let allureWorker = new AllureWorker();
        let suites = await allureWorker.generateSuitesFromAllureXml(options.resultsFolder);

        let worker = new Worker();
        await worker.checkOptions(options);
        let requestBody = worker.generateXrayRequestFromAllureJson(suites, options);

        const client = new Client(options.host);
        if(options.security){
            await client.login(options.security.client_id, options.security.client_secret);
        }

        return await client.sendResultsAsXrayJson(JSON.stringify(requestBody));
    } catch (e) {
        console.error('Reports were not uploaded to Xray due error: ', e.message);
    }
}

async function reportToXrayWithJunitReport(options) {
    try {
        let worker = new Worker();
        await worker.checkOptions(options);
        let requestBody = worker.generateXmlRequestBody(options.resultsFolder, options.fileName);

        const client = new Client(options.host);
        if(options.security){
            await client.login(options.security.client_id, options.security.client_secret);
        }

        await client.sendResultsAsJunitReport(options.project, options.testPlan, requestBody);
    } catch (e) {
        console.error('Reports were not uploaded to Xray due error: ', e.message);
    }
}

module.exports = { reportToXrayWithJunitReport , reportToXrayWithAllureReport};