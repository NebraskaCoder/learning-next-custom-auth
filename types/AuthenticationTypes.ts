import type { UserSelect } from "@/db/schema/users";
import type { SessionSelect, sessionSources } from "@/db/schema/sessions";

export type SessionSource = (typeof sessionSources)[number];

export interface SessionExtraData {
  passKeyUsed?: boolean;
  twoFactorVerified?: boolean;
  userAgent?: string;
  initialIPAddress?: string;
  initialIPAddressReverseLookup?: string;
  source?: SessionSource;
  knownLocation?: string;
  adminComments?: string;
}

export type SessionValidationResult =
  | { session: SessionSelect; user: UserSelect }
  | { session: null; user: null };
