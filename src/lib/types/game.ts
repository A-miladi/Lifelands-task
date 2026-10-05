/**
 * Game type — استخراج‌شده از پاسخ واقعی:
 * GET https://lifelands.ir/api/v1/games
 */

export type GameCategory = {
  _id: string;
  title: string;
  categoryId: {
    _id: string;
    title: string;
  };
};

export type GameCreator = {
  fullName: string;
  userId: {
    _id: string;
    userName: string;
    profileImage: string;
    firstName?: string;
    lastName?: string;
  };
};

export type GameInfos = {
  namayeshBazi: boolean;
  namayeshLeaderBoard: boolean;
  gameType: string;
  gameCategory: string;
};

export type Game = {
  _id: string;

  // نمایش اصلی
  title: string;
  description: string;
  companyName: string;
  category: GameCategory;

  // تصاویر — مسیرها نسبی‌اند (Task 8.1)
  image: string;
  images: string[];
  headerImage: string;
  portraitHeaderImage?: string;

  // ویدیو پیش‌نمایش (اختیاری — همه بازی‌ها ندارن)
  video?: string;

  // برچسب‌ها
  tags: string[];

  // معیارهای عددی
  score: number;
  rating: number;
  defaultScore: number;
  like: number;
  level: number;
  runCount: number;
  seenCount: number;
  downloadCount: number;
  commentCount: number;
  userScoreCount: number;
  competitionCount: number;

  // فیلترها
  vitrinThirdPartyVendors: string[];

  // متادیتا
  isActive: boolean;
  isLandscape: boolean;
  gameType: string;
  platform: string;
  department: string;

  // سازنده
  creator: GameCreator;

  // تنظیمات داخلی بازی
  gameInfos: GameInfos;

  // زمان‌ها — هم متن فارسی نسبی، هم ISO
  createdAt: string;
  updatedAt: string;
  createdAtIso: string;
  updatedAtIso: string;
};
