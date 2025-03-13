"use server";

import { cookies } from "next/headers";

export const getCookieValue = async (cookieName: string) => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(cookieName)?.value;
  return cookieValue;
};
