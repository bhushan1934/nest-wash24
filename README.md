<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white" alt="Vercel" />
  <a href="https://github.com/bhushan1934/nest-wash24"><img src="https://img.shields.io/badge/View-Repository-181717?logo=github&logoColor=white" alt="View Repository" /></a>
</p>

<h1 align="center">nest-wash24</h1>
<p align="center">A NestJS + Prisma rewrite of the <a href="https://github.com/bhushan1934/wash24">Wash24</a> laundry/car-wash booking API.</p>

## Status

This is a **second implementation** of the same product as [`wash24`](https://github.com/bhushan1934/wash24) (Laravel). The business problem — OTP-based signup/login, user profiles, a configurable dashboard — is identical; the stack is different: NestJS controllers/services instead of Laravel controllers, and Prisma/PostgreSQL instead of Eloquent/MySQL. The data model here is also richer, with structured Indian-address fields on the user profile and a dedicated `Dashboard` model for configurable home-screen tiles.

Read this alongside `wash24`'s README for the two approaches to the same spec side by side.

## Architecture

```
src/
├── guards/
│   └── auth.guard.ts       # JWT verification via @nestjs/jwt, reads JWT_SECRET from env
└── users/
    ├── users.controller.ts # HTTP routes
    ├── users.service.ts    # OTP generation, auth, profile, dashboard logic; email via nodemailer
    └── dto/                # class-validator request shapes
prisma/
└── schema.prisma           # User, UserProfile, Dashboard models
```

- **Auth guard** (`src/guards/auth.guard.ts`) is a standard NestJS `CanActivate` guard wrapping `@nestjs/jwt`, reading its secret from `JWT_SECRET` — no hardcoded secrets.
- **Email** (`src/users/users.service.ts`) uses `nodemailer` configured from `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` / `FROM_EMAIL` env vars — this part is real and wired up, unlike the SMS side (see below).
- **Deployment**: ships a `vercel.json` routing all methods to `src/main.ts` via `@vercel/node`, the same serverless-on-Vercel approach used for `wash24`, adapted for Node instead of PHP.

## API surface

| Method | Route | Purpose |
|---|---|---|
| POST | `/users/user_registration` | Register a user and generate an OTP |
| POST | `/users/login` | Verify OTP / credentials and issue a JWT |
| POST | `/users/logout` | Invalidate the current session |
| GET | `/users/get_users` | List users |
| POST | `/users/create_profile` | Create/update the Indian-address profile (pincode, flat no., society, area) |
| GET | `/users/get_dashboard` | Fetch configurable dashboard tiles (name + icon) |

## Data model

`prisma/schema.prisma` defines:
- **User** — core account + OTP fields
- **UserProfile** — `pincode`, `flatNo`, `societyName`, `area`, `email` — a structured address model `wash24` doesn't have
- **Dashboard** — named tiles with an icon, for a configurable app home screen

## Known gap (matches `wash24`)

`registerAndGenerateOtp` returns the OTP directly in the API response instead of sending it by SMS — the same shortcut taken in the Laravel version, carried over rather than fixed in the rewrite. Treat any OTP flow here as **demo-only** until a real SMS provider (Twilio, MSG91, etc.) is wired in. Email delivery via `nodemailer`, by contrast, is genuinely implemented and works as a real channel.

## Notes on the dependency list

- `plaid` is listed in `package.json` but is not imported anywhere in `src/` — a leftover from an earlier experiment or a copied `package.json`, not part of this app's functionality. Left in place rather than removed, since pruning dependencies wasn't in scope for this audit.
- `bcrypt` and `bcryptjs` are both present; only one is actually needed.

## Setup

```bash
cp .env.example .env     # fill in DATABASE_URL, JWT_SECRET, EMAIL_*
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Required environment variables (see `.env.example`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/wash24
JWT_SECRET=change_me

EMAIL_HOST=smtp.example.com
EMAIL_USER=
EMAIL_PASS=
FROM_EMAIL=
```

## License

All rights reserved — see [LICENSE](LICENSE).
