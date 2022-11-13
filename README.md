# API hexagonal em node.js
Este projeto foi criado por motivos acadêmicos mostrando um pouco o que aprendi estudando a arquitetura [hexagonal](https://medium.com/tableless/desvendando-a-arquitetura-hexagonal-52c56f8824c)

## Screenshots
App view:
![App UI](/app.png)

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Setup Data base and Initial Data
``` sh
npm run setup:up
```

#### 3) Iniciar Projeto
``` sh
npm run dev
# verificar a url http://localhost:3000/v1/graphqlou http://localhost:${customPort}/v1/graphql
```

#### 4) Iniciar projeto no docker
``` sh
docker-compose up -d 
```
Obs: Deixei uma aquivo de [DockerCompose](https://docs.docker.com/compose/) para que a utilização deste projeto seja mais simples

#### 5) Iniciar task via CLI
``` sh
npm run cli
# lista jobs configurados
```

``` sh
npm run cli -- contact-create
# executa job configurado
```

## Topicos Extras

#### 1) i18n
Como sempre gosto de deixar meus projetos sempre da melhor forma possivel. 
Decidir implementar trandução e feedback de erros. todos os arquivos de configuração de tradução estão 
localizados em `./src/interface/http/middleware/i18n/**`

### Como alterar language
deixei 2º(duas) posibilidades pre configuradas "en-US" e "pt-BR" para alterar a linguagem de retorno da api basta informa por
- header (accept-language)
- queryParams (lang)

#### 2) Queue
E sempre bom estar preparado para tudo como a ideia de programação assíncrona salva agente muitos gargalos de processamento
deixei configurado o comsumo de produção de queue com [amqp](https://www.amqp.org/) arquivos de consumo estão localizados em
`./src/interface/amqp/**`

#### 3) Cache
Claro que uma api digina precisa de cache como vou economizar custos sem isso... para isso decidi utilizar [redis](https://redis.io/)
o arquivo de configuração estão localizado em `./src/interface/http/graphql/helpers/cache.ts` por padrão cache será de 5m. 
caso de uso esta localizado em `./src/interface/http/graphql/query/resolvers/contact.ts`

#### 4) Logger Request
Bem se loggers e debbuger são ferramentas que utilizamos para achamos os problemas... então de desenvolvimento criar os problemas ?
Para esse caso de logger decidi utilizar minha propria lib [@ismaelalves/logger](https://www.npmjs.com/package/@ismaelalves/logger) 
nela eu disponho integrações com [express](https://expressjs.com/pt-br/) e [axios](https://axios-http.com/docs/intro) acho que uma das
principais diferença que fiz foi que por padrão eu já omito algumas informações sigilosas como 'passwords', 'secrets', 'authorization', 'apiKey' etc...
alem de prover um idenficador unico que pode ser utilizado para verificar todos os passo de saida e entrada da aplicação.

#### 5) Segurança
Acho um ponto muito importante os desenvolvedores se atentarem a possiveis vulnerabilidades de sua aplicação para isso me utilizei de algumas libs
- [hide-powered-by](https://www.npmjs.com/package/hide-powered-by)
- [x-xss-protection](https://www.npmjs.com/package/x-xss-protection)
- [helmet](https://helmetjs.github.io/)

Tambem que deixei pre-configurado gerenciadores de credencias como [vault](https://www.vaultproject.io/) que dará up de
segurança em suas credencias.


#### 6) Docker
Deixei configurado um Dockerfile ja pronto para realizar o build do projeto. tambem deixei um docker-security pra realizar testes de segurança 
no script de build do dockerfile com a ferramenta [conftest](https://github.com/open-policy-agent/conftest).

```sh
npm run conftest
```

#### 7) Helm
Deixei configurado o [helm](https://helm.sh/) para que sejá possivel trabalhar com [kubernetes](https://kubernetes.io/pt-br/).
os respectivos arquivos estão localizados em `./scripts/helm/**`

## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit) 🤓🤓🤓

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).

