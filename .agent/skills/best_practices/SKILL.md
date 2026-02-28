---
name: best_practices
description: Manual de Boas Práticas: O Guia Definitivo do Desenvolvedor Sênior. Forged by Manus AI.
---

# Manual de Boas Práticas: O Guia Definitivo do Desenvolvedor Sênior

## Prefácio
Este manual estabelece um padrão de excelência para a concepção, desenvolvimento e manutenção de aplicações robustas, escaláveis e seguras, com foco em React, TypeScript e Supabase.

## 1. Arquitetura de Frontend e Componentização
### As Três Camadas Fundamentais
| Camada | Localização | Responsabilidade | Exemplos |
| :--- | :--- | :--- | :--- |
| **Páginas** | `src/modules/{modulo}/*.page.tsx` | Orquestrar fluxo, gerenciar estado global/local, coordenar interação. | `ClientesPage.tsx` |
| **Componentes de Módulo** | `src/modules/{modulo}/components/` | Encapsular lógica de negócio e apresentação de uma funcionalidade. | `ClienteFormAdd.tsx` |
| **Componentes de UI** | `src/lib/ui/` | Blocos de construção visuais reutilizáveis (Dumb). | `Botao.tsx`, `Input.tsx` |

### Regras de Ouro
1. **Componentes não fazem chamadas de API**: Recebem dados via props ou hooks abstratos.
2. **Separação Clara**: Páginas orquestram; Componentes de Módulo focam na funcionalidade.
3. **UI "Burros"**: `src/lib/ui` não tem lógica de negócio.
4. **Legibilidade (INPUT_LEGIBILITY)**: Inputs DEVEM ter fundo claro (#FFFFFF) e fonte escura.

## 2. Camada de Serviço e Segurança (Edge Functions)
1. **Privilégios Mínimos**: `service_role` key NUNCA no frontend. Use Edge Functions para operações sensíveis.
2. **Abstração por Negócio**: Exponha funcionalidades (ex: `processar-pagamento`), não apenas CRUD de tabelas.
3. **Validação Agressiva**: Use Zod para validar TODA entrada.

## 3. Banco de Dados (PostgreSQL)
### As Três Dimensões Financeiras
1. **O Futuro (Expectativas)**: `financial_entries` (promessas, boletos).
2. **O Presente (Realidade)**: `accounts` (onde o dinheiro está agora).
3. **O Passado (Verdade Imutável)**: `financial_transactions` (o livro-razão).

### Regras de Ouro do Banco
- **Saldo Sagrado**: Atualizado SOMENTE via RPC/Trigger no banco.
- **Histórico Imutável**: Transações NUNCA são apagadas; erros geram estornos.
- **Atomicidade**: Use `BEGIN...COMMIT` (RPCs) para operações múltiplas.
- **SECURITY DEFINER**: Use em funções RPC para gatekeeping seguro com `auth.uid()`.

## 4. Multitenancy e Isolamento
- **Regra de Ouro do SaaS**: Toda tabela de cliente DEVE ter `organization_id`.
- **RLS Obrigatório**: Use `is_member_of(organization_id)` em todas as políticas.

## 5. Performance, Cache e Realtime
- **Modelo SWR**: Use TanStack Query para cache e revalidação.
- **Realtime Seletivo**: Use apenas em tabelas críticas. Sempre limpe subscrições no `useEffect`.
- **Otimização de Queries**: Use índices (especialmente compostos para multitenancy) e `EXPLAIN ANALYZE`.

## 6. Tópicos Avançados
- **Testes**: Unitários (Frontend), Integração, API e Banco de Dados.
- **PITR**: Habilite Point-in-Time Recovery.
- **Migrações**: Schema changes apenas via migrações versionadas.

## 7. O Canonico (Comportamento Sênior)
### Regras Absolutas (NUNCA QUEBRE)
1. **MINIMAL_SCOPE_MODIFICATION**: NUNCA modifique código fora do alvo explícito. Seja um cirurgião.
2. **NO_INTERPRETATION**: Execute apenas instruções explícitas.
3. **NO_ASSUMPTIONS**: Se a info não está no contexto, PERGUNTE.
4. **IMMUTABLE_ARCHITECTURE**: Estrutura de pastas e responsabilidades são sagradas.

### Estrutura de Pastas Sagrada
```
src/
├─ lib/
│  └─ supabase.ts (UNICO cliente)
├─ modules/
│  ├─ {modulo}/
│  │  ├─ components/
│  │  ├─ {modulo}.page.tsx (Orquestrador)
│  │  ├─ {modulo}.service.ts (Dados - UNICO local que acessa Supabase)
│  │  └─ {modulo}.types.ts
```
