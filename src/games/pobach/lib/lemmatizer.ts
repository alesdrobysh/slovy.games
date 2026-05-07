import { join } from "node:path";
import { MorphAnalyzer } from "belmorph";
import { loadDict } from "belmorph/node";

const DICT_DIR = join(process.cwd(), "node_modules", "belmorph", "dict");

let analyzer: MorphAnalyzer | null = null;

function getAnalyzer(): MorphAnalyzer {
  if (!analyzer) {
    analyzer = new MorphAnalyzer(loadDict(DICT_DIR));
  }
  return analyzer;
}

export function lemmatize(word: string): string {
  const results = getAnalyzer().parse(word);
  return results[0]?.lemma ?? word;
}
