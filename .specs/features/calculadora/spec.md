# Calculadora Specification

**Approved**: 2026-11-02 - user: "aprovado, com ERR-03"

## Problem Statement

Construir uma calculadora web de quatro operações em TypeScript, usada pelo mouse e pelo teclado, que roda localmente com `npm install && npm run dev`. A lógica de cálculo é pura e testada, separada do DOM. O projeto também serve de estudo de código limpo e tipado.

## Goals

- [ ] As quatro operações, controles e erros se comportam como uma calculadora comum, cobertos por testes com ≥ 90% de cobertura em `src/core/`.
- [ ] `npm run lint` e `npm run build` terminam sem erros nem warnings.
- [ ] A UI funciona de 320px até desktop, com tema claro e escuro.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Funções científicas (seno, raiz, potência, log) | PRD, fora do escopo v1 |
| Histórico persistente de cálculos | PRD, fora do escopo v1 |
| Backend, autenticação, banco de dados | PRD, fora do escopo v1 |
| App mobile nativo | PRD, fora do escopo v1 |
| Precedência de operadores (`2 + 3 × 4 = 14`) | PRD exige avaliação da esquerda para a direita |
| Framework de UI, `eval`, `new Function` | PRD proíbe |
| Separador de milhar | Não pedido; números longos reduzem a fonte |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Pasta do projeto | `~/calculadora` | PRD nomeia a raiz `calculadora/` | y |
| `%` na grade | Botão `%` na grade, e `CE` fica. A grade passa a 4 colunas x 6 linhas: `C CE ⌫ %`, `7 8 9 ÷`, `4 5 6 ×`, `1 2 3 −`, `± 0 . +`, `=` ocupando a linha inteira. Decisão documentada no README | Usuário pediu botão e manter todos os controles; o PRD §7 deixa o layout a critério da implementação | y |
| `%` com operação pendente | Só divide o número atual por 100 (`50 + 10 %` vira `50 + 0.1`) | PRD define `%` como "divide por 100" | n |
| `=` sem segundo operando (`5 + =`) | Usa o valor atual como operando (`5 + 5 = 10`) | Comportamento das calculadoras comuns | n |
| `=` sem operador nem última operação | Sem efeito | Nada a executar | n |
| `±` em `0` | Sem efeito | Evita `-0` | n |
| `⌫` em número de um dígito, ou `-5` | Resulta em `0` | Display nunca fica vazio | n |
| `⌫` logo após um resultado | Sem efeito | O resultado não é um número digitado | n |
| `CE` logo após um resultado | Age como `C` | Não há entrada a limpar | n |
| `±` ou `%` logo depois de um operador | O número transformado vira o segundo operando (`waitingForOperand` falso) | Achado F3 do Verifier; a spec era omissa. Aprovado pelo usuário em 2026-11-02 - user: "pode aprovar mais não comitta nada" | y |
| Limite de 15 dígitos | Conta só dígitos; sinal e ponto não contam | PRD diz "15 dígitos" | n |
| Resultado não finito | Erro `Resultado fora do limite`, mesmo bloqueio da divisão por zero | `Infinity` não pode aparecer no display; pedido pelo usuário em 2026-11-02 | y |
| Resultado com mais de 15 dígitos | Notação exponencial com até 10 casas (`1.2345678901e+20`) | Cabe no display sem quebrar o layout | n |
| Ponto sem dígito antes | Vira `0.` | Padrão das calculadoras | n |
| Expressão após `=` | Mostra a operação executada (`2 + 3 =`) | Dá contexto ao resultado | n |
| Vírgula do teclado | Entra como ponto; o display mostra sempre `.` | PRD: `.` ou `,` equivalem | n |
| Cobertura | Medida com `@vitest/coverage-v8`, limite 90% aplicado no `vitest.config` | Faz `npm run coverage` falhar abaixo do mínimo | n |

**Open questions:** none. Pasta e `%` na grade confirmados pelo usuário em 2026-11-02. As demais linhas seguem os defaults e valem até alguém objetar.

---

## User Stories

### P1: Núcleo de cálculo ⭐ MVP

**User Story**: Como usuário, quero digitar números e operações e obter o resultado correto para fazer contas básicas.

**Why P1**: Sem o reducer puro nada mais funciona; é a base testável.

**Acceptance Criteria**:

1. WHEN o usuário digita um dígito de 0 a 9 THEN the system SHALL acrescentar o dígito ao número atual <!-- CALC-01 -->
2. WHEN o usuário digita `0` com o número atual `0` THEN the system SHALL manter `0` <!-- CALC-02 -->
3. WHEN o usuário digita `7` com o número atual `0` THEN the system SHALL mostrar `7` (`007` vira `7`) <!-- CALC-02 -->
4. WHEN o usuário aciona o ponto decimal THEN the system SHALL acrescentar `.` ao número atual <!-- CALC-03 -->
5. IF o número atual já contém `.` THEN the system SHALL ignorar um segundo ponto <!-- CALC-03 -->
6. WHEN o usuário aciona o ponto decimal sem dígito antes THEN the system SHALL mostrar `0.` <!-- CALC-03 -->
7. IF o número atual tem 15 dígitos THEN the system SHALL ignorar novos dígitos <!-- CALC-04 -->
8. WHEN o usuário aciona `+`, `−`, `×` ou `÷` com um número digitado THEN the system SHALL guardar o número e o operador e aguardar o próximo número <!-- CALC-05 -->
9. WHEN o usuário aciona um operador com uma operação pendente e um segundo número digitado THEN the system SHALL calcular a operação pendente, mostrar o resultado e guardar o novo operador (`2 + 3 +` mostra `5`) <!-- CALC-06 -->
10. WHEN o usuário aciona `2 + 3 × 4 =` THEN the system SHALL mostrar `20` (esquerda para a direita) <!-- CALC-06 -->
11. WHEN o usuário aciona um operador logo depois de outro operador THEN the system SHALL substituir o operador pendente sem calcular <!-- CALC-07 -->
12. WHEN o usuário aciona `=` com operação pendente e segundo número THEN the system SHALL mostrar o resultado e guardar a última operação <!-- CALC-08 -->
13. WHEN o usuário aciona `=` repetidas vezes após um resultado THEN the system SHALL repetir a última operação (`2 + 3 = = =` mostra `5`, `8`, `11`) <!-- CALC-08 -->
14. WHEN o usuário aciona `=` com operador pendente e sem segundo número THEN the system SHALL usar o valor atual como operando (`5 + =` mostra `10`) <!-- CALC-08 -->
15. WHEN o usuário digita um dígito após um resultado THEN the system SHALL iniciar um novo cálculo com esse dígito <!-- CALC-09 -->
16. WHEN o usuário aciona um operador após um resultado THEN the system SHALL continuar o cálculo a partir do resultado <!-- CALC-09 -->
17. The system SHALL calcular adição, subtração, multiplicação e divisão com inteiros, decimais e negativos <!-- CALC-10 -->
18. The system SHALL arredondar resultados a no máximo 10 casas decimais e remover zeros à direita (`0.1 + 0.2` mostra `0.3`) <!-- CALC-11 -->
19. WHEN um resultado tem mais de 15 dígitos THEN the system SHALL exibi-lo em notação exponencial com até 10 casas decimais <!-- CALC-11 -->
20. The system SHALL implementar o cálculo sem `eval`, `new Function` ou execução de string como código <!-- CALC-12 -->

**Independent Test**: Rodar os testes do reducer em `tests/calculator.test.ts`, sem DOM.

---

### P1: Controles e erros

**User Story**: Como usuário, quero corrigir a entrada e ser avisado de erros para não perder o cálculo.

**Why P1**: RF04 e RF06 fazem parte da lógica obrigatória e dos testes exigidos.

**Acceptance Criteria**:

1. WHEN o usuário aciona `C` THEN the system SHALL zerar número atual, valor anterior, operador, última operação e erro <!-- CTRL-01 -->
2. WHEN o usuário aciona `CE` THEN the system SHALL limpar só o número atual para `0`, mantendo operador e valor anterior <!-- CTRL-02 -->
3. WHEN o usuário aciona `CE` logo após um resultado THEN the system SHALL agir como `C` <!-- CTRL-02 -->
4. WHEN o usuário aciona `⌫` THEN the system SHALL apagar o último caractere do número digitado, e `0` se não restar dígito <!-- CTRL-03 -->
5. WHEN o usuário aciona `⌫` logo após um resultado THEN the system SHALL manter o resultado <!-- CTRL-03 -->
6. WHEN o usuário aciona `±` THEN the system SHALL inverter o sinal do número atual <!-- CTRL-04 -->
7. WHEN o usuário aciona `±` com o número atual `0` THEN the system SHALL manter `0` <!-- CTRL-04 -->
8. WHEN o usuário aciona `%` THEN the system SHALL dividir o número atual por 100 <!-- CTRL-05 -->
9. IF o usuário divide por zero THEN the system SHALL exibir `Não é possível dividir por zero` <!-- ERR-01 -->
10. WHILE há erro, the system SHALL ignorar operadores, `=`, `±`, `%`, `⌫` e `CE` <!-- ERR-02 -->
11. WHILE há erro, WHEN o usuário aciona `C` ou digita um número THEN the system SHALL limpar o erro, e o dígito digitado inicia um novo cálculo <!-- ERR-02 -->
12. IF uma operação resulta em valor não finito (`Infinity`) THEN the system SHALL exibir `Resultado fora do limite` e tratar como o erro de divisão por zero <!-- ERR-03 -->
13. WHEN o usuário aciona `±` ou `%` logo depois de um operador THEN the system SHALL tratar o número transformado como o segundo operando, e o operador deixa de ficar marcado (`5 + ± =` mostra `0`, `5 + % =` mostra `5.05`) <!-- CTRL-06 -->

**Independent Test**: Rodar os testes de controles e erro em `tests/calculator.test.ts`.

---

### P1: Interface gráfica com mouse

**User Story**: Como usuário, quero clicar nos botões e ver a expressão e o resultado para usar a calculadora no navegador.

**Why P1**: É o produto visível; sem ela o núcleo não é usável.

**Acceptance Criteria**:

1. WHEN o usuário abre a página THEN the system SHALL mostrar a grade de 4 colunas e 6 linhas: `C CE ⌫ %`, `7 8 9 ÷`, `4 5 6 ×`, `1 2 3 −`, `± 0 . +`, e `=` ocupando a última linha inteira <!-- UI-01 -->
2. WHEN o usuário clica em um botão THEN the system SHALL despachar a ação correspondente ao reducer e renderizar o estado resultante <!-- UI-02 -->
3. The system SHALL mostrar o número atual em destaque e a expressão em andamento em uma linha secundária acima (`12 ×`) <!-- UI-03 -->
4. WHILE há operador pendente e nenhum número novo foi digitado, the system SHALL marcar visualmente o botão do operador ativo <!-- UI-04 -->
5. The system SHALL dar a operadores e `=` uma cor de destaque diferente da dos dígitos <!-- UI-05 -->
6. WHEN o número atual não cabe no display THEN the system SHALL reduzir a fonte sem quebrar o layout <!-- UI-06 -->
7. WHEN há erro THEN the system SHALL mostrar a mensagem no display sem quebrar o layout <!-- UI-06 -->

**Independent Test**: `npm run dev`, clicar `1 2 × 3 4 5` e ver `12 ×` acima de `345`; clicar `5 0 %` e ver `0.5`.

---

### P2: Teclado

**User Story**: Como usuário, quero usar o teclado para calcular sem o mouse.

**Why P2**: RF07 completa a entrada, mas a UI funciona sem ele.

**Acceptance Criteria**:

1. WHEN o usuário pressiona `0`–`9` THEN the system SHALL despachar o dígito <!-- KEY-01 -->
2. WHEN o usuário pressiona `.` ou `,` THEN the system SHALL despachar o ponto decimal <!-- KEY-01 -->
3. WHEN o usuário pressiona `+`, `-`, `*` ou `/` THEN the system SHALL despachar o operador `+`, `-`, `*` ou `/` <!-- KEY-02 -->
4. WHEN o usuário pressiona `Enter` ou `=` THEN the system SHALL despachar o resultado <!-- KEY-02 -->
5. WHEN o usuário pressiona `Backspace`, `Escape` ou `Delete` THEN the system SHALL despachar `⌫`, `C` ou `CE` respectivamente <!-- KEY-03 -->
6. WHEN o usuário pressiona `%` THEN the system SHALL despachar a porcentagem <!-- KEY-03 -->
7. WHEN o usuário pressiona uma tecla mapeada (todas têm botão) THEN the system SHALL dar ao botão um feedback visual por tempo curto <!-- KEY-04 -->
8. WHEN o usuário pressiona `Enter` ou `Space` com um botão focado THEN the system SHALL acionar só esse botão, sem despachar `=` em duplicidade <!-- KEY-05 -->

**Independent Test**: Digitar `2 + 3 Enter` no teclado e ver `5`, com `+` e `=` piscando.

---

### P2: Acessibilidade, responsividade e tema

**User Story**: Como usuário de qualquer dispositivo ou tecnologia assistiva, quero usar a calculadora com conforto.

**Why P2**: Requisitos não funcionais do PRD §5, medidos no fim.

**Acceptance Criteria**:

1. The system SHALL dar a cada botão um `aria-label` descritivo (por exemplo `Dividir`, `Apagar último dígito`) <!-- A11Y-01 -->
2. The system SHALL marcar o display com `aria-live="polite"` <!-- A11Y-02 -->
3. WHEN um botão recebe foco pelo teclado THEN the system SHALL mostrar um indicador de foco visível <!-- A11Y-03 -->
4. The system SHALL manter contraste de texto de pelo menos 4.5:1 nos temas claro e escuro <!-- A11Y-04 -->
5. WHEN a largura da janela é de 320px a desktop THEN the system SHALL manter a grade sem rolagem horizontal <!-- RESP-01 -->
6. WHILE `prefers-color-scheme` é `dark`, the system SHALL usar o tema escuro, e o tema claro nos demais casos <!-- THEME-01 -->

**Independent Test**: Janela de 320px sem rolagem horizontal; trocar o tema do sistema muda as cores.

---

### P2: Qualidade e entrega

**User Story**: Como desenvolvedor, quero um projeto que roda, testa e compila com um comando cada, para estudar e evoluir.

**Why P2**: Critérios de aceite do PRD §10.

**Acceptance Criteria**:

1. The system SHALL expor os scripts `dev`, `build`, `preview`, `test`, `coverage`, `lint` e `format` no `package.json` <!-- QUAL-01 -->
2. WHEN `npm run build` roda THEN the system SHALL terminar sem erros nem warnings, com `tsc` em modo `strict` <!-- QUAL-02 -->
3. WHEN `npm run lint` roda THEN the system SHALL terminar sem erros nem warnings <!-- QUAL-02 -->
4. WHEN `npm run coverage` roda THEN the system SHALL falhar se a cobertura de `src/core/` ficar abaixo de 90% <!-- QUAL-03 -->
5. The system SHALL declarar nenhuma dependência de runtime <!-- QUAL-04 -->
6. The system SHALL incluir um `README.md` com como rodar, como testar, o layout do `%` na grade e as decisões de design <!-- QUAL-05 -->

**Independent Test**: `npm install && npm run lint && npm run build && npm run coverage`.

---

## Edge Cases

- IF o número atual tem 15 dígitos e o usuário digita `.` THEN the system SHALL aceitar o ponto sem dígito novo
- WHEN o usuário digita `-` como primeiro operador com `0` THEN the system SHALL tratar como subtração de `0`
- IF a divisão resulta em dízima (`1 ÷ 3`) THEN the system SHALL mostrar `0.3333333333`
- WHEN o usuário aciona `=` após um erro limpo por `C` THEN the system SHALL manter `0`

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| CALC-01 | P1: Núcleo | Execute | Implemented |
| CALC-02 | P1: Núcleo | Execute | Implemented |
| CALC-03 | P1: Núcleo | Execute | Implemented |
| CALC-04 | P1: Núcleo | Execute | Implemented |
| CALC-05 | P1: Núcleo | Execute | Implemented |
| CALC-06 | P1: Núcleo | Execute | Implemented |
| CALC-07 | P1: Núcleo | Execute | Implemented |
| CALC-08 | P1: Núcleo | Execute | Implemented |
| CALC-09 | P1: Núcleo | Execute | Implemented |
| CALC-10 | P1: Núcleo | Execute | Implemented |
| CALC-11 | P1: Núcleo | Execute | Implemented |
| CALC-12 | P1: Núcleo | Execute | Implemented |
| CTRL-01 | P1: Controles | Execute | Implemented |
| CTRL-02 | P1: Controles | Execute | Implemented |
| CTRL-03 | P1: Controles | Execute | Implemented |
| CTRL-04 | P1: Controles | Execute | Implemented |
| CTRL-05 | P1: Controles | Execute | Implemented |
| ERR-01 | P1: Controles | Execute | Implemented |
| ERR-02 | P1: Controles | Execute | Implemented |
| ERR-03 | P1: Controles | Execute | Implemented |
| CTRL-06 | P1: Controles | Execute | Implemented |
| UI-01 | P1: Interface | Execute | Implemented |
| UI-02 | P1: Interface | Execute | Implemented |
| UI-03 | P1: Interface | Execute | Implemented |
| UI-04 | P1: Interface | Execute | Implemented |
| UI-05 | P1: Interface | Execute | Implemented |
| UI-06 | P1: Interface | Execute | Implemented |
| KEY-01 | P2: Teclado | Execute | Implemented |
| KEY-02 | P2: Teclado | Execute | Implemented |
| KEY-03 | P2: Teclado | Execute | Implemented |
| KEY-04 | P2: Teclado | Execute | Implemented |
| KEY-05 | P2: Teclado | Execute | Implemented |
| A11Y-01 | P2: A11y | Execute | Implemented |
| A11Y-02 | P2: A11y | Execute | Implemented |
| A11Y-03 | P2: A11y | Execute | Implemented |
| A11Y-04 | P2: A11y | Execute | Implemented |
| RESP-01 | P2: A11y | Execute | Implemented |
| THEME-01 | P2: A11y | Execute | Implemented |
| QUAL-01 | P2: Qualidade | Execute | Implemented |
| QUAL-02 | P2: Qualidade | Execute | Implemented |
| QUAL-03 | P2: Qualidade | Execute | Implemented |
| QUAL-04 | P2: Qualidade | Execute | Implemented |
| QUAL-05 | P2: Qualidade | Execute | Implemented |

**Coverage:** 44 total, 44 mapped to tasks, 0 unmapped. All implemented; waiting for proofs and the Verifier.

---

## Sources

- [prd.md](prd.md) - PRD completo: stack, RF01–RF07, arquitetura, testes, critérios de aceite

---

## Success Criteria

- [ ] `npm install && npm run dev` abre a calculadora funcionando.
- [ ] RF01–RF07 implementados, sem `eval` nem `Function`.
- [ ] `npm test` passa com cobertura ≥ 90% em `src/core/`.
- [ ] `npm run build` e `npm run lint` sem erros nem warnings.
- [ ] Layout responsivo com tema claro e escuro; `README.md` completo.
