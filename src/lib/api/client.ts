import "server-only";
import axios from "axios";

/**
 * axios instance مخصوص تماس server-side با Lifelands.
 * عمداً 'server-only' گذاشتیم تا هر import از سمت کلاینت خطا بده.
 */
export const apiClient = axios.create({
  baseURL: process.env.LIFELANDS_API_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
});
