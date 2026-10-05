const CHAR_MAP: Record<string, string> = {
  "\u064A": "\u06CC",
  "\u0649": "\u06CC",
  "\u0643": "\u06A9",
  "\u06AA": "\u06A9",
};

const DIGIT_MAP: Record<string, string> = {
  "\u06F0": "0",
  "\u06F1": "1",
  "\u06F2": "2",
  "\u06F3": "3",
  "\u06F4": "4",
  "\u06F5": "5",
  "\u06F6": "6",
  "\u06F7": "7",
  "\u06F8": "8",
  "\u06F9": "9",
  "\u0660": "0",
  "\u0661": "1",
  "\u0662": "2",
  "\u0663": "3",
  "\u0664": "4",
  "\u0665": "5",
  "\u0666": "6",
  "\u0667": "7",
  "\u0668": "8",
  "\u0669": "9",
};

const ZWNJ = "\u200C";
const ZWJ = "\u200D";
const ZWSP = "\u200B";
const TATWEEL = "\u0640";

export function normalizePersian(input: string): string {
  let out = "";

  for (const ch of input) {
    if (ch === ZWNJ || ch === ZWJ || ch === ZWSP || ch === TATWEEL) {
      continue;
    }

    const mapped = CHAR_MAP[ch];
    if (mapped !== undefined) {
      out += mapped;
      continue;
    }

    const digit = DIGIT_MAP[ch];
    if (digit !== undefined) {
      out += digit;
      continue;
    }

    out += ch;
  }

  return out.replace(/\s+/g, " ").trim();
}

export function normalizeForSearch(input: string): string {
  return normalizePersian(input).toLowerCase();
}
