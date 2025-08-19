#!/usr/bin/env python3
import os
import re
import sys
import json
import shutil
from urllib.parse import urlparse, urljoin

try:
    import requests
except Exception:
    print("Installing requests...")
    import subprocess, sys as _sys
    subprocess.check_call([_sys.executable, '-m', 'pip', 'install', '--quiet', 'requests'])
    import requests


HTML_PATH = os.path.abspath('index.html')
OUT_ROOT = os.path.abspath('assets_local')
SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
})


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def sanitize_path_from_url(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc.replace(':', '_')
    path = parsed.path
    if not path or path.endswith('/'):
        path = path + 'index'
    local_path = os.path.join(OUT_ROOT, host, path.lstrip('/'))
    return local_path


def download_binary(url: str) -> str:
    local_path = sanitize_path_from_url(url)
    ensure_dir(os.path.dirname(local_path))
    if not os.path.exists(local_path):
        try:
            resp = SESSION.get(url, timeout=40, stream=True)
            resp.raise_for_status()
            with open(local_path, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=1024 * 64):
                    if chunk:
                        f.write(chunk)
            print(f"Downloaded: {url} -> {local_path}")
        except Exception as e:
            print(f"WARN: Failed to download {url}: {e}")
    else:
        print(f"Exists: {local_path}")
    return local_path


def is_external(url: str) -> bool:
    return url.startswith('http://') or url.startswith('https://')


def find_asset_urls(html: str):
    urls = set()
    # link href
    for m in re.finditer(r'<link[^>]+href=["\']([^"\']+)["\']', html, re.IGNORECASE):
        urls.add(m.group(1))
    # script src
    for m in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE):
        urls.add(m.group(1))
    # img src
    for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE):
        urls.add(m.group(1))
    # video source src
    for m in re.finditer(r'<source[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE):
        urls.add(m.group(1))
    # inline url(...) in styles
    for m in re.finditer(r'url\(([^)]+)\)', html, re.IGNORECASE):
        u = m.group(1).strip('"\' ')
        u = u.strip('"\'')
        if u and not u.startswith('data:'):
            urls.add(u)
    return urls


def download_google_fonts_css_and_assets(url: str, html_dir: str):
    # Download CSS
    css_path = download_binary(url)
    # Parse CSS for font URLs
    try:
        with open(css_path, 'r', encoding='utf-8') as f:
            css = f.read()
    except UnicodeDecodeError:
        # re-download as text
        resp = SESSION.get(url, timeout=30)
        resp.raise_for_status()
        css = resp.text
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css)
    font_urls = set()
    for m in re.finditer(r'url\(([^)]+)\)', css):
        fu = m.group(1).strip('"\' ')
        fu = fu.strip('"\'')
        if fu and fu.startswith('http'):
            font_urls.add(fu)
    replaced_css = css
    for fu in font_urls:
        f_local = download_binary(fu)
        rel = os.path.relpath(f_local, os.path.dirname(HTML_PATH))
        replaced_css = replaced_css.replace(fu, rel)
    # Write replaced CSS
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(replaced_css)
    return css_path


def main():
    if not os.path.exists(HTML_PATH):
        print(f"index.html not found at {HTML_PATH}")
        sys.exit(1)
    ensure_dir(OUT_ROOT)
    with open(HTML_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    urls = find_asset_urls(html)

    # Collect final replacements
    replacements = {}

    for url in sorted(urls):
        if not is_external(url):
            continue
        # Special-case Google Fonts CSS to also fetch fonts
        if 'fonts.googleapis.com' in url:
            css_local = download_google_fonts_css_and_assets(url, os.path.dirname(HTML_PATH))
            rel = os.path.relpath(css_local, os.path.dirname(HTML_PATH))
            replacements[url] = rel
            continue

        # Leaflet tiles should remain remote (templated URL)
        if '{s}.tile.openstreetmap.org' in url:
            continue

        local_path = download_binary(url)
        rel_path = os.path.relpath(local_path, os.path.dirname(HTML_PATH))
        replacements[url] = rel_path

    # Apply replacements to HTML content
    new_html = html
    for src, dst in sorted(replacements.items(), key=lambda x: -len(x[0])):
        new_html = new_html.replace(src, dst)

    out_html = HTML_PATH
    with open(out_html, 'w', encoding='utf-8') as f:
        f.write(new_html)

    # Save a manifest for reference
    manifest_path = os.path.abspath('assets_manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(replacements, f, ensure_ascii=False, indent=2)
    print(f"Wrote: {out_html}")
    print(f"Manifest: {manifest_path}")


if __name__ == '__main__':
    main()

