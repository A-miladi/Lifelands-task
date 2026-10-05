import type { Metadata } from "next";
import { HamsterChallenge } from "@/components/challenge/HamsterChallenge";

export const metadata: Metadata = {
  title: "چالش همستر — Tab Tab To End",
  description: "تشخیص کاربر ربات با تحلیل الگوی کلیک",
};

export default function ChallengePage() {
  return (
    <main>
      <HamsterChallenge />
    </main>
  );
}
