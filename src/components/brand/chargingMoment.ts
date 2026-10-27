export const CHARGE_DURATION = 900;
export const CHARGE_STAGGER = 180;
export const CHARGE_END = CHARGE_DURATION + 2 * CHARGE_STAGGER;

export function chargingPercent(elapsed: number, ring: number) {
  return Math.round(Math.min(1, Math.max(0, (elapsed - ring * CHARGE_STAGGER) / CHARGE_DURATION)) * 100);
}

/** Storage is optional: restricted browsers still retain the guard in memory. */
export function createMomentVisitGate() {
  let seen = false;
  return (storage?: Pick<Storage, "getItem" | "setItem">) => {
    if (seen) return false;
    seen = true;
    try {
      if (storage?.getItem("raj-charging-moment-seen") === "1") return false;
      storage?.setItem("raj-charging-moment-seen", "1");
    } catch { /* Keep the in-memory guard if storage is blocked. */ }
    return true;
  };
}

export const claimChargingMoment = createMomentVisitGate();