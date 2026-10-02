# 🚄 erb-tools
> **The open-source developer toolkit and API ecosystem for eurobahn (ERB) transit data in Germany.**

Welcome to `erb-tools`! This project provides an incredibly flexible, modular, and type-safe ecosystem to fetch, process, and serve live public transit data for the eurobahn network. Built with Hexagonal Architecture in a Turborepo monorepo, it enables rapid development of CLI tools, backend APIs, and scraping fallbacks—all sharing a single, robust business logic core.

---

## 🏗 Architecture Overview (Ports & Adapters)

This monorepo strictly follows **Hexagonal Architecture**. The business logic is isolated in the `@erb-tools/core` package. External systems (like HAFAS or website scraping) are implemented as *Adapters* that fulfill the *Ports* (Interfaces) defined in the Core.

```text
📦 erb-tools
 ┣ 📂 packages
 ┃ ┣ 📂 core                     # 🧠 The Business Brain (Domain Types, Ports/Interfaces)
 ┃ ┃ ┗ 📜 NO external frameworks or network libraries here. Pure TypeScript.
 ┃ ┣ 📂 data-sources             # 🔌 The Adapters
 ┃ ┃ ┣ 📂 hafas-client           # Implementation of TransitDataPort using db-hafas
 ┃ ┃ ┗ 📂 web-scraper            # Fallback scraping of eurobahn.de traffic updates
 ┃ ┗ 📂 entrypoints              # 🚀 The Consumer Applications
 ┃   ┣ 📂 api                    # Express.js REST API providing clean JSON
 ┃   ┗ 📂 cli                    # Commander-based terminal interface
 ┣ 📜 turbo.json                 # Turborepo Build Pipelines
 ┣ 📜 pnpm-workspace.yaml        # Workspace configuration
 ┗ 📜 package.json
```

## 🛠 Prerequisites

- Node.js (v20+)
- `pnpm` (v8+)

## 🚀 Getting Started

Clone the repository and install all dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/erb-tools.git
cd erb-tools
pnpm install
```

### Build the Monorepo

Compile all packages using Turborepo's ultra-fast caching:

```bash
pnpm build
```

---

## 🎮 How to Run

### 1. The CLI Tool
Get live departures for a station (e.g., Dortmund Hbf: `8000080`) directly in your terminal:

```bash
cd packages/entrypoints/cli
node dist/index.js departures 8000080
```

### 2. The REST API
Spin up the local Express backend to serve data over HTTP:

```bash
cd packages/entrypoints/api
# Uses the PORT env variable or defaults to 3000
pnpm start
```
Test the endpoint: [http://localhost:3000/v1/departures/8000080](http://localhost:3000/v1/departures/8000080)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
We enforce strict TypeScript typing and modular design. Feel free to check the issues page or open a PR.

## 📄 License
This project is [MIT licensed](./LICENSE).
