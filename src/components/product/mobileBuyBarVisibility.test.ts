import { describe, expect, it } from "vitest";
import { mobileBuyBarVisible } from "./mobileBuyBarVisibility";

describe("mobileBuyBarVisible", () => {
  it("shows after first scroll even before the main button is reached", () => expect(mobileBuyBarVisible(true, false, true, false)).toBe(true));
  it("hides while the main button is visible", () => expect(mobileBuyBarVisible(true, true, true, false)).toBe(false));
  it("hides on the untouched first view", () => expect(mobileBuyBarVisible(true, false, false, false)).toBe(false));
  it("hides while a dialog or cookie banner is open", () => expect(mobileBuyBarVisible(true, false, true, true)).toBe(false));
  it("hides on desktop", () => expect(mobileBuyBarVisible(false, false, true, false)).toBe(false));
});
