import os
import re

pages_to_check = [
    ('about-us.html', 'src/app/about-us/page.tsx'),
    ('contact-us.html', 'src/app/contact-us/page.tsx'),
    ('interiors.html', 'src/app/interiors/page.tsx'),
    ('new-projects.html', 'src/app/new-projects/page.tsx'),
    ('resale-properties.html', 'src/app/resale-properties/page.tsx'),
    ('rental-properties.html', 'src/app/rental-properties/page.tsx'),
]

for target_file, local_file in pages_to_check:
    print(f"\n==================== {target_file} vs {local_file} ====================")
    with open(os.path.join('target_site_pages', target_file), 'r', encoding='utf-8') as f:
        target_html = f.read()
    
    with open(local_file, 'r', encoding='utf-8') as f:
        local_code = f.read()
    
    # Target headings
    target_headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', target_html, re.S)
    print(f"Target headings ({len(target_headings)}):")
    for tag, t in target_headings:
        clean = ' '.join(re.sub(r'<[^>]+>', ' ', t).split())
        print(f"  {tag}: {clean}")
        
    # Target images
    target_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', target_html)
    print(f"Target images ({len(target_imgs)}):")
    for im in set(target_imgs):
        print(f"  {im}")

