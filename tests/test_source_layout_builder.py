import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('source_layout', Path(__file__).resolve().parents[1] / 'scripts/build-legal-source-layout.py')
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)

class SourceLayoutSafetyTests(unittest.TestCase):
    def test_shared_words_do_not_move_a_statutory_sentence_into_a_margin(self):
        text = '1. The Court shall hear the application.\nThe Court\nThe Court shall decide the matter according to the evidence.'
        result = layout.locate(text, dict(width=595, height=841, scanned=True, items=[
            dict(text='1. The Court shall', x=185, y=70, x1=525, height=12, size=12, partial=True, bodyLeft=185, bodyRight=525),
            dict(text='The Court', x=120, y=70, x1=160, height=8, size=8),
        ]))
        self.assertEqual(result['textHash'], layout.fingerprint(text))
        self.assertEqual([line['side'] for line in result['lines']], ['body', 'left', 'body'])
        self.assertEqual([line['index'] for line in result['lines']], [0, 1, 2])

    def test_source_hash_is_the_same_utf8_contract_as_the_web_reader(self):
        self.assertEqual(layout.fingerprint('hello'), '4f9f2cab')

if __name__ == '__main__':
    unittest.main()
