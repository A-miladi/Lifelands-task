import { NextResponse } from "next/server";
import { getGames } from "@/lib/api/games";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageRaw = searchParams.get("page");
  const search = searchParams.get("search") ?? "";

  const page = Number.parseInt(pageRaw ?? "1", 10);
  if (Number.isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  try {
    const data = await getGames({ page, search });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
