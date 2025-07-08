// Referências aos elementos HTML principais
const formAdicionar = document.getElementById('form-adicionar');
const inputItem = document.getElementById('input-item');
const listaItens = document.getElementById('lista-itens');
const btnLimpar = document.getElementById('btn-limpar');
const contador = document.getElementById('contador-itens');
const filtro = document.getElementById('filtro-status');
const toggleTema = document.getElementById('toggle-tema');
const temaTexto = document.getElementById('tema-texto');

let itens = [];

// Salva a lista no localStorage
function salvarDados() {
  localStorage.setItem('listaCompras', JSON.stringify(itens));
}

// Atualiza o contador de itens na tela
function atualizarContador() {
  contador.textContent = `Total: ${itens.length} item(ns)`;
}

// Remove item pelo índice
function removerItem(index) {
  itens.splice(index, 1);
  salvarDados();
  renderizarLista();
}

// Renderiza lista na tela
function renderizarLista() {
  listaItens.innerHTML = '';

  let itensFiltrados = [...itens];
  const statusSelecionado = filtro.value;

  if (statusSelecionado === 'comprados') {
    itensFiltrados = itensFiltrados.filter(item => item.comprado);
  } else if (statusSelecionado === 'pendentes') {
    itensFiltrados = itensFiltrados.filter(item => !item.comprado);
  }

  itensFiltrados.forEach(itemFiltrado => {
    const index = itens.findIndex(
      itemOriginal =>
        itemOriginal.nome === itemFiltrado.nome &&
        itemOriginal.comprado === itemFiltrado.comprado
    );

    const li = document.createElement('li');
    li.classList.toggle('comprado', itemFiltrado.comprado);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = itemFiltrado.comprado;
    checkbox.title = 'Marcar como comprado';
    checkbox.addEventListener('change', () => {
      itens[index].comprado = checkbox.checked;
      salvarDados();
      renderizarLista();
    });

    const span = document.createElement('span');
    span.textContent = itemFiltrado.nome;
    span.title = 'Clique para marcar/desmarcar como comprado';
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      itens[index].comprado = !itens[index].comprado;
      salvarDados();
      renderizarLista();
    });

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'X';
    btnRemover.title = 'Remover item';
    btnRemover.addEventListener('click', () => {
      removerItem(index);
    });

    li.append(checkbox, span, btnRemover);
    listaItens.appendChild(li);
  });

  atualizarContador();
}

// Adiciona item
formAdicionar.addEventListener('submit', event => {
  event.preventDefault();
  const nomeItem = inputItem.value.trim();
  if (!nomeItem) return;

  itens.push({ nome: nomeItem, comprado: false });
  salvarDados();
  renderizarLista();
  inputItem.value = '';
  inputItem.focus();
});

// Limpa lista
btnLimpar.addEventListener('click', () => {
  if (confirm('Deseja limpar toda a lista?')) {
    itens = [];
    salvarDados();
    renderizarLista();
  }
});

// Filtro
filtro.addEventListener('change', renderizarLista);

// Alterna tema claro/escuro e texto
toggleTema.addEventListener('change', () => {
  if (toggleTema.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('tema', 'dark');
    temaTexto.textContent = '🌙';
  } else {
    document.body.classList.remove('dark');
    localStorage.removeItem('tema');
    temaTexto.textContent = '☀️';
  }
});

// Carrega lista e tema
window.addEventListener('load', () => {
  const dadosSalvos = localStorage.getItem('listaCompras');
  if (dadosSalvos) {
    itens = JSON.parse(dadosSalvos);
  }
  renderizarLista();

  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'dark') {
    document.body.classList.add('dark');
    toggleTema.checked = true;
    temaTexto.textContent = '🌙';
  } else {
    temaTexto.textContent = '🌞';
  }
});
