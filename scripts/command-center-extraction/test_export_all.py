"""Offline validation for the Command Center Python exporter."""
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from export_all import (
    ExportError, audit_factions, audit_rules, filename_slug,
    image_extension, unique_path,
)


class ParsingTests(unittest.TestCase):
    def test_rules_expected_parts(self):
        value = "\n\n".join(f"PART {i}: SECTION {i}\nSome text" for i in range(1, 13))
        self.assertEqual(audit_rules(value)['missing_numbered_parts'], [])
        self.assertEqual(audit_rules(
            value.replace('PART 5:', 'CHAPTER 5:')
        )['missing_numbered_parts'], [5])

    def test_faction_counts_and_missing_ids(self):
        data = '\n'.join([
            'FACTION: ZERG', 'CARD: Unit A', 'ID: unit_a',
            'FACTION: TERRAN', 'CARD: Unit B', 'ID: unit_b',
            'FACTION: PROTOSS', 'CARD: Unit C', 'ID: unit_c',
        ])
        result = audit_factions(data)
        self.assertEqual(result['card_total'], 3)
        self.assertEqual(result['cards_per_faction']['TERRAN'], 1)
        self.assertTrue(result['warnings'])

    def test_duplicate_ids_are_reported(self):
        data = 'FACTION: ZERG\nCARD: One\nID: a\nCARD: Two\nID: a\n'
        result = audit_factions(data)
        self.assertTrue(any(
            'duplicate card IDs' in x for x in result['warnings']
        ))

    def test_image_detection(self):
        self.assertEqual(image_extension(b'\xff\xd8\xffabc'), '.jpg')
        self.assertEqual(image_extension(b'\x89PNG\r\n\x1a\nabc'), '.png')
        self.assertEqual(image_extension(b'RIFF1234WEBPabc'), '.webp')
        with self.assertRaises(ExportError):
            image_extension(b'<html>Error</html>')

    def test_safe_unique_paths(self):
        self.assertEqual(filename_slug('Roach / Vile (Zerg)'), 'Roach_Vile_Zerg')
        with TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / 'Map.jpg').write_bytes(b'xxx')
            self.assertEqual(unique_path(base, 'Map.jpg').name, 'Map_2.jpg')


if __name__ == '__main__':
    unittest.main()
