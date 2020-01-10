const https = require('https');
const http = require('http');
let requester;
if(process.env.SITE_DOMAIN_ROOT.indexOf('localhost') !== -1) {
    requester = http;
} else {
    requester = https;
}
(async () => {
    let safeToDeploy = false;
    let first = true;
    while(!safeToDeploy) {
        if (!first) {
            await new Promise(resolve => {
                setTimeout(resolve, 1000);
            });
        }
        first = false;
        const attempt = new Promise((resolve, reject) => {
            requester.get(`${process.env.SITE_DOMAIN_ROOT}/api/prevent-transactions`, {
                headers: {
                    preventtransactionkey: process.env.DEPLOYMENT_KEY,
                    Accept: 'text/plain',
                }
            }, (resp) => {
              let data = '';
            
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
            
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                  if(data === 'Bad Request') {
                      console.log("Server is not ready to restart yet...");
                  } else {
                    console.log(data + ': Good to restart!');
                    safeToDeploy = true;
                  }
                resolve();
              });
            
            }).on("error", (err) => {
                if(err.message.indexOf('ECONNREFUSED') !== -1) {
                    console.log(err);
                    console.log("Thinks service is already off, so passing");
                    safeToDeploy = true;
                    resolve();
                    return;
                }
                resolve();
                console.log("Error: " + err.message);
            });
        });
        await attempt;
    }
})();


