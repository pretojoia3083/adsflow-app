# AdsFlow SaaS

Automacao de campanhas Meta Ads: da ideia do produto ate a campanha pronta pra rodar.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **IA:** Anthropic Claude API
- **Pagamentos:** Stripe
- **Ads:** Meta Marketing API

## Setup

### 1. Instalar dependencias

```bash
cd adsflow-saas
npm install
```

### 2. Configurar banco de dados

Crie um banco PostgreSQL e configure o `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```
DATABASE_URL="postgresql://user:password@localhost:5432/adsflow"
```

### 3. Rodar migrations

```bash
npx prisma generate
npx prisma db push
```

### 4. Configurar APIs

Edite `.env` com suas chaves:

- **Anthropic API:** https://console.anthropic.com/
- **Stripe:** https://dashboard.stripe.com/
- **Meta Ads:** https://developers.facebook.com/

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura

```
adsflow-saas/
├── prisma/
│   └── schema.prisma          # Schema do banco
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── register/      # Cadastro
│   │   │   ├── market/        # Analise de mercado
│   │   │   ├── copy/          # Gerar copy
│   │   │   ├── campaign/      # Gerar campanha
│   │   │   ├── campaigns/     # CRUD campanhas
│   │   │   ├── presell/       # CRUD presells
│   │   │   ├── publish/       # Publicar no Meta
│   │   │   ├── checkout/      # Stripe checkout
│   │   │   └── webhook/       # Stripe webhook
│   │   ├── dashboard/         # Painel principal
│   │   ├── login/             # Login
│   │   ├── register/          # Cadastro
│   │   └── p/[slug]/          # Presells publicas
│   ├── components/
│   │   ├── AdsFlowWizard.tsx  # Wizard principal
│   │   ├── ScoreRing.tsx      # Indicador visual
│   │   ├── Stepper.tsx        # Navegacao
│   │   ├── Spinner.tsx        # Loading
│   │   └── Providers.tsx      # Session provider
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── auth.ts            # NextAuth config
│   │   ├── anthropic.ts       # API Claude
│   │   ├── meta-ads.ts        # Meta Marketing API
│   │   ├── stripe.ts          # Stripe
│   │   └── presell.ts         # Gerador HTML
│   ├── types/
│   │   └── index.ts           # Tipos
│   └── middleware.ts          # Auth middleware
└── package.json
```

## Funcionalidades

1. **Analise de Mercado** - IA identifica os 6 melhores paises
2. **Geracao de Copy** - 3 variacoes de anuncio por mercado
3. **Presell Editor** - Crie e edite presells
4. **Presell Hospedada** - Links reais (/p/slug)
5. **Campanha Completa** - Verba, dispositivos, keywords, interesses
6. **Publicacao Meta** - Envie direto para o Meta Ads
7. **Sistema de Assinatura** - Stripe para cobranca recorrente
8. **Multi-usuario** - Cadastro e login com JWT

## Deploy

### Vercel

```bash
npm i -g vercel
vercel
```

### Banco de dados

Use um servico como:
- Supes
- Neon
- Railway
- Aiven

### Variaveis de ambiente

Configure todas as variaveis do `.env` no painel da Vercel.

## Proximos passos

- [ ] Adicionar editor visual de presell
- [ ] Integrar com mais redes de afiliados
- [ ] Dashboard de analytics
- [ ] Sistema de template customizado
- [ ] API publica para integracoes
