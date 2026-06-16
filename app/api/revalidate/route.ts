import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type RevalidateBody = {
  secret?: string;
  tag?: string;
  paths?: string[];
};

function getSecret(request: Request, body: RevalidateBody): string | null {
  const headerSecret = request.headers.get("x-revalidate-secret");
  if (headerSecret) return headerSecret;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return body.secret?.trim() || null;
}

export async function POST(request: Request) {
  let body: RevalidateBody = {};

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const expectedSecret =
    process.env.SANITY_REVALIDATE_SECRET ||
    process.env.GENERATOR_ADMIN_SECRET ||
    process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: "Revalidation secret is not configured" }, { status: 500 });
  }

  const providedSecret = getSecret(request, body);
  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tag = body.tag?.trim() || "sanity";
  revalidateTag(tag, "max");

  const paths = (body.paths ?? []).map((path) => path.trim()).filter(Boolean);
  for (const path of paths) {
    revalidatePath(path.startsWith("/") ? path : `/${path}`);
  }

  return NextResponse.json({ revalidated: true, tag, paths, now: Date.now() });
}
