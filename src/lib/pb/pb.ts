import PocketBase from "pocketbase";

const PUBLIC_PB_URL = import.meta.env.PUBLIC_PB_URL;

export const pb = new PocketBase(PUBLIC_PB_URL);
