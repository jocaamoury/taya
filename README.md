# TAYA BACKEND HOMEWORK

💫 Bem-vindo(a)! 🎉

Este exercício de back-end envolve a criação de um aplicativo Node.js/NestJS que fornecerá uma API REST para controle de crédito. Esperamos que você dedique cerca de 3 horas para implementar este recurso.

## Modelos de Dados

> **Todos os modelos estão definidos em src/model.js**

### Customer (cliente)

Um cliente pode ter uma proposta;
Cada cliente possui um saldo.

### Proposal (proposta)

Uma proposta para um cliente, cadastrado por um usuário.
A proposta têm 3 status: PENDING, REFUSED, ERROR, SUCCESSFUL.
propostas são ativas apenas no status PENDING.

### User (usuário)

Usuários cadastram clientes e criam propostas.

## Configuração Inicial

O exercício requer [Node.js](https://nodejs.org/en/) 16. Recomendamos a versão LTS.

1. Crie um repositório local para este projeto.

1. No diretório raiz, execute `npm install` para coletar todas as dependências.

1. Garanta que o nest esteja instalado na sua maquina executando, `npm i -g @nestjs/cli`.

1. Use, `npm run migration:run` para popular o banco de dados SQLite local. **Alerta: Isso eliminará o banco de dados se ele existir**. O banco de dados fica no arquivo `database.sqlite3`.

1. Execute `npm run start:dev` para iniciar o servidor.

❗️ **Certifique-se de commitar todas as alterações na branch master!**

## Notas Técnicas

- O provedor de banco de dados é o SQLite, que armazenará os dados em um arquivo local no seu repositório chamado database.sqlite3. Você só precisará interagir com o ORM [TypeORM](https://typeorm.io/) - **por favor, dedique algum tempo para ler a documentação do TypeORM antes de começar o exercício.**

- Para autenticar usuários, utilize o middleware getProfile que está localizado em ./get-user-middleware.ts. Os usuários são autenticados passando `user_id` no cabeçalho da solicitação. Após um usuário ser autenticado, seu perfil estará disponível em `req.user`.
- O servidor roda na porta 3005.

## APIs a Implementar

Abaixo está uma lista das APIs necessárias para o aplicativo.

1. **_GET_** `/proposals/:id` - Corrigir a API para retornar a proposta apenas se pertencer ao user que está chamando.

1. **_GET_** `/proposals` - Retorna lista de proposals pendentes de um user.

1. **_GET_** `/proposals/refused` - Obter propostas rejeitadas criadas por um user.

1. **_POST_** `/proposals/:proposal_id/approve` - Dado uma proposta pendente, aprovar a proposta por id, retornar a proposta atualizada, valor do profit deve ser creadita no usuario que executou a operacao.

1. **_GET_** `/admin/profit-by-status` - Retorna a soma do profit de todas as propostas por usuario agrupada por status.

1. **_GET_** `/admin/best-users?start=<date>&end=<date>` - Retorna os users que possuem o maior profit de propostas em sucesso vinculado.

```
 [
    {
        "id": 1,
        "fullName": "Rehan Howe",
        "totalProposal" : 100.3
    },
    {
        "id": 2,
        "fullName": "Milo Wright",
        "totalProposal" : 99
    },
    {
        "id": 3,
        "fullName": "Freyja Long",
        "totalProposal" : 21
    }
]
```

## Indo Além dos Requisitos

Dada a expectativa de tempo deste exercício, não esperamos que alguém entregue algo muito sofisticado, mas se você encontrar tempo extra, qualquer item adicional que destaque suas habilidades únicas seria incrível! 🙌

Seria ótimo, por exemplo, se você escrevesse alguns testes unitários ou uma demonstração simples no frontend mostrando chamadas para suas novas APIs.

## Enviando a Tarefa

Quando você terminar a tarefa, compacte o seu repositório (certifique-se de incluir a pasta .git) e nos envie o arquivo zipado.

Obrigado e boa sorte! 🙏
