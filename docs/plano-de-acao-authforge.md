# Plano de Acao - AuthForge

## 1. Objetivo do Plano

Este plano organiza a execucao do AuthForge em fases praticas.

O objetivo e construir o projeto de forma progressiva, sem tentar criar uma alternativa completa a Auth0, Clerk ou Keycloak.

Fluxo principal que o MVP deve demonstrar:

```txt
Usuario cria conta
Usuario verifica email
Usuario faz login
Sistema cria sessao segura
Refresh token e rotacionado
Usuario cria organizacao
Usuario convida membro
Membro aceita convite
Roles e permissoes sao aplicadas
Client app e criado
Fluxo OAuth/OIDC-inspired emite tokens
Auditoria registra eventos sensiveis
```

## 2. Estrategia Geral de Execucao

O projeto deve ser construido por fatias verticais.

Cada fase deve entregar uma parte funcional, testavel e documentavel do sistema.

Ordem recomendada:

1. preparar repositorio, qualidade de codigo e padroes;
2. configurar infraestrutura local;
3. criar backend base;
4. implementar autenticacao base;
5. implementar verificacao de email e recuperacao de senha;
6. implementar sessoes e refresh token rotation;
7. implementar organizacoes e multi-tenancy;
8. implementar RBAC;
9. implementar convites;
10. implementar client apps;
11. implementar fluxo OAuth/OIDC-inspired;
12. implementar auditoria;
13. criar frontend;
14. cobrir regras criticas com testes;
15. polir documentacao para GitHub e LinkedIn.

## 3. Fase 0 - Preparacao do Projeto

### Objetivo

Preparar a base do repositorio e garantir qualidade desde o primeiro commit.

### Tarefas

- criar repositorio local do projeto;
- criar repositorio publico no GitHub;
- conectar repositorio local ao repositorio remoto;
- definir descricao curta do repositorio;
- escolher licenca;
- criar estrutura inicial de pastas;
- criar `.gitignore`;
- criar `.env.example`;
- definir monorepo com npm workspaces;
- criar `package.json` raiz;
- definir scripts npm principais;
- definir padrao de commits com Conventional Commits;
- definir estrategia de Semantic Versioning;
- configurar Husky;
- configurar commitlint;
- configurar lint-staged;
- configurar ESLint rigoroso;
- configurar regra para evitar `any`;
- configurar regra para proibir `console.log`;
- configurar padronizacao de imports;
- configurar Prettier;
- criar `.prettierrc`;
- criar README inicial simples;
- criar pasta `docs`;
- adicionar documento tecnico e plano de acao na pasta `docs`.

### Decisoes Recomendadas

- monorepo com `npm workspaces`;
- backend em `apps/api`;
- frontend em `apps/web`;
- documentacao em `docs`;
- PostgreSQL, Redis e Mailpit via Docker Compose;
- API NestJS e frontend Next.js rodando localmente via npm;
- Git hooks locais com Husky, commitlint e lint-staged.

### Entregaveis

- repositorio local criado;
- repositorio remoto criado no GitHub;
- estrutura base criada;
- README inicial;
- documentos versionados;
- hooks de commit configurados;
- lint e format configurados.

### Criterio de Pronto

O projeto deve clonar, instalar dependencias com npm, validar commits e ter uma estrutura clara mesmo antes das features existirem.

## 4. Fase 1 - Infraestrutura Local

### Objetivo

Criar o ambiente local para rodar as dependencias de infraestrutura.

### Tarefas

- criar `docker-compose.yml` apenas para PostgreSQL, Redis e Mailpit;
- configurar PostgreSQL;
- configurar Redis;
- configurar Mailpit;
- configurar variaveis de ambiente;
- documentar portas locais dos servicos;
- criar healthcheck basico da API;
- validar conexao da API com PostgreSQL;
- validar conexao da API com Redis;
- validar envio de email para Mailpit;
- documentar que API e frontend rodam fora do Docker com npm.

### Servicos no Docker Compose

- PostgreSQL;
- Redis;
- Mailpit.

### Servicos Rodando via npm

- API NestJS;
- Web Next.js.

### Entregaveis

- Docker Compose funcional apenas para PostgreSQL, Redis e Mailpit;
- `.env.example`;
- endpoint `GET /health`;
- envio de email local funcionando;
- instrucao no README para rodar localmente.

### Criterio de Pronto

Com um comando documentado, deve ser possivel subir PostgreSQL, Redis e Mailpit via Docker Compose. A API e o frontend devem rodar localmente com comandos npm documentados.

## 5. Fase 2 - Backend Base

### Objetivo

Criar a fundacao do backend com NestJS, Prisma, Zod, env validado, logger estruturado, seguranca basica e tratamento global de erros.

### Tarefas

- criar app NestJS;
- configurar Prisma;
- criar arquivo `env.ts`;
- validar todas as variaveis de ambiente com Zod;
- impedir a aplicacao de iniciar se faltar variavel obrigatoria;
- proibir fallback silencioso como `process.env.PORT || 3000`;
- configurar validacao de `body`, `params` e `query` com Zod;
- configurar `ConfigModule` se fizer sentido;
- configurar error handler global;
- criar estrutura de erro padronizada, como `AppError`;
- padronizar respostas de erro;
- configurar logger estruturado com Pino ou Winston;
- substituir completamente `console.log`;
- garantir logs com `requestId`, modulo/servico e stack trace quando aplicavel;
- garantir que logs nao exponham dados sensiveis;
- configurar Helmet quando aplicavel;
- configurar CORS;
- configurar Swagger/OpenAPI;
- configurar modulo de banco;
- configurar modulo de Redis;
- configurar modulo de email;
- criar testes basicos da aplicacao.

### Entregaveis

- backend inicial funcional;
- Prisma conectado;
- env validado em runtime;
- Zod configurado para validacao;
- error handler global configurado;
- logger estruturado configurado;
- Swagger disponivel;
- estrutura modular definida;
- teste inicial passando.

### Criterio de Pronto

A API deve iniciar sem erro quando as envs obrigatorias existirem, falhar de forma clara quando faltar configuracao, conectar no banco e expor documentacao basica.

## 6. Fase 3 - Usuarios e Registro

### Objetivo

Implementar cadastro de usuario com senha segura e status inicial da conta.

### Tarefas

- criar model `User`;
- definir status do usuario;
- implementar politica de senha;
- implementar hash de senha;
- criar endpoint de registro;
- validar email unico;
- criar caso de uso `registerUser`;
- registrar evento de auditoria;
- criar testes de registro;
- criar testes de senha invalida;
- criar testes de email duplicado.

### Endpoint

- `POST /auth/register`.

### Entregaveis

- usuario consegue criar conta;
- senha e salva apenas como hash;
- usuario inicia com email pendente de verificacao;
- registro e auditado.

### Criterio de Pronto

Uma conta deve ser criada com seguranca basica, sem armazenar senha em texto puro e sem permitir email duplicado.

## 7. Fase 4 - Email, Verificacao e Recuperacao

### Objetivo

Implementar fluxos por email usando Mailpit no ambiente local.

### Tarefas

- criar Mail Module;
- criar template de verificacao de email;
- criar template de recuperacao de senha;
- criar model `EmailVerificationToken`;
- criar model `PasswordResetToken`;
- gerar tokens seguros;
- armazenar apenas hash dos tokens;
- enviar email de verificacao;
- implementar verificacao de email;
- implementar reenvio de verificacao;
- implementar solicitacao de recuperacao de senha;
- implementar reset de senha;
- expirar tokens;
- impedir reutilizacao de token;
- auditar eventos;
- criar testes.

### Endpoints

- `POST /auth/verify-email`;
- `POST /auth/resend-verification`;
- `POST /auth/forgot-password`;
- `POST /auth/reset-password`.

### Entregaveis

- usuario recebe email no Mailpit;
- usuario verifica email;
- usuario solicita recuperacao;
- usuario redefine senha;
- tokens nao podem ser reutilizados.

### Criterio de Pronto

Os fluxos de verificacao e recuperacao devem funcionar usando Mailpit, com tokens hasheados, expiraveis e de uso unico.

## 8. Fase 5 - Login e Sessoes

### Objetivo

Implementar login com criacao de sessao por dispositivo.

### Tarefas

- criar model `Session`;
- implementar login;
- validar credenciais;
- aplicar rate limit em login;
- bloquear temporariamente apos muitas tentativas;
- armazenar user agent;
- armazenar IP quando disponivel;
- criar `deviceName` simples;
- gerar access token curto;
- gerar refresh token;
- armazenar hash do refresh token;
- registrar `lastUsedAt`;
- auditar login bem-sucedido;
- auditar login falho;
- criar endpoint para listar sessoes;
- criar endpoint para revogar sessao especifica;
- criar logout da sessao atual;
- criar logout de todos os dispositivos;
- criar testes.

### Endpoints

- `POST /auth/login`;
- `POST /auth/logout`;
- `POST /auth/logout-all`;
- `GET /sessions`;
- `DELETE /sessions/:id`.

### Entregaveis

- login funcional;
- sessao criada por dispositivo;
- usuario consegue ver sessoes ativas;
- usuario consegue revogar sessoes;
- login abusivo gera bloqueio temporario.

### Criterio de Pronto

Cada login deve criar uma sessao rastreavel e revogavel.

## 9. Fase 6 - Refresh Token Rotation

### Objetivo

Implementar rotacao segura de refresh tokens.

### Tarefas

- implementar endpoint de refresh;
- localizar sessao pelo token;
- comparar hash do refresh token;
- gerar novo refresh token a cada uso;
- substituir hash antigo pelo novo;
- emitir novo access token;
- atualizar `lastUsedAt`;
- detectar reuso de refresh token antigo;
- revogar sessao em caso suspeito;
- registrar auditoria;
- criar testes de rotacao;
- criar teste de reuso suspeito;
- criar teste de sessao expirada;
- criar teste de sessao revogada.

### Endpoint

- `POST /auth/refresh`.

### Entregaveis

- refresh token rotation funcional;
- refresh token antigo deixa de valer apos uso;
- reuso suspeito revoga sessao.

### Criterio de Pronto

Um refresh token antigo reutilizado deve ser rejeitado e a sessao deve ser tratada como comprometida.

## 10. Fase 7 - Organizacoes e Multi-Tenancy

### Objetivo

Implementar organizacoes e permitir que usuarios participem de multiplas organizacoes.

### Tarefas

- criar model `Organization`;
- criar model `OrganizationMember`;
- criar roles iniciais;
- criar endpoint para criar organizacao;
- criar membership `owner` ao criar organizacao;
- criar endpoint para listar organizacoes do usuario;
- criar endpoint para detalhe da organizacao;
- criar endpoint para atualizar organizacao;
- criar middleware/guard de contexto organizacional;
- exigir membership em rotas organizacionais;
- impedir acesso a organizacoes onde usuario nao e membro;
- auditar criacao e atualizacao;
- criar testes de isolamento multi-tenant.

### Endpoints

- `POST /organizations`;
- `GET /organizations`;
- `GET /organizations/:id`;
- `PATCH /organizations/:id`.

### Entregaveis

- usuario cria organizacao;
- usuario vira owner;
- usuario pode participar de varias organizacoes;
- rotas organizacionais validam membership.

### Criterio de Pronto

Um usuario nao deve conseguir acessar dados de uma organizacao onde nao e membro.

## 11. Fase 8 - RBAC e Permissoes

### Objetivo

Implementar autorizacao baseada em roles e permissoes.

### Tarefas

- criar model `Permission`;
- criar model `RolePermission`;
- criar seed de permissoes;
- mapear roles iniciais;
- criar decorator de permissao;
- criar guard de permissao;
- aplicar permissoes nas rotas;
- criar endpoint de membros;
- permitir alterar role de membro;
- impedir owner de perder ultimo owner;
- impedir alteracoes sem permissao;
- auditar alteracoes;
- criar testes de permissoes.

### Endpoints

- `GET /organizations/:id/members`;
- `PATCH /organizations/:id/members/:memberId`;
- `DELETE /organizations/:id/members/:memberId`.

### Entregaveis

- permissoes aplicadas nas rotas;
- roles controlam o que cada membro pode fazer;
- alteracao de role e auditada.

### Criterio de Pronto

Um membro sem permissao nao deve conseguir executar acao administrativa.

## 12. Fase 9 - Convites para Organizacao

### Objetivo

Permitir convidar usuarios para organizacoes via email.

### Tarefas

- criar model `Invitation`;
- criar template de convite;
- criar endpoint para criar convite;
- validar permissao `members:invite`;
- gerar token seguro;
- armazenar hash do token;
- enviar convite via Mailpit;
- implementar aceite de convite;
- criar usuario se necessario ou associar usuario existente;
- criar membership;
- impedir reutilizacao de convite;
- expirar convite;
- cancelar convite;
- auditar eventos;
- criar testes.

### Endpoints

- `POST /organizations/:id/invitations`;
- `GET /organizations/:id/invitations`;
- `POST /invitations/accept`;
- `POST /organizations/:id/invitations/:invitationId/cancel`.

### Entregaveis

- owner/admin convida usuario;
- convite chega no Mailpit;
- convidado aceita;
- membership e criada;
- convite nao pode ser reutilizado.

### Criterio de Pronto

Um convite aceito deve criar membership uma unica vez.

## 13. Fase 10 - Client Apps

### Objetivo

Permitir que organizacoes cadastrem aplicacoes clientes.

### Tarefas

- criar model `ClientApp`;
- criar model `ClientRedirectUri`;
- gerar `clientId`;
- gerar `clientSecret` para apps confidenciais;
- armazenar hash do `clientSecret`;
- permitir apps `public` e `confidential`;
- cadastrar redirect URIs;
- validar formato de redirect URI;
- listar client apps;
- atualizar client app;
- desativar client app;
- auditar eventos;
- criar testes.

### Endpoints

- `POST /organizations/:id/client-apps`;
- `GET /organizations/:id/client-apps`;
- `GET /organizations/:id/client-apps/:clientAppId`;
- `PATCH /organizations/:id/client-apps/:clientAppId`;
- `DELETE /organizations/:id/client-apps/:clientAppId`;
- `POST /organizations/:id/client-apps/:clientAppId/redirect-uris`;
- `DELETE /organizations/:id/client-apps/:clientAppId/redirect-uris/:uriId`.

### Entregaveis

- organizacao cadastra client app;
- app recebe `clientId`;
- app confidencial recebe `clientSecret` uma unica vez;
- redirect URIs sao validadas.

### Criterio de Pronto

Um client app deve conseguir ser usado no fluxo OAuth/OIDC-inspired apenas com redirect URI previamente cadastrada.

## 14. Fase 11 - Authorization Code com PKCE

### Objetivo

Implementar a primeira parte do fluxo OAuth/OIDC-inspired.

### Tarefas

- criar model `AuthorizationCode`;
- criar endpoint `GET /oauth/authorize`;
- validar `clientId`;
- validar `redirectUri`;
- validar `response_type`;
- validar `scope`;
- validar parametros PKCE;
- exigir usuario autenticado;
- criar tela de autorizacao simplificada no frontend;
- gerar authorization code;
- armazenar hash do code;
- definir expiracao curta;
- redirecionar para redirect URI com code;
- auditar code emitido;
- criar testes.

### Endpoint

- `GET /oauth/authorize`.

### Entregaveis

- client app consegue iniciar fluxo;
- AuthForge valida client app e redirect URI;
- authorization code e gerado;
- code expira e e de uso unico.

### Criterio de Pronto

Authorization code deve ser emitido apenas para client app valido e redirect URI cadastrada.

## 15. Fase 12 - Token Endpoint e ID Token

### Objetivo

Trocar authorization code por tokens.

### Tarefas

- criar endpoint `POST /oauth/token`;
- validar grant type;
- validar authorization code;
- validar code nao usado;
- validar expiracao;
- validar PKCE;
- validar client secret quando app for confidencial;
- marcar code como usado;
- emitir access token;
- emitir ID token inspirado em OIDC;
- definir `iss`, `sub`, `aud`, `iat`, `exp`;
- auditar emissao de token;
- criar testes.

### Endpoint

- `POST /oauth/token`.

### Entregaveis

- client app troca code por tokens;
- PKCE e validado;
- code nao pode ser reutilizado;
- ID token e emitido.

### Criterio de Pronto

O mesmo authorization code nao deve poder ser trocado duas vezes.

## 16. Fase 13 - JWKS e UserInfo

### Objetivo

Expor endpoints basicos para validacao de tokens e consulta de usuario.

### Tarefas

- criar model `SigningKey`;
- gerar chave de assinatura;
- criar `kid`;
- assinar tokens com chave ativa;
- expor JWKS publico;
- criar endpoint user info;
- validar access token no user info;
- retornar claims basicas do usuario;
- evitar retorno de dados sensiveis;
- criar testes.

### Endpoints

- `GET /.well-known/jwks.json`;
- `GET /oauth/userinfo`.

### Entregaveis

- JWKS exposto;
- tokens possuem `kid`;
- user info retorna dados basicos.

### Criterio de Pronto

Um client app com access token valido deve conseguir consultar dados basicos do usuario no endpoint user info.

## 17. Fase 14 - Auditoria

### Objetivo

Registrar eventos sensiveis e administrativos.

### Tarefas

- criar model `AuditLog`;
- criar servico de auditoria;
- registrar eventos de auth;
- registrar eventos de sessao;
- registrar eventos de organizacao;
- registrar eventos de convite;
- registrar eventos de RBAC;
- registrar eventos de client app;
- registrar eventos OAuth-inspired;
- criar endpoint de consulta por organizacao;
- criar filtros basicos;
- garantir que logs nao exponham secrets;
- criar testes.

### Endpoint

- `GET /organizations/:id/audit-logs`.

### Entregaveis

- eventos importantes ficam registrados;
- owner/admin consegue consultar auditoria;
- fluxo de seguranca pode ser reconstruido.

### Criterio de Pronto

Deve ser possivel entender quando um usuario logou, criou organizacao, convidou membro, alterou role e emitiu token para client app.

## 18. Fase 15 - Frontend Base com Next.js

### Objetivo

Criar interface web responsiva para demonstrar os fluxos principais.

### Tarefas

- criar app Next.js;
- configurar client HTTP;
- configurar gerenciamento basico de auth;
- criar tela de cadastro;
- criar tela de verificacao de email;
- criar tela de login;
- criar tela de recuperacao de senha;
- criar dashboard;
- criar tela de sessoes;
- criar tela de organizacoes;
- criar tela de membros;
- criar tela de convites;
- criar tela de client apps;
- criar tela de redirect URIs;
- criar tela de auditoria;
- criar tela de autorizacao de client app;
- garantir responsividade basica.

### Telas Principais

- cadastro;
- login;
- verificacao de email;
- recuperacao de senha;
- dashboard;
- minhas sessoes;
- organizacoes;
- membros;
- convites;
- client apps;
- auditoria;
- autorizacao de app.

### Entregaveis

- usuario consegue testar fluxos principais pela interface;
- owner consegue gerenciar organizacao;
- client app consegue passar pela tela de autorizacao.

### Criterio de Pronto

Uma pessoa testando o projeto deve conseguir criar conta, verificar email, criar organizacao, convidar membro e testar fluxo OAuth-inspired pela interface.

## 19. Fase 16 - Testes Automatizados

### Objetivo

Garantir confiabilidade nas regras criticas de identidade e seguranca.

### Tarefas

- configurar Jest;
- criar testes unitarios;
- criar testes de integracao;
- criar testes E2E;
- testar registro;
- testar verificacao de email;
- testar recuperacao de senha;
- testar login;
- testar bloqueio temporario;
- testar refresh token rotation;
- testar reuso de refresh token antigo;
- testar logout;
- testar criacao de organizacao;
- testar isolamento multi-tenant;
- testar RBAC;
- testar convite;
- testar client app;
- testar authorization code;
- testar token endpoint;
- testar user info;
- testar auditoria.

### Prioridade dos Testes

1. refresh token rotation;
2. reuso suspeito de refresh token;
3. isolamento multi-tenant;
4. RBAC;
5. authorization code de uso unico;
6. token endpoint;
7. verificacao e recuperacao por email.

### Entregaveis

- suite de testes automatizada;
- comandos documentados;
- cobertura das regras criticas.

### Criterio de Pronto

Os testes devem provar que sessoes, permissoes, convites e authorization codes nao podem ser reutilizados indevidamente.

## 20. Fase 17 - Rate Limit e Hardening

### Objetivo

Reforcar protecoes nos endpoints sensiveis.

### Tarefas

- aplicar rate limit em login;
- aplicar rate limit em recuperacao de senha;
- aplicar rate limit em reenvio de verificacao;
- aplicar rate limit em token endpoint;
- aplicar bloqueio temporario por email/IP;
- revisar CORS;
- revisar Helmet;
- revisar mensagens de erro;
- revisar logs para nao expor dados sensiveis;
- revisar `.env.example`;
- criar testes de rate limit quando viavel.

### Entregaveis

- endpoints sensiveis protegidos;
- erros consistentes;
- logs seguros.

### Criterio de Pronto

Fluxos sensiveis devem ter protecao contra abuso basico.

## 21. Fase 18 - Observabilidade e Logs

### Objetivo

Melhorar diagnostico e demonstrar maturidade de producao.

### Tarefas

- adicionar correlation ID por requisicao;
- padronizar logs estruturados;
- logar falhas de login;
- logar bloqueios temporarios;
- logar reuso suspeito de refresh token;
- logar falhas de email;
- logar falhas no fluxo OAuth-inspired;
- expor metricas simples ou endpoint interno se fizer sentido;
- documentar eventos importantes;
- revisar dados sensiveis em logs.

### Entregaveis

- logs uteis para debug;
- correlation ID;
- eventos sensiveis rastreaveis.

### Criterio de Pronto

Ao simular um login, convite ou fluxo OAuth-inspired, deve ser possivel acompanhar o caminho pelos logs e auditoria.

## 22. Fase 19 - Polimento para GitHub

### Objetivo

Transformar o projeto em uma vitrine publica clara e profissional.

### Tarefas

- escrever README completo;
- incluir aviso educacional;
- incluir aviso OAuth/OIDC-inspired;
- incluir arquitetura;
- incluir diagrama;
- incluir stack;
- incluir padroes de qualidade;
- incluir convencao de commits;
- incluir instrucoes de setup;
- incluir `.env.example`;
- incluir como usar Mailpit;
- incluir como testar verificacao de email;
- incluir como testar recuperacao de senha;
- incluir como testar fluxo OAuth-inspired;
- incluir como rodar testes;
- incluir prints ou GIFs;
- incluir roadmap;
- incluir limitacoes conhecidas;
- revisar secrets;
- revisar nomes e textos;
- revisar experiencia de primeira execucao.

### Entregaveis

- README forte;
- documentacao tecnica em `docs`;
- prints/GIFs;
- ambiente local reproduzivel;
- projeto apresentavel em entrevista.

### Criterio de Pronto

Um recrutador ou outro dev deve entender rapidamente o problema, a arquitetura, os limites educacionais e como rodar o projeto.

## 23. Fase 20 - Evolucao Publica no LinkedIn

### Objetivo

Registrar a trajetoria do desenvolvimento do AuthForge no LinkedIn para gerar visibilidade profissional e mostrar evolucao tecnica real.

### Tarefas

- criar uma publicacao inicial apresentando a ideia do AuthForge;
- explicar por que autenticacao vai alem de login;
- publicar decisoes tecnicas importantes durante o desenvolvimento;
- compartilhar diagramas simples quando fizer sentido;
- publicar aprendizados sobre refresh token rotation;
- publicar aprendizados sobre sessoes por dispositivo;
- publicar aprendizados sobre multi-tenancy;
- publicar aprendizados sobre RBAC;
- publicar aprendizados sobre convites;
- publicar aprendizados sobre OAuth/OIDC-inspired;
- publicar uma retrospectiva ao concluir o MVP;
- manter tom profissional, pessoal e transparente;
- evitar divulgar secrets, URLs sensiveis, credenciais ou detalhes inseguros.

### Ideias de Posts

- "Por que decidi criar o AuthForge como projeto de identidade";
- "Autenticacao nao e so login e senha";
- "Refresh token rotation: por que tokens antigos nao devem continuar validos";
- "Como estou modelando sessoes por dispositivo";
- "Multi-tenancy: separando usuarios por organizacao";
- "RBAC: roles, permissoes e guards";
- "Convites seguros para organizacoes SaaS";
- "OAuth/OIDC-inspired: aprendendo conceitos sem prometer certificacao";
- "O que aprendi construindo um backend de identidade".

### Entregaveis

- calendario simples de publicacoes;
- posts publicados durante os marcos do projeto;
- links dos posts registrados no README ou em `docs/jornada.md`, se fizer sentido.

### Criterio de Pronto

A evolucao do projeto deve estar documentada publicamente de forma profissional, mostrando raciocinio tecnico e progresso real.

## 24. Ordem de Implementacao Recomendada

Sequencia curta para nao se perder:

1. repositorio local + GitHub + npm workspaces + Git hooks;
2. Docker Compose para PostgreSQL/Redis/Mailpit + API base via npm;
3. usuarios e registro;
4. verificacao de email e recuperacao;
5. login e sessoes;
6. refresh token rotation;
7. organizacoes e multi-tenancy;
8. RBAC;
9. convites;
10. client apps;
11. authorization code com PKCE;
12. token endpoint e ID token;
13. JWKS e user info;
14. auditoria;
15. frontend integrado;
16. testes criticos;
17. hardening;
18. README, LinkedIn e polimento.

## 25. MVP Minimo Demonstravel

Se for necessario reduzir escopo, o MVP minimo deve manter:

- cadastro;
- verificacao de email com Mailpit;
- login;
- sessoes por dispositivo;
- refresh token rotation;
- logout e revogacao de sessao;
- criacao de organizacao;
- membership;
- RBAC basico;
- convites;
- client apps;
- redirect URIs;
- authorization code com PKCE;
- token endpoint;
- user info;
- JWKS;
- auditoria;
- testes criticos.

Podem ser simplificados no primeiro MVP:

- tela muito refinada;
- rotacao real completa de chaves;
- MFA;
- permissoes muito granulares;
- dashboard com metricas;
- deploy demonstravel.

## 26. Decisoes Pendentes para Antes de Codar

Antes de iniciar implementacao, ainda vale decidir:

- tempo padrao do access token;
- tempo padrao do refresh token;
- refresh token em cookie httpOnly ou retorno no body;
- MFA entra no MVP ou fica como futuro;
- quais claims entram no access token;
- quais claims entram no ID token;
- quais permissoes iniciais entram no seed;
- se o painel admin sera simples ou mais completo;
- estrategia de deploy demonstravel;
- padrao visual do frontend.

## 27. Sugestao de Roadmap em Marcos

### Marco 1 - Base Rodando

- monorepo;
- npm workspaces;
- Husky, commitlint e lint-staged;
- ESLint e Prettier;
- env validado;
- Docker Compose apenas para PostgreSQL, Redis e Mailpit;
- API NestJS rodando via npm;
- banco, Redis e Mailpit conectados;
- healthcheck.

### Marco 2 - Conta Segura

- registro;
- verificacao de email;
- recuperacao de senha;
- login;
- sessoes;
- refresh token rotation.

### Marco 3 - SaaS Multi-Tenant

- organizacoes;
- membros;
- RBAC;
- convites;
- auditoria organizacional.

### Marco 4 - Identity Provider

- client apps;
- redirect URIs;
- authorization code com PKCE;
- token endpoint;
- ID token;
- JWKS;
- user info.

### Marco 5 - Interface e Demonstracao

- Next.js;
- fluxos principais;
- tela de autorizacao;
- painel simples;
- responsividade.

### Marco 6 - Qualidade de Portfolio

- testes criticos;
- rate limit;
- logs;
- README;
- LinkedIn;
- prints/GIFs;
- documentacao final.

## 28. Criterio Final de Conclusao

O AuthForge sera considerado concluido quando:

- o projeto rodar localmente com instrucoes claras;
- PostgreSQL, Redis e Mailpit rodarem via Docker Compose;
- API e frontend rodarem via npm;
- usuario conseguir registrar conta;
- usuario conseguir verificar email;
- usuario conseguir fazer login;
- login criar sessao por dispositivo;
- refresh token rotation funcionar;
- refresh token antigo reutilizado revogar sessao;
- usuario conseguir listar e revogar sessoes;
- usuario conseguir criar organizacao;
- usuario conseguir convidar membro;
- convite puder ser aceito;
- RBAC bloquear acoes sem permissao;
- usuario nao conseguir acessar organizacao onde nao e membro;
- client app puder ser criado;
- redirect URI for validada;
- authorization code flow com PKCE funcionar;
- token endpoint emitir tokens;
- user info endpoint retornar dados do usuario;
- JWKS endpoint expor chave publica;
- auditoria registrar eventos sensiveis;
- testes criticos estiverem passando;
- README explicar bem o valor tecnico e os limites do projeto;
- a trajetoria do projeto tiver sido registrada no LinkedIn em posts tecnicos.

## 29. Observacao Final

O foco do AuthForge nao deve ser competir com provedores profissionais de identidade.

O foco deve ser provar, com clareza, que o backend consegue lidar com:

- autenticacao;
- autorizacao;
- sessoes;
- tokens;
- refresh token rotation;
- multi-tenancy;
- RBAC;
- convites;
- client apps;
- OAuth/OIDC-inspired;
- auditoria;
- seguranca;
- testes.

Esse e o ponto que torna o projeto forte para portfolio backend.
