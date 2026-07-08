"use client";

import { useEffect } from "react";

/**
 * フォームの二重送信を防ぐ共通ガード
 *
 * 保存ボタンを連打したときに、
 * 同じ内容が複数登録されるのを防ぎます。
 */
export function FormSubmitGuard() {
  useEffect(() => {
    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.dataset.submitting === "true") {
        event.preventDefault();
        return;
      }

      form.dataset.submitting = "true";

      const submitButtons = form.querySelectorAll<HTMLButtonElement>(
        'button[type="submit"]',
      );

      submitButtons.forEach((button) => {
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        button.classList.add("opacity-50");
      });
    };

    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}