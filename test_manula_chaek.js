const http = require('http');
const PORT = process.env.PORT || 4000;


function checkHealth() {
return new Promise((res) => {
http.get(`http://localhost:${PORT}/healthz`, (r) => {
let data=''; r.on('data', c=>data+=c); r.on('end', ()=>res({status: r.statusCode, body: data}));
}).on('error', (e) => res({error: e}));
});
}


(async ()=>{
const result = await checkHealth();
console.log('Health check result:', result);
})();