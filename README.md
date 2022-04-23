# Tutorial para construção desta API 
# NodeJS + typescript

Este readme foi baseado em um projeto do vídeo de [@Andres Jesse](https://www.youtube.com/playlist?list=PLd4Jo6d-yhDLJcFlLzx4SR4WU8hVUmuSQ) e nos ensinamentos do curso [@Fabrica de aplicativos](https://www.instagram.com/sujeitoprogramador/).

Será utilizado a versão free do heroku para a hospedagem da API.

>Nota: Ao clonar este projeto você precisa criar manualmente o arquivo `.env`, conforme explica o tutorial a seguir.

## Ambiente e Ferramentas:

- Node.js: https://nodejs.org/en/
- Express: https://expressjs.com/
- Postgres: https://www.postgresql.org/
- Sequelize: https://sequelize.org/
- Heroku: https://heroku.com/
- JWT: https://jwt.io/


## **1. Configuração do Ambiente**

Crie uma conta (heroku.com), siga as orientações para instalação do heroku cli e, logo após, abra o prompt de comando e faça login:

`$ heroku login`

Crie uma nova pasta. Você pode nomear e preencher os dados como quiser, eu batizei este exemplo como ***tasklistapi***:

```
$ mkdir tasklistapi
$ cd tasklistapi
```

Dentro da pasta, clone este repositório:

```bash
# Clonando este repositório
$ git clone <https://github.com/ArthurFCouto/tasklistapi>

# Instale as dependências
$ npm install 
```

Os **scripts** de inicialização, desenvolvimento e build já estão configurados em `package.json`, não sendo necessário alterar.

```
{
 ...
 "scripts": {
    "dev": "ts-node-dev --inspect --transpile-only --ignore-watch node_modules src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
 ...
}
```

Execute o projeto (localhost):

`$ npm run dev`

Se tudo correu bem, você poderá fazer um teste acessando a rota via: POST http://localhost:3030/user

## **2. Hospedagem Heroku**

Agora vamos enviar o projeto ao Heroku. Faça o primeiro commit do projeto ao repositório git (local):

```
$ git add .
$ git commit -m 'initial commit'
```

Crie uma nova aplicação na plataforma Heroku (existe um máximo de 5 apps no plano grátis):

`$ heroku create`

Envie sua aplicação para execução:

`$ git push heroku master`

Se tudo correu bem, você poderá acessar a rota inicial via: POST https://SEU_APP.herokuapp.com/home

Nota: Como a rota */home* não existe, deverá ser apresentado o aviso informando sobre o erro 404.

## **3. Rotas e Controllers**

O projeto está segmentado por pastas e responsabilidades. O arquivo **routes.ts** é responsável pelas rotas, o **server.ts** pela inicialização do servidor e a pasta **app** contém as configurações, controllers, services, etc.

## **4. Banco de Dados**

Adicionar um banco **Postgres** ao projeto Heroku. Note que ***:hobby-dev*** é o plano grátis, usado neste tutorial:

`$ heroku addons:create heroku-postgresql:hobby-dev`

O banco de dados possui uma string de acesso (que deve ser secreta). Vamos adicionar a biblioteca **dotenv** para manter os dados seguros em variáveis de ambiente:

`$ npm install dotenv`

Crie o arquivo `.env` ("ponto" env), e adicione a variável de ambiente responsável pela conexão com o banco de dados do Heroku:

```
DATABASE_URL=postgres://**url do seu projeto**
```

A variável de ambiente `DATABASE_URL` é fornecida automaticamente no ambiente de produção (Heroku), mas não existe no ambiente local. Você pode obtê-la com o seguinte comando:

`$ heroku config:get DATABASE_URL`

Envie a nova versão para produção:

```
$ git add .
$ git commit -am 'initial database'
$ git push heroku master
```

Faça o teste: POST https://SEU_APP.herokuapp.com/user

## **5. Autenticação**

Para trabalhar com autenticação, precisamos de três bibliotecas: **permit**, responsável pelo processo de autenticação; **bcrypt**, responsável pela criptografia da senha dos usuários; e **jsonwebtoken** (JWT), responsável pela criação, assinatura e verificação de tokens.

**Importante**: apesar de o token ser codificado com uma chave de segurança `process.env.JWT_SECRET`, não é recomendado que se adicione dados sensíveis no payload (como a senha do usuário). Pense que este token é seguro, porém pode trafegar publicamente pela web.

Note que, em ambas as ações fizemos uso de uma chave de segurança `process.env.JWT_SECRET` e do prazo de expiração do token `process.env.JWT_EXPIRESIN`. Por questões de segurança, essa chave deve ser armazenada como variável de ambiente (não sendo visível no código e nem sendo enviada ao git). No arquivo `.env`, crie uma chave de segurança (pode ser qualquer coisa, mas use algo difícil de adivinhar, de preferência uma hash):

```
DATABASE_URL=postgres://**url do seu projeto**
JWT_SECRET=**SUA_HASH_DIFICIL_DE_ADIVINHAR**
JWT_EXPIRESIN=**Prazo de validade do token**
```

A configuração da chave de segurança no arquivo `.env` é suficiente para execução local, porém essa chave ainda não existe no servidor do Heroku (lembre-se, o `.env` não é enviado via git!). Vamos então criar uma variável de ambiente no Heroku:

`$ heroku config:set JWT_SECRET=**SUA_HASH_DIFICIL_DE_ADIVINHAR** `

`$ heroku config:set JWT_EXPIRESIN=**O prazo de válidade do token** `

Envie novamente o projeto ao Heroku:

```
$ git add .
$ git commit -m 'final version'
$ git push heroku master
```

Fim.