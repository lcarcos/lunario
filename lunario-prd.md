# PRD · Lunário: Ciclos & Metas
**Versão:** 1.0  
**Data:** 18 mar 2026  
**Status:** Em desenvolvimento — MVP ativo

---

## 1. Visão Geral do Produto

O **Lunário** é um SaaS de planejamento anual que substitui o calendário gregoriano pelo ciclo lunar e astrológico, cobrindo o período de **março de 2026 a abril de 2027** (do Ponto Zero em Peixes ao Ano Novo Astrológico em Áries 2027).

O produto une a sabedoria dos ciclos lunares com ações práticas de produtividade e negócios, permitindo que o usuário registre intenções e metas alinhadas a cada uma das **52 fases lunares** do ano astrológico — com sincronização entre dispositivos via Supabase.

> **Posicionamento:** "Slow Productivity" — em oposição direta aos planners corporativos rígidos. O Lunário respeita os ritmos naturais e oferece um planejamento cíclico, intuitivo e sustentável.

---

## 2. Objetivos de Negócio

| Objetivo | Métrica de sucesso |
|---|---|
| Monetização via venda de acesso anual ao ciclo 2026–2027 | Receita MRR / vendas do ciclo |
| Retenção — usuário retorna a cada mudança de fase lunar | 52 touchpoints naturais por ano |
| Diferenciação como ferramenta de Slow Productivity | NPS e reviews qualitativos |

---

## 3. Público-Alvo

- **Empreendedoras e criativos** que já acompanham astrologia e buscam integrar esse framework ao trabalho
- **Pessoas que planejam de forma não-linear** — buscam ritmo e intuição, não só metas rígidas
- **Usuários de planners digitais** (Notion, Goodnotes, Google Calendar) que querem algo mais leve e focado

---

## 4. Ciclos e Conteúdo (Dados Hardcoded)

O ano astrológico é composto de **13 ciclos** e **52 fases**. Cada fase contém:

- Tema astrológico central
- 4 sugestões práticas de produtividade/negócios
- Campo de intenção editável pelo usuário

### 4.1 Mapa completo dos ciclos

| # | Signo | Período | Tema central |
|---|---|---|---|
| 0 | ♓ Peixes · Ponto Zero | 18 mar → 16 abr 2026 | Dissolução · encerramento · preparação |
| 1 | ♈ Áries | 17 abr → 15 mai 2026 | Ano novo astrológico · intenção · coragem |
| 2 | ♉ Touro | 16 mai → 13 jun 2026 | Enraizamento · manifestação · recursos |
| 3 | ♊ Gêmeos | 14 jun → 12 jul 2026 | Comunicação · conexão · Solstício de Verão |
| 4 | ♋ Câncer | 13 jul → 10 ago 2026 | Cuidado · intuição · bases |
| 5 | ♌ Leão | 11 ago → 8 set 2026 | Criatividade · liderança · expressão |
| 6 | ♍ Virgem | 9 set → 7 out 2026 | Análise · aperfeiçoamento · serviço |
| 7 | ♎ Libra | 8 out → 5 nov 2026 | Equilíbrio · parcerias · decisões |
| 8 | ♏ Escorpião | 6 nov → 4 dez 2026 | Transformação · profundidade · renovação |
| 9 | ♐ Sagitário | 5 dez 2026 → 2 jan 2027 | Visão · expansão · planejamento 2027 |
| 10 | ♑ Capricórnio | 3 jan → 31 jan 2027 | Estrutura · ambição · Ano Novo gregoriano |
| 11 | ♒ Aquário | 1 fev → 1 mar 2027 | Inovação · coletivo · disrupção |
| 12 | ♓ Peixes | 2 mar → 1 abr 2027 | Encerramento do ano astrológico |
| ∞ | ♈ Áries 2027 | c. 2 abr 2027 | Próximo Ano Novo Astrológico |

### 4.2 Estrutura de cada fase (JSON)

```json
{
  "id": "aries-26-1",
  "cycle_id": 1,
  "phase_index": 1,
  "moon": "🌑",
  "name": "Lua Nova",
  "date": "2026-04-17",
  "sign": "Áries ♈",
  "theme": "Ano novo. Que projeto ousado você lança agora?",
  "suggestions": [
    "Escrever as 3 intenções principais do ano astrológico",
    "Lançar novo projeto ou produto",
    "Definir metas anuais com prazos",
    "Criar ritual de início do ciclo"
  ]
}
```

---

## 5. Requisitos Funcionais

### 5.1 Autenticação · Supabase Auth

- Login com **e-mail + senha** e **OAuth Google**
- Sessão persistente entre dispositivos
- **Paywall:** após o Ciclo 0 (Peixes · Ponto Zero), o acesso é restrito a usuários com pagamento confirmado
- O Ciclo 0 funciona como **freemium / trial** — permitindo conversão orgânica antes da compra

### 5.2 Visualizações de Tempo · Front-end

#### ① Timeline Vertical
- Linha do tempo contínua dos 13 ciclos e 52 fases
- Agrupamento por signo com cabeçalho de período
- Indicadores visuais (bolinhas douradas) nas fases com intenção salva
- Destaque na fase correspondente ao **dia atual**
- Marcos solares integrados: Equinócio (20 mar), Solstício (21 jun), Ano Novo gregoriano (1 jan)

#### ② Vista por Ciclo
- Seletor de ciclos (navegação por signo)
- Card hero com signo, tema, glifo e período
- Grid de 4 fases por ciclo, expansível ao clique
- Dentro de cada fase: tema astrológico, 4 sugestões práticas e campo de intenção
- Botão salvar com feedback visual de confirmação

#### ③ Calendário Mensal
- Grid semanal navegável mês a mês (set anterior / próximo)
- Fases lunares marcadas diretamente nos dias correspondentes
- Indicador de nota salva por dia
- Clique no dia abre modal com conteúdo da fase e campo de intenção

### 5.3 Gerenciamento de Intenções · Supabase DB

- Cada uma das 52 fases suporta **1 campo de texto livre** por usuário
- Salvamento explícito via botão (com feedback "✓ salvo")
- **Sincronização cross-device:** intenção salva no desktop disponível no mobile
- Indicadores visuais de fases preenchidas em todas as vistas
- Sem limite de caracteres no campo de intenção

### 5.4 Paywall e Acesso

- **Ciclo 0 (Peixes):** acesso gratuito — funciona como onboarding e conversão
- **Ciclos 1–13:** acesso pago — desbloqueado após confirmação de pagamento
- Integração com **Stripe** ou **Hotmart** para confirmação de compra
- Flag `is_paid` no perfil do usuário no Supabase

---

## 6. Requisitos Não Funcionais

| Requisito | Especificação |
|---|---|
| **Performance** | First Contentful Paint < 1.5s · LCP < 2.5s |
| **PWA** | Instalável como atalho na tela inicial (mobile-first) · Service Worker para cache offline do conteúdo estático |
| **Responsividade** | Layout funcional de 320px a 1440px |
| **Privacidade** | Intenções vinculadas ao `user_id` · RLS (Row Level Security) ativo no Supabase |
| **Disponibilidade** | Uptime > 99.5% (Supabase + Vercel/Netlify) |

---

## 7. Estrutura de Dados · Supabase

### Tabela: `intentions`

```sql
CREATE TABLE intentions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_id    INT NOT NULL,       -- 0 a 13
  phase_id    TEXT NOT NULL,      -- ex: "aries-26-1" (slug único da fase)
  content     TEXT,               -- texto da intenção
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Índice para queries por usuário
CREATE INDEX idx_intentions_user ON intentions(user_id);

-- RLS: usuário só acessa suas próprias intenções
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user owns intentions"
  ON intentions FOR ALL
  USING (auth.uid() = user_id);
```

### Tabela: `profiles`

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_paid     BOOLEAN DEFAULT FALSE,
  paid_at     TIMESTAMPTZ,
  plan        TEXT DEFAULT 'free'  -- 'free' | 'annual_2026'
);
```

---

## 8. User Stories

```
Como usuário não autenticado,
  quero explorar o Ciclo 0 (Peixes) gratuitamente
  para entender o produto antes de comprar.

Como usuário cadastrado,
  quero que minhas intenções sejam salvas na nuvem
  para não perdê-las ao trocar de dispositivo.

Como usuário,
  quero ver qual fase da lua estamos hoje
  para saber se devo agir, criar, colher ou refletir.

Como usuário,
  quero ler as 4 sugestões práticas de cada fase
  para saber como aplicar a energia do signo no meu trabalho.

Como usuário pago,
  quero ter acesso a todos os 13 ciclos
  para planejar o ano astrológico completo.
```

---

## 9. Arquitetura Técnica Recomendada

```
Frontend
└── Next.js 14 (App Router)
    ├── TypeScript
    ├── Tailwind CSS
    └── PWA (next-pwa)

Backend / BaaS
└── Supabase
    ├── Auth (email + Google OAuth)
    ├── PostgreSQL (intentions + profiles)
    └── RLS policies

Pagamento
└── Stripe Checkout (preferred) ou Hotmart
    └── Webhook → atualiza profiles.is_paid

Deploy
└── Vercel (frontend)
└── Supabase Cloud (backend)
```

### Variáveis de ambiente necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_ID=
```

---

## 10. Roadmap de Lançamento

### Fase 1 · MVP (Agora → Abril 2026)
- [ ] Setup Next.js + Supabase + Tailwind
- [ ] Autenticação (email + Google)
- [ ] Dados hardcoded dos 13 ciclos e 52 fases
- [ ] 3 vistas: Timeline · Por Ciclo · Mensal
- [ ] Persistência de intenções no Supabase
- [ ] Paywall pós Ciclo 0
- [ ] Integração Stripe / Hotmart
- [ ] Deploy Vercel + domínio
- [ ] PWA (instalável no mobile)

### Fase 2 · Engajamento (Abril → Junho 2026)
- [ ] Notificações Push via Web Push API (avisar mudança de fase)
- [ ] E-mail automático a cada nova lua (Resend ou Loops)
- [ ] Página de perfil com histórico do ciclo atual

### Fase 3 · Retenção (Junho → Setembro 2026)
- [ ] Dashboard de retrospectiva — todas as intenções do ano em uma vista
- [ ] Exportação das intenções em PDF
- [ ] Sistema de "check" — marcar intenção como realizada
- [ ] Preparação do ciclo 2027–2028 para renovação de assinatura

---

## 11. Design System · Referência Visual

O MVP já possui identidade visual definida com dois modos:

| Token | Modo Claro | Modo Escuro |
|---|---|---|
| Background | `#ffffff` | `#0e0d0b` |
| Texto principal | `#1a1814` | `#ede5d0` |
| Destaque / dourado | `#1a1814` | `#c8b97a` |
| Texto secundário | `rgba(26,24,20,0.45)` | `rgba(237,229,208,0.38)` |
| Borda | `rgba(26,24,20,0.08)` | `rgba(200,185,122,0.1)` |

**Tipografia:**
- Display / headings: `Cormorant Garamond` (300, 400, italic)
- UI / body: `DM Sans` (300, 400, 500)

**Formato de posts para redes sociais:** 4:5 (feed Instagram) · identidade visual já validada

---

## 12. Fora do Escopo (v1.0)

- App nativo iOS / Android
- Calendário compartilhado / multi-usuário
- Integração com Google Calendar
- IA para geração de intenções
- Ciclos personalizados pelo usuário
- Suporte a múltiplos idiomas

---

*Documento gerado em 18 mar 2026 · Lunário v1.0*
