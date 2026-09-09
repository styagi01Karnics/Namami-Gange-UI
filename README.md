# Namami Gange — Ops Dashboard

React + Vite + Tailwind implementation of the Figma design system.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Built so far
| Route | Page | Status |
| --- | --- | --- |
| `/dashboard` | Dashboard | complete |
| `/stp-management` | STP Management (Manpower tab) | complete |
| `/contracts` | Contracts | complete |
| `/compliance` | Compliance | complete |
| `/manpower` | Manpower | complete |
| `/cctv-monitoring` | CCTV Monitoring | complete |
| `/inventory` | Inventory | complete |
| `/reports/contracts` | Data Reports › Contracts | complete |
| `/reports/compliance` | Data Reports › Compliance | complete |
| `/reports/manpower` | Data Reports › Manpower | complete |
| `/reports/cctv-monitoring` | Data Reports › CCTV Monitoring | complete |
| `/reports/inventory` | Data Reports › Inventory | complete |
| `/remote-calibration` | Remote Calibration | complete |
| `/transaction-logs` | Transaction Logs | complete |
| `/settings` | Settings (6 panels) | complete — no Figma, designed to match |
| `/live-status` | — | `ComingSoon` placeholder (nav link hidden) |

## Stack
- **Vite + React 19 + react-router-dom** — app shell and routing
- **Tailwind CSS 3** — design tokens in `tailwind.config.js` (`brand`, `ok`, `warn`, `danger`, `navy`, `ink`, `canvas`, `line`, `orange`)
- **Recharts** — area chart (Inlet vs Outlet), line charts (Attendance Trends, Parameter Trend)
- **lucide-react** — icons
- Gauges and the nested attendance donut are hand-rolled SVG (`src/components/charts/`) so the arc geometry matches Figma exactly.

## ⚑ All mock data lives in ONE file
`src/data/mockData.js` — every hard-coded number, label and row in the app.
It is split into eleven commented sections (Shared / Dashboard / STP Management / Contracts /
Compliance / CCTV Monitoring / Inventory / Data Reports / Remote Calibration /
Transaction Logs / Settings) and each
export is already shaped the way its component consumes it, so API integration is:

```js
// before
export const stpManpower = { totalEmployees: 98, ... }

// after
const stpManpower = await api.get(`/stp/${id}/manpower`)
```

No component reads a literal — they all import from this file.

## Structure
```
src/
  data/mockData.js              ← THE data file
  routes.js                     ← nav structure + route paths + page titles
  App.jsx                       ← router + shell (Sidebar | Topbar + page)
  layout/                       ← Sidebar, Topbar, Filters
  pages/                        ← Dashboard, StpManagement, ComingSoon
  components/ui/                ← Card, CardTitle, Select, Avatar, StatusPill,
                                  IconToggle, DateRangeField, SearchInput,
                                  ExportButton, PdfIcon, StatCardsRow,
                                  GaugeSummaryCard, Toggle, Field, Button,
                                  CheckboxChip, Logo
  components/cards/             ← dashboard widgets (one file each)
  components/stp/               ← STP header, accordions, tabs
  components/manpower/          ← the four Manpower widgets, shared by the
                                  /manpower page and the STP Management tab
  components/contracts/         ← table + expandable detail panel
  components/compliance/        ← violations table, summary strip, recovery
                                  timeline, penalty panel, parameter trend
  components/cctv/              ← camera summary, feed tiles, PlantScene
  components/inventory/         ← chemical table, category donut
  components/reports/           ← ReportShell (filter bar), ReportTable
                                  (config-driven: search, sort, expandable
                                  rows — also used by Remote Calibration and
                                  Transaction Logs), shared cells, trend chart
  pages/reports/                ← the five Data Reports sub-pages
  components/settings/          ← section nav + the six settings panels
  components/charts/            ← PenaltyGauge, SegmentedGauge, NestedDonut, arc helpers
  components/illustrations/     ← FlowBeaker (inlet pipe / outlet tap variants)
```

## What's interactive (all client-side, no API)
- Sidebar navigation + `Data Reports` accordion + collapse toggle
- STP picker (swaps the whole header card — 5 STPs in `stpDetails`)
- `Details` toggle on the STP header card
- Both accordion panels (`Realtime Parameter Values`, `Parameter Trend Analysis`)
- Section tabs; `Manpower` is built, the rest show a placeholder panel
- Staff Availability: status filter, search, sort-by-status, collapse
- Department Manpower Status: collapse
- Dashboard: date range, state filter, chart period, Critical STP tabs
- Contracts: STP picker, search across all columns, sort on 4 columns,
  per-row expandable detail panel (row 1 open by default, like the Figma)
- Compliance: parameter pills (pH/BOD/COD/TSS/Flow/Temperature), basis dropdown,
  search, sort by status, per-row expandable violation panel with trend chart
- Manpower: same widgets as the STP Management Manpower tab (one shared
  component set, so a change lands in both places)
- CCTV Monitoring: STP picker, date range; feed tiles render Live vs Offline
  states (offline is desaturated)
- Inventory: stock-status filter pills, search, sort on Category/Status,
  collapse on both bottom cards
- Data Reports (5 sub-pages): breadcrumb heading, All-STP + date filters,
  per-table search and column sorting; Compliance adds parameter pills + basis
  dropdown, Inventory adds a category dropdown
- Remote Calibration: Influent/Effluent checkboxes filter the table, plus search
  and sort by status
- Transaction Logs: per-row expandable JSON payload
- Settings: six panels (Profile, Notifications, Alert Thresholds, Preferences,
  Security, Team & Roles) — toggles, editable fields and dropdowns all hold
  local state. The panel is deep-linkable: `/settings?section=security`

## Settings — no Figma
There was no design for this section, so it was built from the existing system:
same `Card`, tokens, `Select`, `StatusPill`, `Avatar` and table styling as the
rest of the app. Content is modelled on what this portal actually needs
(parameter thresholds, breach grace period, alert channels, roles), so it should
be reviewed against intent rather than pixels. Three new primitives came out of
it and are reusable elsewhere: `Toggle`, `Field`, `Button`.

## Hidden nav items
`Live Status` is commented out in `src/routes.js` (`REPORT_ITEMS`) until that
section is ready. Its route and `ComingSoon` page still resolve — uncomment the
one line to bring the link back.

## Adding the next section
1. Add the item + path to `src/routes.js` (it appears in the sidebar automatically).
2. Add its data to the relevant section of `src/data/mockData.js`.
3. Create `src/pages/<Name>.jsx` and swap its `ComingSoon` route in `App.jsx`.
4. Reuse `Card`, `Select`, `StatusPill`, `IconToggle`, `DateRangeField` so spacing and colour stay consistent.

## Placeholders to replace
- `src/components/ui/Logo.jsx` — text approximation of the official **नमामि गंगे** mark; drop the real asset in `public/`.
- `src/components/ui/Avatar.jsx` — inline SVG stand-in for user photos.
- The two STP accordion **bodies** — Figma only specifies them collapsed, so the expanded
  content (`RealtimeParametersPanel`, `ParameterTrendPanel`) is a reasonable stand-in.
- `src/components/cctv/PlantScene.jsx` — drawn stand-in for the camera stills.
  Set `image` (poster) and/or `stream` on a feed in `cameraFeeds` and the tile
  renders that instead; no component change needed.
