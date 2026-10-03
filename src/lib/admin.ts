export const ADMIN_EMAIL = "cyberbarokah@reviewgate.internal";
export const ADMIN_WA = "6283190033720";

export function isAdminEmail(email?: string | null) {
  return !!email && email === ADMIN_EMAIL;
}