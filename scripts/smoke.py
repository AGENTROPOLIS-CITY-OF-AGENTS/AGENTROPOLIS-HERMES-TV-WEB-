"""Serve only dist and check public assets and excluded repository paths."""
import functools
import http.server
import threading
import urllib.error
import urllib.request
from site_build import ROOT, build

build()
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT / 'dist'))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    for path, expected in [('/', 200), ('/styles.css', 200), ('/docs/HERMES_HANDOFF.md', 404), ('/README.md', 404), ('/LICENSE', 404), ('/.github/workflows/pages.yml', 404), ('/.git/config', 404)]:
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{server.server_port}{path}') as response:
                status = response.status
        except urllib.error.HTTPError as error:
            status = error.code
        if status != expected:
            raise AssertionError((path, status, expected))
        print(path, status)
finally:
    server.shutdown()
