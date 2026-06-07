# LifeLens — Cancer Detection Frontend

React + TypeScript frontend for the Cancer Detection API.

## Stack
- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **Lucide React** (icons)
- No UI library — fully custom design

## Quick Start

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` → `https://huggingface.co/spaces/shdushantha/cancer-detection-api` automatically.

## Build for Production

```bash
npm run build
# Output in dist/
```

## Features

| Feature | Description |
|---|---|
| Cancer type selector | Lung / Skin / Breast with distinct visual identity |
| File upload | Drag-and-drop or click, with image preview |
| 5 analysis modes | Predict, Grad-CAM, Embeddings, Uncertainty, Full Analysis |
| Model Metrics | Live fetch of pre-computed metrics per cancer type |
| Results display | Confidence bars, Grad-CAM heatmaps, embedding grid, confusion matrix |

## Configuration

To point at a different backend URL, update `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'https://huggingface.co/spaces/shdushantha/cancer-detection-api',
      changeOrigin: true,
    },
  },
},
```

For production builds, set `VITE_API_BASE` env var or update `src/api/cancer.ts`.
