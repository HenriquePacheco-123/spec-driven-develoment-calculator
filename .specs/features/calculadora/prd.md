# PRD — Calculadora Simples em TypeScript

## 1. Visão geral

Construir uma calculadora web simples, escrita em TypeScript, com uma interface gráfica no navegador que permita realizar as quatro operações básicas. O foco é código limpo, tipado, bem organizado e testado, servindo também como projeto de estudo.

## 2. Objetivos

- Permitir que o usuário faça cálculos básicos de forma rápida pelo mouse ou pelo teclado.
- Separar claramente a lógica de cálculo (pura, testável) da interface (DOM).
- Entregar um projeto que roda localmente com um único comando.

### Fora do escopo (v1)

- Funções científicas (seno, raiz, potência, logaritmo etc.).
- Histórico persistente de cálculos.
- Backend, autenticação ou banco de dados.
- Aplicativo mobile nativo.

## 3. Stack técnica

| Item | Escolha |
|---|---|
| Linguagem | TypeScript (modo `strict` ativado) |
| Build / dev server | Vite (template `vanilla-ts`) |
| Interface | HTML + CSS puro, sem framework |
| Testes | Vitest |
| Lint / formatação | ESLint + Prettier |
| Gerenciador de pacotes | npm |

**Restrição importante:** não usar `eval()`, `new Function()` nem qualquer forma de execução de string como código. Toda a lógica de cálculo deve ser implementada manualmente.

## 4. Requisitos funcionais

### RF01 — Entrada de números
- Botões de 0 a 9.
- Botão de ponto decimal (`.`); não permitir mais de um ponto no mesmo número.
- Não permitir zeros à esquerda (ex.: `007` deve virar `7`).

### RF02 — Operações
- Adição (`+`), subtração (`−`), multiplicação (`×`) e divisão (`÷`).
- Cálculo encadeado: ao digitar `2 + 3 +`, o display deve mostrar `5` e aguardar o próximo número.
- Trocar de operador: se o usuário pressionar `+` e logo depois `×`, o operador é substituído.

### RF03 — Resultado
- Botão `=` executa a operação pendente.
- Pressionar `=` repetidamente repete a última operação (ex.: `2 + 3 = = =` → `5`, `8`, `11`).
- Após um resultado, digitar um número inicia um novo cálculo; digitar um operador continua a partir do resultado.

### RF04 — Controles
- `C` (clear): zera tudo.
- `CE` (clear entry): limpa apenas o número atual.
- `⌫` (backspace): apaga o último dígito.
- `±`: inverte o sinal do número atual.
- `%`: converte o número atual em porcentagem (divide por 100).

### RF05 — Display
- Mostrar o número atual em destaque.
- Mostrar, em linha secundária acima, a expressão em andamento (ex.: `12 ×`).
- Números longos devem ser formatados ou reduzidos de fonte para não quebrar o layout; limitar a entrada a 15 dígitos.

### RF06 — Tratamento de erros
- Divisão por zero exibe a mensagem `Não é possível dividir por zero` e bloqueia as operações até o usuário pressionar `C` ou digitar um número.
- Resultados devem corrigir imprecisão de ponto flutuante (ex.: `0.1 + 0.2` deve exibir `0.3`, não `0.30000000000000004`). Arredondar para no máximo 10 casas decimais e remover zeros à direita.

### RF07 — Suporte a teclado
| Tecla | Ação |
|---|---|
| `0`–`9` | dígito |
| `.` ou `,` | ponto decimal |
| `+` `-` `*` `/` | operadores |
| `Enter` ou `=` | resultado |
| `Backspace` | apagar dígito |
| `Escape` | limpar tudo (C) |
| `Delete` | limpar entrada (CE) |
| `%` | porcentagem |

O botão correspondente deve receber um feedback visual rápido quando a tecla for pressionada.

## 5. Requisitos não funcionais

- **Responsividade:** funcionar bem em telas de 320px até desktop.
- **Acessibilidade:** botões com `aria-label` descritivos; display com `aria-live="polite"`; foco visível; contraste adequado.
- **Tema:** suportar tema claro e escuro via `prefers-color-scheme`.
- **Performance:** sem dependências de runtime além do necessário; bundle final pequeno.
- **Qualidade:** `npm run lint` e `npm run build` sem erros nem warnings.

## 6. Arquitetura

A lógica deve ser independente do DOM para ser testável isoladamente.

```
calculadora/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts              # ponto de entrada; conecta UI e lógica
│   ├── core/
│   │   ├── types.ts         # tipos: Operator, CalculatorState etc.
│   │   ├── operations.ts    # funções puras: add, subtract, multiply, divide
│   │   ├── calculator.ts    # máquina de estado da calculadora (funções puras)
│   │   └── format.ts        # formatação e correção de ponto flutuante
│   ├── ui/
│   │   ├── render.ts        # atualiza o display a partir do estado
│   │   ├── buttons.ts       # cria e conecta os botões
│   │   └── keyboard.ts      # mapeamento de teclas
│   └── styles/
│       └── style.css
└── tests/
    ├── operations.test.ts
    ├── calculator.test.ts
    └── format.test.ts
```

### Modelo de estado sugerido

```ts
type Operator = '+' | '-' | '*' | '/';

interface CalculatorState {
  currentValue: string;        // número sendo digitado / exibido
  previousValue: string | null;
  operator: Operator | null;
  lastOperation: { operator: Operator; operand: string } | null; // para "=" repetido
  waitingForOperand: boolean;
  error: string | null;
}
```

A lógica deve seguir um padrão de reducer: `(state, action) => newState`, sem mutação. A UI apenas despacha ações e renderiza o estado resultante.

## 7. Interface (layout)

Grade de 4 colunas:

```
┌─────────────────────────┐
│               12 ×      │  ← expressão
│                    345  │  ← número atual
├─────┬─────┬─────┬───────┤
│  C  │ CE  │  ⌫  │   ÷   │
│  7  │  8  │  9  │   ×   │
│  4  │  5  │  6  │   −   │
│  1  │  2  │  3  │   +   │
│  ±  │  0  │  .  │   =   │
└─────┴─────┴─────┴───────┘
```

O `%` pode ficar acessível pelo teclado ou substituir o `CE` se o layout ficar apertado — a decisão fica a critério da implementação, desde que documentada no README.

Operadores e `=` devem ter cor de destaque diferente dos dígitos. O operador ativo deve ficar visualmente marcado até o próximo número ser digitado.

## 8. Testes

Cobertura mínima de 90% no diretório `src/core/`. Casos obrigatórios:

- As quatro operações com inteiros, decimais e negativos.
- `0.1 + 0.2 = 0.3`.
- Divisão por zero retorna erro.
- Cálculo encadeado (`2 + 3 × 4 =` resulta em `20`, avaliação da esquerda para a direita, como calculadoras comuns).
- `=` repetido.
- Troca de operador.
- Ponto decimal duplicado é ignorado.
- Backspace, `±`, `%`, `C` e `CE`.
- Limite de 15 dígitos.

## 9. Scripts esperados no `package.json`

| Script | Função |
|---|---|
| `npm run dev` | sobe o servidor de desenvolvimento |
| `npm run build` | type-check (`tsc`) + build de produção |
| `npm run preview` | serve o build |
| `npm test` | roda os testes |
| `npm run coverage` | testes com relatório de cobertura |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## 10. Critérios de aceite

- [ ] `npm install && npm run dev` abre a calculadora funcionando no navegador.
- [ ] Todos os requisitos funcionais (RF01–RF07) implementados.
- [ ] Nenhum uso de `eval` ou `Function`.
- [ ] `npm test` passa com cobertura ≥ 90% em `src/core/`.
- [ ] `npm run build` e `npm run lint` sem erros.
- [ ] Layout responsivo e com tema claro/escuro.
- [ ] `README.md` explicando como rodar, testar e as decisões de design.

## 11. Ordem de implementação sugerida

1. Criar o projeto com Vite (`vanilla-ts`) e configurar TypeScript strict, ESLint, Prettier e Vitest.
2. Implementar `src/core/` (tipos, operações, formatação, reducer) com os testes.
3. Montar o HTML e o CSS do layout.
4. Conectar os botões ao reducer e renderizar o estado.
5. Adicionar suporte a teclado e feedback visual.
6. Revisar acessibilidade, responsividade e tema escuro.
7. Escrever o README e validar todos os critérios de aceite.
