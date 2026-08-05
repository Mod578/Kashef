<p align="center">
  <img src="public/favicon.svg" alt="Kashef logo" width="120">
</p>

<h1 align="center">Kashef (كاشف)</h1>

<p align="center">Point a camera at a PC part and get it identified, with specs and an assistant that answers questions about it, in Arabic.</p>

<p align="center">
  <a href="https://github.com/Mod578/Kashef/actions/workflows/ci.yml"><img src="https://github.com/Mod578/Kashef/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <img src="https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite 5">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT licence">
</p>

## About

Kashef is a browser app that identifies computer hardware from an image. You point the camera at a part or upload a photo, the app sends the frame to Gemini, and the answer comes back as structured data: component name, type, a short technical summary in Arabic, and a list of specifications. A chat assistant is attached to each detected part for follow-up questions about compatibility and upgrades.

It was built as the graduation project for the Data Science and Artificial Intelligence diploma at Tuwaiq Academy. The interface is Arabic and right to left throughout.

**Status:** working project, usable as it stands, but there is no automated test suite yet and it has not been through a production deployment.

## Features

- Identification from the device camera, an uploaded image, or an MP4 or WebM video frame
- Structured output enforced by a response schema, so specs arrive as data rather than free text
- Generated reference image for a selected component, using Imagen
- Chat assistant grounded with Google Search for current information
- Scan history kept in the browser
- Light and dark themes, responsive layout, RTL interface

## How it works

1. A frame is captured and sent to `gemini-2.5-flash` with a JSON response schema that fixes the shape of the answer.
2. The parsed components are rendered on a dashboard. Each one gets a deterministic id derived from its name.
3. Selecting a component calls `imagen-4.0-generate-001` for an illustrative image and starts a chat session seeded with that component's context.
4. General questions go to a separate chat session that has Google Search enabled as a tool.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 18, TypeScript, Tailwind CSS |
| Build | Vite 5 |
| State | React Context and custom hooks |
| AI | `@google/genai`, Gemini 2.5 Flash, Imagen 4 |
| Icons | React Icons |

## Requirements

- Node.js 18 or newer
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- A browser with camera access for live scanning, or any browser for file upload

## Setup

```bash
git clone https://github.com/Mod578/Kashef.git
cd Kashef
npm install
cp .env.example .env.local   # then put your key in it
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | `.env.local` for local work | Gemini API key |
| `API_KEY` | deployment environment | same key, read as a fallback by `vite.config.ts` |

`vite.config.ts` substitutes whichever one is set into `process.env.API_KEY` at build time. `.env.local` is ignored by git.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | type check, then production build into `dist/` |
| `npm run preview` | serve the built output locally |

## Project structure

```
.
├── .github/workflows/   CI: type check and build
├── public/              favicon and static assets
├── src/
│   ├── components/      UI components
│   ├── constants/       prompts and model names
│   ├── context/         app state
│   ├── data/            demo dataset
│   ├── hooks/           camera, storage, component data
│   ├── services/        Gemini wrapper
│   ├── types/           shared types
│   ├── utils/           helpers
│   ├── App.tsx
│   ├── index.css        Tailwind entry
│   └── main.tsx         application entry
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## Deployment

`npm run build` produces a static `dist/` that any static host will serve. Camera capture requires HTTPS on anything other than localhost.

## Security notes

- The API key is inlined into the client bundle at build time, so anyone who loads a deployed copy can read it. For a public deployment, put the key behind a small backend proxy and call that instead, or restrict the key by referrer and quota in Google AI Studio.
- Images and video frames are sent to the Gemini API for analysis. Nothing is uploaded anywhere else.
- Scan history is stored in the browser's local storage. There is no backend and no account.

## Limitations

- Identification quality depends on lighting, angle, and how visible the model markings are. Confidence is reported per component and can be wrong.
- Generated component images are illustrations, not photographs of the exact part.
- No automated tests yet. CI runs type checking and the build.
- Requires network access, nothing works offline.

## Team

- Mohammed Almutairi
- Khalid Alosmani

## License

[MIT](LICENSE).
