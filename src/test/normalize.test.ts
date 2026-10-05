import { describe, expect, it } from "vitest";
import { normalizePersian, normalizeForSearch } from "@/lib/normalize";

describe("normalizePersian", () => {
  it("ی/ي رو به ی فارسی تبدیل میکنه", () => {
    expect(normalizePersian("ي")).toBe("ی");
    expect(normalizePersian("علي")).toBe("علی");
    expect(normalizePersian("یاس")).toBe("یاس");
  });

  it("ک/ك رو به ک فارسی تبدیل میکنه", () => {
    expect(normalizePersian("ك")).toBe("ک");
    expect(normalizePersian("كتاب")).toBe("کتاب");
    expect(normalizePersian("کلاس")).toBe("کلاس");
  });

  it("ارقام فارسی و عربی رو به Latin تبدیل میکنه", () => {
    expect(normalizePersian("۱۲۳")).toBe("123");
    expect(normalizePersian("٤٥٦")).toBe("456");
    expect(normalizePersian("بازی ۱۲")).toBe("بازی 12");
    expect(normalizePersian("۰۹۸۷")).toBe("0987");
  });

  it("ZWNJ (نیمفاصله) رو حذف میکنه", () => {
    expect(normalizePersian("می\u200Cروم")).toBe("میروم");
    expect(normalizePersian("کتاب\u200Cها")).toBe("کتابها");
  });

  it("فاصلههای چندگانه رو یکی میکنه و trim میکنه", () => {
    expect(normalizePersian("  سلام   دنیا  ")).toBe("سلام دنیا");
    expect(normalizePersian("\t\nسلام\n\nدنیا\n")).toBe("سلام دنیا");
  });

  it("ترکیب همهی حالتها رو درست انجام میده", () => {
    const input = "  علي\u200Cرضا ۱۲۳ ك  ";
    const output = normalizePersian(input);
    expect(output).toBe("علیرضا 123 ک");
  });
});

describe("normalizeForSearch", () => {
  it("خروجی normalizePersian رو lowercase هم میکنه", () => {
    expect(normalizeForSearch("EPIC Ludo")).toBe("epic ludo");
    expect(normalizeForSearch("Epic")).toBe("epic");
  });

  it("فارسی رو دستنخورده lowercase میکنه (اثری نداره)", () => {
    expect(normalizeForSearch("علی")).toBe("علی");
  });
});
