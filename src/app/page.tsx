import { Suspense } from "react";
import { getGames } from "@/lib/api/games";
import { GameExplorer } from "@/components/games/GameExplorer";
import { GameCardSkeleton } from "@/components/games/GameCardSkeleton";

export const dynamic = "force-dynamic";

async function ExplorerLoader() {
  const initialData = await getGames({ page: 1 });
  return <GameExplorer initialData={initialData} />;
}

function ExplorerFallback() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 h-14" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-[420px] rounded-xl bg-gray-100 lg:block" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<ExplorerFallback />}>
        <ExplorerLoader />
      </Suspense>
    </main>
  );
}
