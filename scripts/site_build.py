"""Build and validate the deliberately small public Pages artifact (stdlib only)."""
import hashlib
import json
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ('index.html', 'styles.css')

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.tags = [], set(), []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append((tag, a))
        if 'id' in a:
            assert a['id'] not in self.ids, 'duplicate ID'
            self.ids.add(a['id'])
        for key in ('href', 'src'):
            if key in a:
                self.refs.append(a[key])
        assert not any(k.startswith('on') for k in a), 'inline event handler'
        assert tag not in ('script', 'iframe', 'object', 'embed', 'base'), 'active content requires security review'
        if tag == 'img':
            assert 'alt' in a, 'image requires alt'

def validate(dist):
    paths = list(dist.rglob('*'))
    assert all(not p.is_symlink() for p in paths), 'symlink in artifact'
    assert {p.relative_to(dist).as_posix() for p in paths} == set(PUBLIC), 'artifact differs from exact allowlist'
    for name in PUBLIC:
        assert (dist / name).is_file(), 'non-file public entry'
        assert (dist / name).read_bytes() == (ROOT / name).read_bytes(), 'artifact/source drift'
    html = (dist / 'index.html').read_text()
    page = Page()
    page.feed(html)
    assert any(t == 'html' and a.get('lang') == 'en' for t, a in page.tags), 'missing language'
    assert '<title>' in html and any(t == 'main' for t, a in page.tags), 'missing title/main'
    assert sum(t == 'h1' for t, a in page.tags) == 1, 'one h1 required'
    assert any(t == 'meta' and a.get('name') == 'viewport' for t, a in page.tags), 'missing viewport'
    for ref in page.refs:
        u = urlsplit(ref)
        if u.scheme or u.netloc:
            assert u.scheme == 'https' and u.hostname == 'github.com', 'unreviewed external origin'
            continue
        assert not u.query and not u.path.startswith('/'), 'project Pages requires relative URLs'
        target = (dist / (u.path or 'index.html')).resolve()
        assert target.is_relative_to(dist.resolve()), 'path traversal'
        if target.is_dir():
            target /= 'index.html'
        assert target.is_file(), f'missing local asset: {ref}'
        if u.fragment:
            assert u.fragment in page.ids, f'missing anchor: {ref}'
    css = (dist / 'styles.css').read_text()
    assert not re.search(r'url\s*\(|@import', css, re.I), 'CSS dependencies require explicit allowlist review'
    assert '.cta{' in css and 'background:var(--red);color:var(--bg)' in css, 'CTA contrast regression'
    assert ':focus-visible' in css and 'prefers-reduced-motion' in css, 'keyboard/motion baseline missing'
    return {name: hashlib.sha256((dist / name).read_bytes()).hexdigest() for name in PUBLIC}

def build():
    dist = ROOT / 'dist'
    if dist.is_symlink():
        raise AssertionError('dist must not be a symlink')
    if dist.exists():
        shutil.rmtree(dist)
    dist.mkdir()
    for name in PUBLIC:
        assert not (ROOT / name).is_symlink(), 'source symlink'
        shutil.copyfile(ROOT / name, dist / name)
    return validate(dist)

if __name__ == '__main__':
    print(json.dumps(build(), indent=2, sort_keys=True))
