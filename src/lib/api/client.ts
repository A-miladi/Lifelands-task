import "server-only";
import axios from "axios";

const DEFAULT_BASE_URL = "https://lifelands.ir/api/v1";

const baseURL = process.env.LIFELANDS_API_BASE_URL ?? DEFAULT_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
});
