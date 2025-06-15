# CurCalc

CurCalc is a full-stack currency-conversion tool built with **Vue 3** on the front-end and **Node.js + Express** on the back-end.  
It lets users log in, look up real-time exchange rates stored in a simple JSON “database,” and perform safe, two-way currency conversions.

---

## Features

| Area | Highlights |
|------|-------------|
| **Authentication** | Simple token-based login screen (demo credentials: `username` / `password`) |
| **Conversion logic** | If the requested pair isn’t stored, the back-end automatically flips the reverse rate so 15 stored pairs yield 30 usable directions |
| **Admin tools** | Logged-in users can add, edit or delete rates in a spreadsheet-style editor |
| **Error handling** | Front-end guards against invalid amounts, missing dropdown values and empty rate tables |

---

## Tech Stack

| Layer | Main libraries |
|-------|----------------|
| Front-end | Vue 3 • Vue CLI • Axios |
| Back-end | Node.js • Express • `dotenv` • `jsonwebtoken` |
| Data store | Flat-file `rates.json` (no external DB) |

---

## Directory structure
```text
.
├── currency-calculator-backend
│   ├── app.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── convertController.js
│   │   └── rateController.js
│   ├── data
│   │   └── rates.json
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── package-lock.json
│   ├── package.json
│   └── routes
│       ├── auth.js
│       ├── convert.js
│       └── rates.js
├── currency-calculator-frontend
│   ├── README.md
│   ├── babel.config.js
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── CurCalcLogo.ico
│   │   └── index.html
│   ├── src
│   │   ├── App.vue
│   │   ├── assets
│   │   │   ├── CurCalcLogo.png
│   │   │   └── main.css
│   │   ├── components
│   │   │   ├── AmountInput.vue
│   │   │   ├── CurrencyConverter.vue
│   │   │   ├── CurrencySelect.vue
│   │   │   ├── ExchangeRateDisplay.vue
│   │   │   ├── LoginForm.vue
│   │   │   └── RateEditor.vue
│   │   └── main.js
│   └── vue.config.js
├── documentation
│   └── CurCalc.pdf
└── readme.txt
```
## Prerequisites

| Tool | Version (or newer) |
|------|--------------------|
| Node.js | 18 LTS |
| npm or yarn | any recent |

Ensure ports **5050** (back-end) and **8080** (front-end) are free.

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/<your-user>/curcalc.git
cd curcalc


cd backend
cp .env.example .env   # add your TOKEN_SECRET
npm install
node app.js            # or nodemon app.js

Front-end

cd ../frontend
npm install
npm run serve          # Vue CLI dev server on http://localhost:8080

Visit http://localhost:8080 and log in with the demo credentials above.
