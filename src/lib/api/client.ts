import "server-only";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://lifelands.ir/api/v1",
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
});
