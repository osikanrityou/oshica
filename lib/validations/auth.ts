import { z } from "zod";

/** ログインフォームの入力チェック */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
});

/** 新規登録フォームの入力チェック */
export const signupSchema = loginSchema.extend({
  displayName: z
    .string()
    .max(50, "表示名は50文字以内で入力してください")
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
