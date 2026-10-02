# 🚄 erb-tools
> **Generalized Open-Source Framework and Developer Toolkit specifically optimized for tracking eurobahn (ERB) transit operations.**

Welcome to `erb-tools`! This project provides an incredibly flexible, generalized domain-driven ecosystem to fetch, process, and serve live public transit data. It defaults to extracting Eurobahn metrics across regional transit operations. Built with Hexagonal Architecture in a Turborepo monorepo, it enables rapid development of CLI tools, backend APIs, and scraping fallbacks.

---

## 🏗 Architecture Overview (Ports & Adapters)

This monorepo strictly follows **Domain-Driven Design** and **Hexagonal Architecture**. The business logic is generalized (e.g. `TransitDeparture`) and isolated in the `@erb-tools/core` package. External systems (like HAFAS or website scraping) are implemented as *Adapters* that fulfill the *Ports* defined in the Core, filtering down to eurobahn logic seamlessly.

```text
📦 erb-tools
 ┣ 📂 packages
 ┃ ┣ 📂 core                     # 🧠 Generalized Business Domain & Transit Ports
 ┃ ┃ ┗ 📜 NO external frameworks or network libraries here. Pure TypeScript.
 ┃ ┣ 📂 data-sources             # 🔌 The Adapters
 ┃ ┃ ┣ 📂 hafas-client           # Implementation of TransitDataPort using db-hafas
 ┃ ┃ ┗ 📂 web-scraper            # Fallback scraping of traffic updates
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
git clone https://github.com/dwohlgemuth-link/erb-tools.git
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
Get live generalized departures for a station (e.g., Dortmund Hbf: `8000080`), strictly filtered for Eurobahn operators:

```bash
cd packages/entrypoints/cli
node dist/index.js departures 8000080 --operator eurobahn
```

### 2. The REST API
Spin up the local Express backend to serve data over HTTP:

```bash
cd packages/entrypoints/api
# Uses the PORT env variable or defaults to 3000
pnpm start
```
Test the generalized eurobahn endpoints:
- Departures: [http://localhost:3000/v1/eurobahn/departures/8000080](http://localhost:3000/v1/eurobahn/departures/8000080)
- Disruptions: [http://localhost:3000/v1/eurobahn/disruptions](http://localhost:3000/v1/eurobahn/disruptions)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
We enforce strict TypeScript typing and modular design. Feel free to check the issues page or open a PR.

## 📄 License
This project is [MIT licensed](./LICENSE).
