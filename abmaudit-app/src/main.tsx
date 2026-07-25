import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// The `js` class that gates scroll reveals is set by an inline script in
// index.html — it has to land before first paint, ahead of this bundle.

const root = document.getElementById('root')!
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships pre-rendered markup (scripts/prerender.mjs);
// `npm run dev` serves an empty root.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}
