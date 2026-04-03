# Caju Form Front

Frontend React com Vite para cadastro e edicao de usuarios.

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de producao
- `npm run lint`: validacao com ESLint
- `npm run preview`: sobe a build localmente

## Variaveis de ambiente

- `VITE_API_BASE_URL`: URL base da API. Em desenvolvimento, quando nao informada, o frontend usa requisicoes relativas.

## Estrutura

```text
src/
  app/                       # composicao principal da aplicacao
  features/registration/     # fluxo de cadastro
    components/              # componentes de UI do fluxo
    constants/               # listas e constantes do dominio
    hooks/                   # gerenciamento de estado do fluxo
    services/                # chamadas HTTP
    utils/                   # formatacao, validacao e mapeamentos
  shared/
    config/                  # configuracoes compartilhadas
    styles/                  # estilos globais
```

## Convencoes adotadas

- regras de negocio fora dos componentes
- estado do fluxo centralizado em hook com reducer
- componentes menores e focados em responsabilidade unica
- nomes de classes e arquivos orientados ao dominio
