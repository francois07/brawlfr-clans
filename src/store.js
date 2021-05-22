// store.js
import { writable } from "svelte/store";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export const formData = writable({
  guild_id: urlParams.get("id") || "154750280552939520",
  leader_id: "",
  name: "",
  alias: "",
  discord: { url: "", private: false },
  level: 0,
});
