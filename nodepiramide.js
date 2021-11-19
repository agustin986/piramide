const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
  const objetourl = url.parse(pedido.url);
let camino='public'+objetourl.pathname;
if (camino=='public/')
  camino='public/index.html';
encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
console.log('Listening on port %d', server_port);
});

function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/piramide':{
      recuperar(pedido,respuesta);
      break;
    }	
    default:{  
      fs.stat(camino, error => {
        if(!error){
        fs.readFile(camino,(error, contenido) => {
          if(error){
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          }
          else{
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      }
      else{
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}
function Piramide(n) {
  var contenido="";
  for(var i=1;i<=n;i++){
    contenido+="<br>";
       for(var z=1;z<=2*i-1;z++){
        
         if (z%2==0) {
          contenido+=" . "; 
         } else {
          contenido+="*"; 
         }
    
       }
       contenido+="<br>";
       }
    return contenido;
}
function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var n= parseInt(formulario['num']);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=
      `<!doctype html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Trabajo Final: Heroku</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.9.2/dist/css/uikit.min.css" />
            </head>
            <body>
              <div>
                <h1 class="uk-text-large uk-text-center uk-margin-xlarge-top uk-text-danger"><i>Formulario Piramide</i></h1>
              </div>
              <pre class="uk-text-center" style="margin-top:30px">`
                +Piramide(n)+`
              </pre>
            </body>
          </html>`;          
    respuesta.end(pagina);
  });	
}

console.log('Servidor web iniciado');