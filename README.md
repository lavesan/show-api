## Pré requisitos

- node
- npm

## Executando

1. Crie um arquiv **.env** com as configurações do seu banco de dados, seguindo o model que existe em **.env.example**
2. Se seu banco não estiver com a tabela deste projeto, execute a migration para ele com o comando `npm run typeorm:run`
3. Na pasta do projeto, execute `npm i` para instalar as dependências
4. Execute `npm run start:dev` para executar na porta 3001

## Produção

1. Execute `npm run build` para criar o build do projeto
2. Execute `npm run start:prod` para rodar o projeto em produção
