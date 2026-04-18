# Arkanos Financial Suite (AFS)

A personal finance desktop suite focused on **bookkeeping, consumption tracking, long-term upkeep planning, savings projection, and property investment follow-up**.

## Project Snapshot

AFS is an Electron + React + TypeScript application that stores financial data as JSON files on disk and provides domain-specific views for:

- Monthly bookkeeping and activity tracking
- Home consumption (electricity, gas, water, heating)
- Car fuel consumption and cost efficiency
- Long-term upkeep planning and historical trend visualization
- Savings reports based on account and activity data
- Property valuation history and investment monitoring

## Badges

### Repository & Delivery

[![GitHub release](https://img.shields.io/github/v/release/matheuscodes/afs?display_name=tag)](https://github.com/matheuscodes/afs/releases)
[![GitHub release date](https://img.shields.io/github/release-date/matheuscodes/afs)](https://github.com/matheuscodes/afs/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/matheuscodes/afs)](https://github.com/matheuscodes/afs/commits/main)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/y/matheuscodes/afs)](https://github.com/matheuscodes/afs/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/matheuscodes/afs)](https://github.com/matheuscodes/afs)
[![GitHub language count](https://img.shields.io/github/languages/count/matheuscodes/afs)](https://github.com/matheuscodes/afs)
[![GitHub top language](https://img.shields.io/github/languages/top/matheuscodes/afs)](https://github.com/matheuscodes/afs)
[![GitHub issues](https://img.shields.io/github/issues/matheuscodes/afs)](https://github.com/matheuscodes/afs/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/matheuscodes/afs)](https://github.com/matheuscodes/afs/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/matheuscodes/afs)](https://github.com/matheuscodes/afs/pulls)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/matheuscodes/afs)](https://github.com/matheuscodes/afs/pulls?q=is%3Apr+is%3Aclosed)
[![License](https://img.shields.io/github/license/matheuscodes/afs)](./LICENSE)

### CI / Automation

[![Tests & Analysis](https://img.shields.io/github/actions/workflow/status/matheuscodes/afs/tests.yml?branch=main&label=tests%20%26%20analysis)](https://github.com/matheuscodes/afs/actions/workflows/tests.yml)
[![Release Workflow](https://img.shields.io/github/actions/workflow/status/matheuscodes/afs/release.yml?label=release%20workflow)](https://github.com/matheuscodes/afs/actions/workflows/release.yml)

### SonarCloud (Quality & Security)

[![Quality Gate Status](https://img.shields.io/sonar/quality_gate/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Coverage](https://img.shields.io/sonar/coverage/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Bugs](https://img.shields.io/sonar/bugs/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/issues?resolved=false&types=BUG&id=matheuscodes_afs)
[![Vulnerabilities](https://img.shields.io/sonar/vulnerabilities/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/issues?resolved=false&types=VULNERABILITY&id=matheuscodes_afs)
[![Code Smells](https://img.shields.io/sonar/code_smells/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/issues?resolved=false&types=CODE_SMELL&id=matheuscodes_afs)
[![Duplicated Lines (%)](https://img.shields.io/sonar/duplicated_lines_density/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Lines of Code](https://img.shields.io/sonar/ncloc/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Reliability Rating](https://img.shields.io/sonar/reliability_rating/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Security Rating](https://img.shields.io/sonar/security_rating/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)
[![Maintainability Rating](https://img.shields.io/sonar/sqale_rating/matheuscodes_afs?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/project/overview?id=matheuscodes_afs)

## Technology Stack

- **Desktop runtime:** Electron
- **Frontend:** React + React Router
- **Language:** TypeScript
- **State management:** Redux + Redux Thunk
- **UI toolkit:** Evergreen UI
- **Charts:** Chart.js + react-chartjs-2
- **Bundling/tooling:** Electron Forge + Webpack
- **Tests:** Jest + Testing Library
- **Quality analysis:** SonarCloud

## Architecture

### High-level view

```mermaid
flowchart LR
  User[User] --> UI[React UI Components]
  UI --> Store[Redux Store]
  Store --> Actions[Action Creators / Thunks]
  Actions --> Services[Domain Services]
  Services --> Bridge[Electron Context Bridge]
  Bridge --> IPC[IPC Channels]
  IPC --> Main[Electron Main Process]
  Main --> FS[(Local JSON Storage)]
  FS --> Main
  Main --> IPC
  IPC --> Bridge
  Bridge --> Services
  Services --> UI
```

### Runtime data flow

```mermaid
sequenceDiagram
  participant U as UI Component
  participant S as Service Layer
  participant B as contextBridge API
  participant M as Main Process
  participant F as storage/ JSON files

  U->>S: request domain data
  S->>B: readFile/readDirectory/listFiles or loadAllFiles
  B->>M: IPC event
  M->>F: read/write filesystem
  F-->>M: JSON payload
  M-->>B: IPC response
  B-->>S: parsed content
  S-->>U: domain model data
```

### Main components and folders

| Path | Responsibility |
|---|---|
| `/home/runner/work/afs/afs/src/index.ts` | Electron main process: window/menu setup, IPC handlers, storage read/write |
| `/home/runner/work/afs/afs/src/contextBridge.ts` | Secure preload bridge exposing `storage` and `filesystem` APIs |
| `/home/runner/work/afs/afs/src/Application.tsx` | Route map for all product areas |
| `/home/runner/work/afs/afs/src/components` | React UI grouped by domain (bookkeeping, consumption, finances, upkeep) |
| `/home/runner/work/afs/afs/src/services` | Domain services that load and transform persisted JSON data |
| `/home/runner/work/afs/afs/src/actions` | Redux actions and async thunks |
| `/home/runner/work/afs/afs/src/reducers` | Redux reducers by bounded context |
| `/home/runner/work/afs/afs/src/models` | Domain models and typed entities |
| `/home/runner/work/afs/afs/base` | Bundled seed data copied into packaged artifacts |
| `/home/runner/work/afs/afs/tests` | Unit/integration tests for services, reducers, actions, and components |

### Data layout (seed/base)

```text
base/
  accounting/
  bookkeeping/
  consumption/
    cars/
    homes/
      <home-id>/
        electricity/
        gas/
        water/
        heating/
  long-term/upkeep/
  investments/properties/
    <property-id>/
```

## Runbooks

### Prerequisites

- Node.js version from `.nvmrc`
- npm
- Linux build dependencies for native canvas modules (see workflow):
  - `build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config`

### Install dependencies

```bash
npm ci --legacy-peer-deps
```

### Start application (development)

```bash
npm start
```

### Run tests

```bash
npm test -- --runInBand
```

### Run lint

```bash
npm run lint
```

### Type check

```bash
npx tsc --noEmit
```

### Package application

```bash
npm run package-linux
npm run package-windows
npm run package-mac
```

### Create distributables

```bash
npm run make
```

### Publish with Electron Forge

```bash
npm run publish
```

### Release/deploy runbook (GitHub Actions)

1. Ensure target commit is in `main`.
2. Create and push a git tag (for example `v2.1.0`).
3. The `release.yml` workflow builds on Windows, packages the app, zips artifacts, and publishes a GitHub Release.

## Feature Guide

### 1) Bookkeeping and monthly activities

Tracks monthly financial activities and account movements, with categorized entries and aggregation views.

![Bookkeeping](docs/images/feature-bookkeeping.png)

### 2) Home consumption monitoring

Tracks utility measurements, prices, and payments for electricity/water/heating, helping estimate and compare costs.

![Electricity](docs/images/feature-electricity.png)

![Water and Heating](docs/images/feature-water-heating.png)

### 3) Car fuel monitoring

Captures fuel fill-ups and supports consumption/cost monitoring for vehicles.

![Car Fuel](docs/images/feature-car-fuel.png)

### 4) Long-term upkeep planning

Displays upkeep events and history-oriented views to monitor recurring long-term expenses.

![Upkeep](docs/images/feature-upkeep.png)

### 5) Property investments

Tracks property valuation history to support investment follow-up.

![Property Investments](docs/images/feature-investments.png)

> Screenshots were generated from the bundled base dataset (`/base`) through an Electron API mock harness to document UI behavior with representative data.

## Project History

### Timeline

| Date | Milestone |
|---|---|
| 2014-07-08 | Initial spreadsheet-based bookkeeping system introduced (`Adding the Bookkeeping Sheet with data from 2013.`) |
| 2019-12-29 | **v1.0.0** tagged (Excel-era release with credit follow-up updates for 2020) |
| 2021-03-06 | Legacy Excel workbook removed and Electron codebase introduced |
| 2021-03-06 to 2021-04-20 | React, Redux, Evergreen UI, persistence, and routed pages added |
| 2023-02-15 | **v2.0.0** tagged (`Using windows to build.`), establishing release automation for desktop packaging |
| 2026-01-31 | Test suite and Sonar configuration expanded |
| 2026-04-18 | Test-noise fixes and coverage-focused quality improvements |

### v1.0.0 (Excel) vs v2.0.0 (Electron Desktop)

| Area | v1.0.0 (Excel workbook) | v2.0.0 (Electron app) |
|---|---|---|
| Delivery format | Single spreadsheet file (`Bookkeeping.xlsx`) | Cross-platform desktop app (Electron + Webpack) |
| UI paradigm | Worksheet tabs and formulas | Routed React screens and reusable components |
| Data model | Cell formulas + tab conventions | JSON files by domain (bookkeeping, accounting, consumption, upkeep, investments) |
| Persistence | Spreadsheet file storage | File-system backed storage via IPC and preload bridge |
| Extensibility | Formula/worksheet maintenance | Service/action/reducer architecture with domain separation |
| Automation | Manual spreadsheet usage | CI tests + Sonar analysis + release workflow |

### Legacy workbook insights (v1.0.0)

The historical workbook included these major sheets:

- `Targets`
- `Overview`
- `Consumption Control`
- Monthly tabs from `January` to `December`

Core capabilities in the spreadsheet era already covered:

- Savings targets and yearly overview
- Utility usage tracking
- Monthly transaction classification

The modern application keeps those goals while providing maintainable code architecture, automated testing, and release automation.

## Security

Please review [`SECURITY.md`](./SECURITY.md) for vulnerability reporting and support details.
