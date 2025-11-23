(async ()=>{
  const log = (label, status, body)=> console.log(`=== ${label} ===\nStatus: ${status}\n${body}\n`);
  try{
    const hres = await fetch('http://localhost:4000/healthz');
    const htext = await hres.text();
    log('HEALTH', hres.status, htext);
  } catch(e){ console.error('HEALTH failed', e.message); }

  try{
    const cres = await fetch('http://localhost:4000/api/links',{ method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ target: 'https://example.com/test-from-check', code: null }) });
    const ctext = await cres.text();
    log('CREATE', cres.status, ctext);
  } catch(e){ console.error('CREATE failed', e.message); }

  try{
    const lres = await fetch('http://localhost:4000/api/links');
    const ltext = await lres.text();
    log('LIST', lres.status, ltext);
  } catch(e){ console.error('LIST failed', e.message); }

  try{
    const hosts = ['http://localhost:5173/','http://127.0.0.1:5173/'];
    for(const h of hosts){
      try{
        const fres = await fetch(h);
        console.log('FRONTEND', h, '=>', fres.status);
        break;
      } catch(e){
        console.error('FRONTEND failed for', h, e.message);
      }
    }
  } catch(e){ console.error('FRONTEND failed', e.message); }

})();
