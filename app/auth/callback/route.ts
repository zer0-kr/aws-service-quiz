import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/play";

  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    next = "/play";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // First time user - redirect to setup
          const forwardedHost = request.headers.get("x-forwarded-host");
          const isLocal = process.env.NODE_ENV === "development";

          if (isLocal) {
            return NextResponse.redirect(`${origin}/setup`);
          }
          if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}/setup`);
          }
          return NextResponse.redirect(`${origin}/setup`);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";

      if (isLocal) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
