# Calculadora

Calculadora web de quatro operações, escrita em TypeScript com Vite, sem framework e sem dependências de runtime. Funciona pelo mouse e pelo teclado, em telas de 320px até desktop, com tema claro e escuro.

## Como rodar

```bash
npm install && npm run dev
```

O Vite mostra o endereço local no terminal. Abra no navegador.

## Scripts

| Script             | O que faz                                                             |
| ------------------ | --------------------------------------------------------------------- |
| `npm run dev`      | Sobe o servidor de desenvolvimento                                    |
| `npm run build`    | Confere os tipos com `tsc` (modo `strict`) e gera o build de produção |
| `npm run preview`  | Serve o build                                                         |
| `npm test`         | Roda os testes com Vitest                                             |
| `npm run coverage` | Roda os testes com cobertura; falha abaixo de 90% em `src/core/`      |
| `npm run lint`     | ESLint, sem nenhum warning                                            |
| `npm run format`   | Prettier                                                              |

## Como testar

```bash
npm test            # todos os testes
npm run coverage    # testes com relatório de cobertura
npm run lint && npm run build
```

Cada teste começa pelo ID do requisito e o número do critério da spec que ele prova, por exemplo `CALC-08 AC13`. A spec fica em `.specs/features/calculadora/spec.md`.

## Layout e o botão `%`

A grade tem 4 colunas e 6 linhas, com `=` ocupando a última linha inteira:

```
┌─────┬─────┬─────┬─────┐
│  C  │ CE  │  ⌫  │  %  │
│  7  │  8  │  9  │  ÷  │
│  4  │  5  │  6  │  ×  │
│  1  │  2  │  3  │  −  │
│  ±  │  0  │  .  │  +  │
├─────┴─────┴─────┴─────┤
│           =           │
└───────────────────────┘
```

O PRD deixava o `%` a critério da implementação: podia ficar só no teclado ou substituir o `CE`. A decisão foi **acrescentar uma linha** à grade, para manter todos os controles como botão. O `%` só divide o número atual por 100: `50 + 10 %` vira `50 + 0.1`.

## Teclado

| Tecla           | Ação                  |
| --------------- | --------------------- |
| `0`–`9`         | dígito                |
| `.` ou `,`      | ponto decimal         |
| `+` `-` `*` `/` | operadores            |
| `Enter` ou `=`  | resultado             |
| `Backspace`     | apagar dígito         |
| `Escape`        | limpar tudo (`C`)     |
| `Delete`        | limpar entrada (`CE`) |
| `%`             | porcentagem           |

O botão correspondente pisca por um instante. `Enter` e `Espaço` com um botão em foco acionam só esse botão.

## Decisões de design

- **Reducer puro.** Toda a lógica está em `src/core/` como `(state, action) => newState`, sem mutação e sem acesso ao DOM. A UI em `src/ui/` só despacha ações e renderiza o estado.
- **Regras onde há teste.** O texto da expressão, o operador ativo e o tamanho da fonte saem de funções do `core`. A grade de botões é uma lista de dados. O mapa de teclas é uma função pura. O CSS é lido por um teste que calcula o contraste de cada par de cores nos dois temas.
- **Sem `eval`.** Um teste varre `src/` e falha se achar `eval(`, `new Function` ou `Function(`.
- **Cálculo da esquerda para a direita**, como as calculadoras comuns: `2 + 3 × 4 =` dá `20`.
- **Números como texto.** O estado guarda `string`, para preservar `0.` e `-0.5` enquanto o usuário digita.
- **Arredondamento a 10 casas.** `0.1 + 0.2` mostra `0.3`. Um resultado muito pequeno (`1 ÷ 3000000000000`) aparece como `0`.
- **Mais de 15 dígitos viram notação exponencial** com até 10 casas (`1.2345678901e+20`). O número perde precisão ao ser exibido assim.
- **Erros bloqueiam as operações.** Divisão por zero mostra `Não é possível dividir por zero`. Um resultado não finito mostra `Resultado fora do limite`. Em ambos os casos só `C` ou um dígito destravam.
- **Limite de 15 dígitos** por número digitado. Sinal e ponto não contam.
