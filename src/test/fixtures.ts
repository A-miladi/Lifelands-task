import type { Game } from "@/lib/types/game";

/**
 * یه Game کامل با مقادیر پیش‌فرض.
 * در تست‌ها فقط فیلدهای موردنظر رو override می‌کنیم.
 */
export function makeGame(overrides: Partial<Game> = {}): Game {
  const base: Game = {
    _id: "default-id",
    title: "Default Game",
    description: "",
    companyName: "Default Co",
    category: {
      _id: "cat-1",
      title: "معمایی",
      categoryId: { _id: "cat-1", title: "معمایی" },
    },
    image: "game/default.png",
    images: [],
    headerImage: "placeholder/header-placeholder.png",
    portraitHeaderImage: undefined,
    video: undefined,
    tags: [],
    score: 0,
    rating: 0,
    defaultScore: 0,
    like: 0,
    level: 1,
    runCount: 0,
    seenCount: 0,
    downloadCount: 0,
    commentCount: 0,
    userScoreCount: 0,
    competitionCount: 0,
    vitrinThirdPartyVendors: [],
    isActive: true,
    isLandscape: true,
    gameType: "main",
    platform: "web",
    department: "game",
    creator: {
      fullName: "Test Creator",
      userId: {
        _id: "user-1",
        userName: "tester",
        profileImage: "profile/test.jpeg",
      },
    },
    gameInfos: {
      namayeshBazi: true,
      namayeshLeaderBoard: true,
      gameType: "both-game-type",
      gameCategory: "both-age-category",
    },
    createdAt: "1 روز پیش",
    updatedAt: "1 روز پیش",
    createdAtIso: "2026-01-01T00:00:00.000Z",
    updatedAtIso: "2026-01-01T00:00:00.000Z",
  };
  return { ...base, ...overrides };
}
