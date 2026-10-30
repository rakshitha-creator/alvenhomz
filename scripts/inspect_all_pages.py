import os
import re

for fname in sorted(os.listdir('target_site_pages')):
    if not fname.endswith('.html'):
        continue
    filepath = os.path.join('target_site_pages', fname)
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Extract main content
    main = re.search(r'<main[^>]*>(.*?)</main>', html, re.S)
    if not main:
        print(f"File {fname}: No main tag")
        continue
    main_html = main.group(1)
    
    # Extract all sections
    sections = re.findall(r'<section([^>]*)>(.*?)</section>', main_html, re.S)
    print(f"\n==================== {fname} (Sections: {len(sections)}) ====================")
    for i, (attrs, sec_body) in enumerate(sections):
        first_h = re.search(r'<(h[1-6])[^>]*>(.*?)</\1>', sec_body, re.S)
        htext = ' '.join(re.sub(r'<[^>]+>', ' ', first_h.group(2)).split()) if first_h else "No heading"
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', sec_body)
        print(f"  Sec {i}: tag={attrs.strip()[:60]} | H: {htext} | Imgs: {len(imgs)}")

