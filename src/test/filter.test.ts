import { describe, expect, it } from "vitest";
import { filterGames, EMPTY_FILTERS, extractCategories } from "@/lib/filter";
import { makeGame } from "./fixtures";

describe("filterGames", () => {
  it("جستجو روی title نرمالسازیشده انجام میشه (ی عربی vs فارسی)", () => {
    const games = [
      makeGame({ _id: "1", title: "علي" }),
      makeGame({ _id: "2", title: "سارا" }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      search: "ی",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?._id).toBe("1");
  });

  it("جستجو روی companyName هم انجام میشه", () => {
    const games = [
      makeGame({ _id: "1", title: "A", companyName: "Vahid Ebrahimi" }),
      makeGame({ _id: "2", title: "B", companyName: "Sara Co" }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      search: "vahid",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?._id).toBe("1");
  });

  it("فیلتر vendor فقط بازیهای شامل vendor انتخابی رو برمیگردونه", () => {
    const games = [
      makeGame({ _id: "1", vitrinThirdPartyVendors: ["soroush"] }),
      makeGame({ _id: "2", vitrinThirdPartyVendors: ["rubika"] }),
      makeGame({ _id: "3", vitrinThirdPartyVendors: [] }),
      makeGame({ _id: "4", vitrinThirdPartyVendors: ["soroush", "rubika"] }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      vendors: ["soroush"],
    });

    expect(result.map((g) => g._id)).toEqual(["1", "4"]);
  });

  it("چند vendor همزمان = OR منطقی", () => {
    const games = [
      makeGame({ _id: "1", vitrinThirdPartyVendors: ["soroush"] }),
      makeGame({ _id: "2", vitrinThirdPartyVendors: ["rubika"] }),
      makeGame({ _id: "3", vitrinThirdPartyVendors: [] }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      vendors: ["soroush", "rubika"],
    });

    expect(result.map((g) => g._id)).toEqual(["1", "2"]);
  });

  it("فیلتر دستهبندی روی category.title نرمالسازیشده", () => {
    const games = [
      makeGame({
        _id: "1",
        category: {
          _id: "c1",
          title: "امتیازی ",
          categoryId: { _id: "c1", title: "امتیازی " },
        },
      }),
      makeGame({
        _id: "2",
        category: {
          _id: "c2",
          title: "معمایی",
          categoryId: { _id: "c2", title: "معمایی" },
        },
      }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      categories: ["امتیازی"],
    });

    expect(result.map((g) => g._id)).toEqual(["1"]);
  });

  it("favoritesOnly فقط آیتمهای موردعلاقه رو برمیگردونه", () => {
    const games = [
      makeGame({ _id: "1" }),
      makeGame({ _id: "2" }),
      makeGame({ _id: "3" }),
    ];

    const result = filterGames(
      games,
      { ...EMPTY_FILTERS, favoritesOnly: true },
      new Set(["1", "3"]),
    );

    expect(result.map((g) => g._id)).toEqual(["1", "3"]);
  });

  it("بازهی امتیاز روی score خام اعمال میشه", () => {
    const games = [
      makeGame({ _id: "1", score: 2 }),
      makeGame({ _id: "2", score: 4.5 }),
      makeGame({ _id: "3", score: 5 }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      minScore: 3,
      maxScore: 4.6,
    });

    expect(result.map((g) => g._id)).toEqual(["2"]);
  });

  it("ترکیب چند فیلتر با AND کار میکنه", () => {
    const games = [
      makeGame({
        _id: "1",
        title: "علی رضایی",
        vitrinThirdPartyVendors: ["soroush"],
        score: 4,
      }),
      makeGame({
        _id: "2",
        title: "علی احمدی",
        vitrinThirdPartyVendors: ["rubika"],
        score: 4,
      }),
      makeGame({
        _id: "3",
        title: "سارا",
        vitrinThirdPartyVendors: ["soroush"],
        score: 4,
      }),
    ];

    const result = filterGames(games, {
      ...EMPTY_FILTERS,
      search: "علی",
      vendors: ["soroush"],
      minScore: 3,
    });

    expect(result.map((g) => g._id)).toEqual(["1"]);
  });
});

describe("extractCategories", () => {
  it("دستهبندیهای یکتا رو استخراج و الفبا sort میکنه", () => {
    const games = [
      makeGame({
        category: {
          _id: "a",
          title: "معمایی",
          categoryId: { _id: "a", title: "معمایی" },
        },
      }),
      makeGame({
        category: {
          _id: "b",
          title: "امتیازی ",
          categoryId: { _id: "b", title: "امتیازی " },
        },
      }),
      makeGame({
        category: {
          _id: "c",
          title: "معمایی",
          categoryId: { _id: "c", title: "معمایی" },
        },
      }),
    ];

    const result = extractCategories(games);

    expect(result).toHaveLength(2);
    expect(result).toContain("معمایی");
    expect(result).toContain("امتیازی");
  });
});
