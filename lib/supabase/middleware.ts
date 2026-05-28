import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/lib/constants/routes";

import type { Database } from "@/lib/supabase/database.types";

/** 未ログインでもアクセス可能な認証系パス */
const AUTH_ROUTES = [ROUTES.login, ROUTES.signup, ROUTES.authCallback];

/** ログイン必須のアプリ本体パス（前方一致） */
const PROTECTED_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.reservations,
  ROUTES.events,
  ROUTES.results,
  ROUTES.expenses,
  ROUTES.oshis,
  ROUTES.settings,
];

/**
 * 各リクエストでセッションを更新し、保護ルートへのアクセスを制御する
 *
 * 1. Supabase がクッキー内のトークンをリフレッシュ（セッション維持）
 * 2. 未ログイン + 保護ルート → /login?next= へリダイレクト
 * 3. ログイン済み + ログイン/登録ページ → ダッシュボードへ
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 重要: getSession ではなく getUser（トークン検証付き）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute && pathname !== ROUTES.authCallback) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
