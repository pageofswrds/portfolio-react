import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cache the data in memory to avoid reading the file repeatedly
let cachedData: unknown = null;
let lastModified: Date | null = null;

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "accessions.json"
    );
    const stats = fs.statSync(filePath);

    // Check if we need to reload the data
    if (!cachedData || !lastModified || stats.mtime > lastModified) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      cachedData = JSON.parse(fileContents);
      lastModified = stats.mtime;
    }

    // Return the cached data with cache headers
    return NextResponse.json(cachedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        ETag: `"${stats.mtime.getTime()}"`,
      },
    });
  } catch (error) {
    console.error("Error reading accessions data:", error);
    return NextResponse.json(
      { message: "Failed to load accessions data" },
      { status: 500 }
    );
  }
}
