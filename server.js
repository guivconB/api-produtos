// server.js
const express = require('express');
const app = express();

app.use(express.json()); // para ler JSON no corpo das requisições

// Array em memória (questão 3)
const produtos = [];

/*
POST /produtos
Adiciona um produto enviado no corpo: { id, nome, preco }
Retorna 201 + produto cadastrado ou 400 em caso de erro.
*/
app.post('/produtos', (req, res) => {
  const { id, nome, preco } = req.body;

  if (id === undefined || nome === undefined || preco === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id, nome, preco' });
  }

  // Verifica duplicidade de id
  const existe = produtos.find(p => String(p.id) === String(id));
  if (existe) {
    return res.status(400).json({ erro: 'Já existe um produto com esse id' });
  }

  const produto = { id, nome, preco };
  produtos.push(produto);
  return res.status(201).json(produto);
});

/*
GET /produtos
Lista todos os produtos cadastrados.
*/
app.get('/produtos', (req, res) => {
  return res.json(produtos);
});

/*
PUT /produtos/:id
Atualiza um produto específico com novos dados do corpo (nome e/ou preco).
Retorna 200 + produto atualizado ou 404 se não encontrado.
*/
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  const index = produtos.findIndex(p => String(p.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  // Atualiza somente os campos informados
  if (nome !== undefined) produtos[index].nome = nome;
  if (preco !== undefined) produtos[index].preco = preco;

  return res.json(produtos[index]);
});

/*
DELETE /produtos/:id
Remove produto com base no id e retorna confirmação em JSON.
*/
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => String(p.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const removed = produtos.splice(index, 1)[0];
  return res.json({ mensagem: `Produto com id ${removed.id} removido com sucesso.` });
});

// Rota raiz para checar servidor (opcional)
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Produtos funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    