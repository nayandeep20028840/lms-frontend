# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

---

## Backend Architecture: DynamoDB Single Table Design

The backend database is strictly designed using DynamoDB Single-Table Design. This ensures extreme scalability, eliminates the need for expensive relational joins, and perfectly supports a multi-tenant (multi-bank) architecture.

### 1. Access Patterns

| ID | Access Pattern | User Role | Description |
|---|---|---|---|
| **AP1** | Get User Profile | Both | Fetch user details by email during login. |
| **AP2** | Get System Config | Admin | Fetch global config values (e.g., `total_outlay` remaining). |
| **AP3** | Get Pending Loan Applications | Admin | Fetch all applications for a *specific bank* by status, sorted by newest first. |
| **AP4** | Get All Loan Transactions | Admin | Fetch all approved loan transactions for a *specific bank*, sorted by newest first. |
| **AP5** | Get User's Loan Applications | Customer | Fetch all loan applications submitted by a specific user across the platform. |
| **AP6** | Verify Password Reset | Both | Verify a temporary token for the forgot password flow. |

### 2. Schema Matrix

We utilize **ULIDs** (Universally Unique Lexicographically Sortable Identifiers) for application and transaction Partition Keys. ULIDs provide massive write distribution (no hot partitions) and are inherently sortable by time.

| Entity | PK (Partition Key) | SK (Sort Key) | GSI1PK | GSI1SK | GSI2PK | GSI2SK | Example Attributes |
|---|---|---|---|---|---|---|---|
| **User Profile** | `USER#<email>` | `PROFILE` | - | - | - | - | `role`, `name`, `password_hash` |
| **System Config**| `GLOBAL#LOAN` | `TOTAL#AMOUNT` | - | - | - | - | `value`, `updated_at` |
| **Application** | `APP#<ULID>` | `APP#<ULID>` | `APPLOAN#STATUS#<status>`| `<ULID>` | `USER#<email>` | `<ULID>` | `amount`, `applicantName`, `docs` (S3 object keys) |
| **Transaction** | `TXN#<ULID>` | `TXN#<ULID>` | `TRANSACTION#STATUS#<status>`| `<ULID>` | - | - | `applicantEmail`, `amount`, `date` |
| **Reset Token** | `TOKEN#<token>` | `TOKEN#<token>` | - | - | - | - | `email`, `expires_at` (DynamoDB TTL) |

### 3. Key Design Decisions

## TODO : Update Description
