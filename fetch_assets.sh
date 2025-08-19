#!/usr/bin/env bash
set -euo pipefail

HTML="/workspace/index.html"
OUT_ROOT="/workspace/assets_local"
SED_SCRIPT="/workspace/rewrite.sed"
MANIFEST="/workspace/assets_manifest.tsv"

rm -rf "$OUT_ROOT"
mkdir -p "$OUT_ROOT"
rm -f "$SED_SCRIPT" "$MANIFEST"
touch "$SED_SCRIPT" "$MANIFEST"

escape_sed() {
  # Escape for sed replacement delimiter |
  printf '%s' "$1" | sed -e 's/[\/|&]/\\&/g'
}

sanitize_local_path() {
  local url="$1"
  local host path path_noq
  host=$(printf '%s' "$url" | sed -E 's#^[a-zA-Z]+://([^/]+).*$#\1#')
  path=$(printf '%s' "$url" | sed -E 's#^[a-zA-Z]+://[^/]+(/.*)?$#\1#')
  if [[ -z "${path}" || "${path}" == "(null)" ]]; then path="/index"; fi
  path_noq=$(printf '%s' "$path" | sed -E 's/[?#].*$//')
  printf '%s/%s' "$host" "${path_noq#/}"
}

download_file() {
  local url="$1"
  local rel_path
  rel_path=$(sanitize_local_path "$url")
  local dst="$OUT_ROOT/$rel_path"
  mkdir -p "$(dirname "$dst")"
  if [[ ! -f "$dst" ]];
  then
    echo "Downloading: $url" >&2
    curl -fsSL --retry 3 --connect-timeout 20 --max-time 180 "$url" -o "$dst" || {
      echo "WARN: Failed to download $url" >&2
      return 1
    }
  else
    echo "Exists: $dst" >&2
  fi
  printf '%s' "$dst"
}

process_google_fonts_css() {
  local css_url="$1"
  local css_file
  css_file=$(download_file "$css_url") || return 0
  # Extract font URLs
  local font_urls
  font_urls=$(grep -Eo 'https?://[^)"\'']+' "$css_file" | sort -u || true)
  local f
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    # Only font files
    if [[ "$f" =~ \.(woff2?|ttf|otf)([?#].*)?$ ]]; then
      local f_dst
      f_dst=$(download_file "$f") || true
      if [[ -n "${f_dst:-}" ]]; then
        local rel_from_html
        rel_from_html=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], os.path.dirname(sys.argv[2])))" "$f_dst" "$HTML")
        # Replace font URL in CSS to local relative path from HTML
        # But CSS will be loaded from HTML, so relative to HTML works.
        esc_from=$(escape_sed "$f")
        esc_to=$(escape_sed "$rel_from_html")
        sed -i "s|$esc_from|$esc_to|g" "$css_file"
      fi
    fi
  done <<< "$font_urls"
  # Add mapping to rewrite HTML link href
  local rel_from_html
  rel_from_html=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], os.path.dirname(sys.argv[2])))" "$css_file" "$HTML")
  local esc_src esc_dst
  esc_src=$(escape_sed "$css_url")
  esc_dst=$(escape_sed "$rel_from_html")
  echo "s|$esc_src|$esc_dst|g" >> "$SED_SCRIPT"
  printf '%s\t%s\n' "$css_url" "$rel_from_html" >> "$MANIFEST"
}

# Gather all external URLs in HTML (simple heuristic)
URLS=$(grep -Eo 'https?://[^"'\''>) ]+' "$HTML" | sort -u)
IFS=$'\n'

for url in $URLS; do
  # Skip templated or dynamic endpoints or prefetch rules
  if [[ "$url" == *'{'* || "$url" == *'}'* ]]; then continue; fi
  if [[ "$url" == *'/wp-admin/'* || "$url" == *.php* ]]; then continue; fi
  # Keep map/waze anchors remote
  if [[ "$url" == https://maps.google.com/* || "$url" == https://waze.com/* || "$url" == https://www.waze.com/* ]]; then continue; fi

  if [[ "$url" == *fonts.googleapis.com* ]]; then
    process_google_fonts_css "$url"
    continue
  fi

  # Download and map
  dst=$(download_file "$url") || continue
  rel_from_html=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], os.path.dirname(sys.argv[2])))" "$dst" "$HTML")

  esc_src=$(escape_sed "$url")
  esc_dst=$(escape_sed "$rel_from_html")
  echo "s|$esc_src|$esc_dst|g" >> "$SED_SCRIPT"
  printf '%s\t%s\n' "$url" "$rel_from_html" >> "$MANIFEST"
done

# Rewrite HTML
if [[ -s "$SED_SCRIPT" ]]; then
  tmp_html="${HTML}.tmp"
  sed -f "$SED_SCRIPT" "$HTML" > "$tmp_html"
  mv "$tmp_html" "$HTML"
fi

echo "Done. Manifest at $MANIFEST"

