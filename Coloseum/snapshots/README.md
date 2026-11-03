# Coloseum live-site snapshots

Exact byte-for-byte copies of what https://pizzeriacoloseum.sk/ served, one folder per capture date.
Do not edit them: they are the reference for checking the site or restoring it.

`MANIFEST.json` lists each file's URL, SHA-256, size and the server's `Last-Modified`.

Not captured: server-side code (`bat/*.php` can't be downloaded over HTTP, and requesting it could
trigger it) and the nginx configuration.

## Check the live site against a snapshot

    ./check-live.sh 2026-11-03

Exit code 0: every file matches. 1: something changed. 2: no changes found, but some downloads failed
(the server drops connections now and then, so re-run). Requires `curl` and `jq`. It only detects changes to files
in the manifest, so a file newly added to the site is not reported.

## 2026-11-03

Captured 2026-11-03 12:22 UTC: 80 files, served at 92 URLs (some differ only by a `?v=` query). Pages and `menu-data.js` are dated 2026-02-20 on the server.
