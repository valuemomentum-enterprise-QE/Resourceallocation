# Flowboard integration plan

## Problem
Adding the QE delivery HTML into a React app causes:
- `class` vs `className`, boolean `hidden`, void tags
- Large inline `<script>` with DOM APIs (`innerHTML`, `querySelector`) that fight React's virtual DOM
- Chart/tooltip logic that mutates the DOM directly

## Fix
1. Keep the original HTML as `Flowboard/index.html` (no React).
2. Serve with Vite on port **5176**.
3. Open from PulseDeck via iframe (local) / navigate (GitHub Pages), same pattern as other apps.
4. Add a PulseDeck back link in the masthead.
5. Deploy under `/Resourceallocation/flowboard/` in the Pages suite build.
