/**
 * Supabase Auth の英語エラーを、ユーザー向け日本語に変換する
 */
const ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません",
  "Email not confirmed": "メールアドレスの確認が完了していません。受信トレイをご確認ください",
  "User already registered": "このメールアドレスはすでに登録されています",
  "Password should be at least 6 characters":
    "パスワードは6文字以上で設定してください",
  "Signup requires a valid password": "有効なパスワードを入力してください",
  "Unable to validate email address: invalid format":
    "メールアドレスの形式が正しくありません",
};

/** 不明なエラーはそのまま返す（開発時のデバッグ用） */
export function toAuthErrorMessage(message: string): string {
  return ERROR_MAP[message] ?? message;
}
