#!/usr/bin/env bash
# Compares the live site with a snapshot's MANIFEST.json. Usage: ./check-live.sh <snapshot-date>
# Exit codes: 0 all match, 1 something changed, 2 nothing changed but some downloads failed.
set -u
manifest="$(dirname "$0")/${1:?usage: check-live.sh <snapshot-date>}/MANIFEST.json"
tmp=$(mktemp); trap 'rm -f "$tmp"' EXIT
changed=0; failed=0; total=0
while IFS=$'\t' read -r url file want; do
  total=$((total + 1))
  if ! curl -fsS --connect-timeout 20 -m 120 --retry 4 --retry-all-errors --retry-delay 3 -o "$tmp" "$url" </dev/null; then
    echo "FAILED   $file"; failed=$((failed + 1)); continue
  fi
  got=$(shasum -a 256 "$tmp" | cut -d' ' -f1)
  if [ "$got" != "$want" ]; then echo "CHANGED  $file"; changed=$((changed + 1)); fi
  sleep 0.1
done < <(jq -r '.files[] | [.url, .file, .sha256] | @tsv' "$manifest")
echo "$total checked, $changed changed, $failed failed to download"
[ "$changed" = 0 ] || exit 1
[ "$failed" = 0 ] || exit 2
