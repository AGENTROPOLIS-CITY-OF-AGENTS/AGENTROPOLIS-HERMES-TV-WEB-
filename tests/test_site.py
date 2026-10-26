import importlib.util
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('site_build', Path(__file__).resolve().parents[1] / 'scripts/site_build.py')
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)

class Boundary(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.old = site.ROOT
        self.addCleanup(setattr, site, 'ROOT', self.old)
        site.ROOT = self.root
        for name in site.PUBLIC:
            (self.root / name).write_bytes((self.old / name).read_bytes())
        (self.root / 'docs').mkdir()
        (self.root / 'docs/HERMES_HANDOFF.md').write_text('internal sentinel')
    def test_build_excludes_internal_and_cleans_stale_output(self):
        (self.root / 'dist').mkdir()
        (self.root / 'dist/README.md').write_text('stale')
        self.assertEqual(set(site.build()), set(site.PUBLIC))
    def test_extra_file_rejected(self):
        site.build()
        (self.root / 'dist/README.md').write_text('leak')
        with self.assertRaises(AssertionError): site.validate(self.root / 'dist')
    def test_symlink_rejected(self):
        (self.root / 'index.html').unlink()
        (self.root / 'index.html').symlink_to(self.old / 'index.html')
        with self.assertRaises(AssertionError): site.build()
    def test_missing_asset_rejected(self):
        p = self.root / 'index.html'
        p.write_text(p.read_text().replace('styles.css', 'missing.css'))
        with self.assertRaises(AssertionError): site.build()
    def test_missing_anchor_rejected(self):
        p = self.root / 'index.html'
        p.write_text(p.read_text().replace('#roadmap', '#missing'))
        with self.assertRaises(AssertionError): site.build()
    def test_active_content_rejected(self):
        p = self.root / 'index.html'
        p.write_text(p.read_text() + '<script src="evil.js"></script>')
        with self.assertRaises(AssertionError): site.build()
    def test_cta_regression_rejected(self):
        p = self.root / 'styles.css'
        p.write_text(p.read_text().replace('background:var(--red);color:var(--bg)', 'background:var(--red);color:white'))
        with self.assertRaises(AssertionError): site.build()

    def test_dist_root_symlink_rejected(self):
        site.build()
        (self.root / 'dist').rename(self.root / 'other')
        (self.root / 'dist').symlink_to(self.root / 'other', target_is_directory=True)
        with self.assertRaises(AssertionError): site.validate(self.root / 'dist')

    def test_artifact_source_drift_rejected(self):
        site.build()
        (self.root / 'dist/index.html').write_text('changed')
        with self.assertRaises(AssertionError): site.validate(self.root / 'dist')

if __name__ == '__main__': unittest.main()
