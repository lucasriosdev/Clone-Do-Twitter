let usuarioLogado = '';

document.getElementById('entrar').addEventListener('click', async function () {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  if (usuario !== '' && senha !== '') {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await res.json();

    if (data.success) {
      usuarioLogado = usuario;
      mostrarAlerta('Login realizado com sucesso!');
      document.getElementById('loginBox').style.display = 'none';
    } else {
      mostrarAlerta(data.message);
    }
  } else {
    mostrarAlerta('Preencha todos os campos para logar!');
  }
});

document.getElementById('btnPostar').addEventListener('click', async function () {
  const mensagem = document.getElementById('mensagem').value;

  if (usuarioLogado === '') {
    mostrarAlerta('Você precisa logar para postar!');
    return;
  }

  if (mensagem === '') {
    mostrarAlerta('Escreva algo antes de postar!');
    return;
  }

  const res = await fetch('/postar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuarioLogado, mensagem })
  });

  const data = await res.json();

  if (data.success) {
    mostrarAlerta('Postagem realizada com sucesso!');
    document.getElementById('mensagem').value = '';
  } else {
    mostrarAlerta(data.message);
  }
});

document.getElementById('btnLogin').addEventListener('click', function () {
  document.getElementById('loginBox').style.display = 'flex';
});

function mostrarAlerta(mensagem) {
  const alerta = document.getElementById('alerta');
  document.getElementById('alertaMensagem').innerText = mensagem;
  alerta.style.display = 'block';
}

function fecharAlerta() {
  document.getElementById('alerta').style.display = 'none';
}
