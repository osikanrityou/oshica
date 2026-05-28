import { ROUTES } from "@/lib/constants/routes";

/**
 * ログイン後のリダイレクト先を安全に決める
 * 外部URLや //evil.com へのオープンリダイレクトを防ぐ
 */
export function getSafeRedirectPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return ROUTES.dashboard;
  }
  if (next === ROUTES.login || next === ROUTES.signup) {
    return ROUTES.dashboard;
  }
  return next;
}
