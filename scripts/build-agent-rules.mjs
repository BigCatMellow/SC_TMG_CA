// Build local, page-citable faction navigation from an extracted PDF reference pack.
// Does not copy rulebook prose into tracked repository files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const pack = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || 'agent-rules/generated');
const config = JSON.parse(fs.readFileSync(new URL('../agent-rules/factions.json', import.meta.url), 'utf8'));
const pdf = path.join(pack, config.source.filename);
if (!fs.existsSync(pdf)) throw new Error('Missing source PDF: ' + pdf);
const hash = crypto.createHash('sha256').update(fs.readFileSync(pdf)).digest('hex');
if (hash !== config.source.sha256) throw new Error('PDF hash mismatch: verify rulebook edition');
const source = path.join(pack, 'rules_sections.jsonl');
const entries = fs.readFileSync(source, 'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
const ids = new Map(entries.map(e => [e.section_id, e]));
if (ids.size !== entries.length) throw new Error('Duplicate section IDs in the extracted reference');
const shared = config.shared_section_ids.map(id => {
  const e = ids.get(id);
  if (!e) throw new Error('Missing source section: ' + id);
  return {
    section_id: id, title: e.title, printed_page: e.start_book_page,
    pdf_page: e.start_pdf_page, source_locator: e.source_locator,
    relation: 'shared_rule'
  };
});
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'shared-index.json'), JSON.stringify(shared, null, 2) + '\n');
for (const [faction, cfg] of Object.entries(config.factions)) {
  if (!fs.existsSync(new URL('../' + cfg.repo_dataset, import.meta.url))) {
    throw new Error('Missing companion faction dataset: ' + cfg.repo_dataset);
  }
  const lens = {
    faction, source: config.source, shared_index: 'shared-index.json',
    repo_dataset: cfg.repo_dataset, repo_army_page: cfg.repo_army_page,
    focus_keywords: cfg.focus_keywords,
    visual_unit_table_pages: cfg.unit_table_pages,
    example_army_pages: cfg.example_army_pages,
    notes: [
      'Core rules apply to all factions; this is a navigation index, not a separate rules rewrite.',
      'Numeric values in visual tables require verification in the PDF.',
      'Example armies are illustrative, not normative.',
      'Current companion data is not necessarily reconciled against this PDF edition.'
    ]
  };
  fs.writeFileSync(path.join(output, faction + '.json'), JSON.stringify(lens, null, 2) + '\n');
}
console.log('Generated ' + shared.length + ' shared references and ' + Object.keys(config.factions).length + ' faction lenses in ' + output);
