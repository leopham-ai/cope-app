# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital COPE (Cancer Outcomes & Prognosis Evaluation) is a 100% stateless web application for generating patient-friendly cancer prognosis documents. Patient data is held only in browser session memory and is cleared on refresh.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: React 19 + Vite 8
- **PDF Engine**: @react-pdf/renderer (client-side PDF generation)
- **Styling**: Tailwind CSS v4 (utility-first, responsive)
- **Icons**: Lucide React
- **State**: React useState/useReducer (session-only, no persistence)
- **TypeScript**: Strict mode enabled

## Architecture

### Key Principles

1. **Zero Data Persistence**: No localStorage, sessionStorage, or server storage. All state lives in React components and is cleared on unmount/refresh.
2. **Client-Side PDF**: PDF generation happens entirely in the browser using @react-pdf/renderer.
3. **API Contract**: SEER API integration is designed via contract-first approach with mock data for development.

### Directory Structure

```
src/
├── components/
│   ├── PatientForm/     # Main form: Demographics, Cancer Details, Treatment, Survival Matrix
│   ├── PDF/             # @react-pdf document components
│   └── ui/              # Shared UI primitives (Button, Card, Select, Checkbox, Input)
├── services/
│   └── api.ts           # SEER API contract + mock implementation
├── hooks/
│   └── useSessionState.ts  # Auto-clearing state hook
├── types/
│   └── index.ts         # TypeScript interfaces (PatientData, SurvivalData, etc.)
└── constants/
    └── clinicalBins.ts  # Clinical constants (age groups, stages, grades)
```

### Clinical Data Model

- **Demographics**: Patient name, MRN (optional), date, provider, sex, age (binned: 18-34, 35-49, 50-59, 60-69, 70-79, 80-90)
- **CancerDetails**: Stage (Localized/Regional/Metastatic), Grade (Well/Moderately/Poorly differentiated), Histology, Diagnosis Timeline
- **TreatmentPlan**: Goals (Cure/Remission/Comfort), Treatments (Radiation/Surgery/Immunotherapy/Chemotherapy/etc.)
- **SurvivalMatrix**: 6mo/1yr/2yr/5yr survival rates with physician override capability

### PDF Output

The PDF document includes:
- Patient information header
- Cancer details summary
- Treatment plan badges
- **"100 People" Visualization**: Horizontal bar showing distribution of outcomes (worst case/typical/best case)
- Survival timeline grid (6mo, 1yr, 2yr, 5yr)
- Educational footer with "3 Questions to Ask Your Doctor"
- Advance Care Planning prompt

### SEER API Contract

Located in `src/services/api.ts`:
- `fetchSurvivalData(request: SEERAPIRequest): Promise<SEERAPIResponse>`
- Currently returns mock data based on cancer stage
- Replace mock with real SEER API integration when available

## Development Notes

- Tailwind v4 uses CSS-based configuration (`@import "tailwindcss"` in CSS)
- Large bundle size (1.7MB) is primarily from @react-pdf/renderer - code splitting not yet implemented
- PDF fonts are loaded from Google Fonts CDN at runtime
