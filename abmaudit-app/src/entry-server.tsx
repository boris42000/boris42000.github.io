import { renderToString } from 'react-dom/server'
import App from './App'

/** Used only at build time by scripts/prerender.mjs. Never shipped to the browser. */
export function render() {
  return renderToString(<App />)
}
