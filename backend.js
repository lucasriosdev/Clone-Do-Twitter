const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;

// Função para carregar o "banco de dados" (JSON)
function carregarUsuarios() {
  const dados = fs.readFileSync('usuarios.json');
  return JSON.parse(dados);
}

// Função para salvar no "banco de dados"
function salvarUsuarios(usuarios) {
  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Arquivo não encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }

  // Receber login e postagem
  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);
      const usuarios = carregarUsuarios();

      if (req.url === '/login') {
        const { usuario, senha } = data;
        const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
        if (user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Login bem-sucedido!' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Usuário ou senha incorretos.' }));
        }
      }

      else if (req.url === '/postar') {
        const { usuario, mensagem } = data;
        if (usuario && mensagem) {
          const user = usuarios.find(u => u.usuario === usuario);
          if (user) {
            user.posts.push(mensagem);
            salvarUsuarios(usuarios);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Postagem realizada com sucesso!' }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Usuário inválido.' }));
          }
        }
      }
    });
  }
});

server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
