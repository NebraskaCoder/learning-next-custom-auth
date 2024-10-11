"use server";
import { loginSchema, type LoginInput } from "./dto/auth.dto";
import { headers } from "next/headers";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "./auth";
import { userAgent } from "next/server";

export const doLogin = async (data: LoginInput) => {
  const failedLogin = {
    result: false,
    user: null,
    authorizedRedirectUrls: ["/"],
  };

  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    return failedLogin;
  }

  const loginData = validatedData.data;

  //   Force login for testing purposes
  //   TODO: Implement proper login

  const token = generateSessionToken();
  const headersList = headers();
  const { isBot, browser, device, os, cpu } = userAgent({
    headers: headersList,
  });
  const ipAddress =
    headersList.get("x-real-ip") ?? headersList.get("x-forwarded-for");

  const session = await createSession(token, loginData.email, {
    adminComments: `Auto-login using ${browser.name} on ${device.type} (${device.vendor} ${device.model}) running ${os.name} ${os.version} on ${cpu.architecture}. Is bot: ${isBot}`,
    initialIPAddress: ipAddress ?? undefined,
    userAgent: headersList.get("user-agent") ?? undefined,
  });

  setSessionTokenCookie(token, new Date(session.expiresAt));

  //   TODO: Add logging and CSRF token generation

  return {
    result: true,
    user: session.user,
  };
};
