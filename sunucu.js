const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const root = path.resolve(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
function send(res,status,body,type='text/plain; charset=utf-8',extra={}) {res.writeHead(status,{'Content-Type':type,...extra});res.end(body);}
const server = http.createServer(async (req,res)=>{
  const url = new URL(req.url,'http://localhost:3000');
  console.log(req.method,url.pathname+url.search);
  if(req.method!=='GET') return send(res,405,'Yönteme izin verilmiyor','text/plain; charset=utf-8',{'Allow':'GET'});
  if(url.pathname==='/api/etkinlikler'||/^\/api\/etkinlikler\/\d+$/.test(url.pathname)){
    try {
      const items=JSON.parse(await fs.readFile(path.join(__dirname,'etkinlikler.json'),'utf8'));
      if(url.pathname==='/api/etkinlikler') return send(res,200,JSON.stringify(url.searchParams.has('tur')?items.filter(x=>x.tur===url.searchParams.get('tur')):items),'application/json; charset=utf-8');
      const id=Number(url.pathname.split('/').pop()); const item=items.find(x=>x.id===id);
      return send(res,item?200:404,JSON.stringify(item||{hata:'Etkinlik bulunamadı'}),'application/json; charset=utf-8');
    }catch(err){console.error(err);return send(res,500,JSON.stringify({hata:'Sunucu hatası'}),'application/json; charset=utf-8');}
  }
  let relative;
  try {relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);}catch{return send(res,400,'Geçersiz yol');}
  const target=path.resolve(root,'.'+relative);
  if(!target.startsWith(root+path.sep)) return send(res,404,'Sayfa bulunamadı');
  if(!types[path.extname(target)]) return send(res,404,'Sayfa bulunamadı');
  try {send(res,200,await fs.readFile(target),types[path.extname(target)]);}catch{return send(res,404,'Sayfa bulunamadı');}
});
server.listen(3000,()=>console.log('http://localhost:3000'));
