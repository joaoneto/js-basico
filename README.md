# JavaScript Básico

### Requisitos
- MongoDB

### Tasks
npm start

npm test

npm run watch

npm run dev

npm run lint

### Exemplos de chamadas na API

`/register`
```shell
curl --request POST \
  --url http://localhost:3000/register \
  --header 'content-type: application/json' \
  --data '{ "nome": "NOME", "senha": "SENHA", "email": "email@example.com" }'
```

`/login`
```shell
curl --request POST \
  --url http://localhost:3000/login \
  --header 'content-type: application/json' \
  --data '{ "email": "email@example.com", "senha": "SENHA" }'
```

`/user/ID`
```shell
curl --request GET \
  --url http://localhost:3000/user/7d69eaa0-bb2b-11e6-aee9-1f21e5b4269a \
  --header 'authorization: Bearer token'
```
