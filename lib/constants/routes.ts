export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  authCallback: "/callback",
  dashboard: "/dashboard",
  reservations: "/reservations",
  reservationNew: "/reservations/new",
  events: "/events",
  eventNew: "/events/new",
  results: "/results",
  expenses: "/expenses",
  expenseNew: "/expenses/new",
  oshis: "/oshis",
  settings: "/settings",
  settingsAccount: "/settings/account",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const APP_NAV_ITEMS = [
  { href: ROUTES.dashboard, label: "ホーム", icon: "home" as const },
  { href: ROUTES.reservations, label: "予約", icon: "calendar" as const },
  { href: ROUTES.events, label: "応募", icon: "ticket" as const },
  { href: ROUTES.expenses, label: "支出", icon: "wallet" as const },
  { href: ROUTES.settings, label: "設定", icon: "settings" as const },
] as const;
