import assert from "node:assert/strict";
import { mobileBuyBarVisible } from "../src/components/product/mobileBuyBarVisibility";

assert.equal(mobileBuyBarVisible(true, false, 2000, false), false, "Hidden before the main button is reached");
assert.equal(mobileBuyBarVisible(true, false, -1, false), true, "Visible after the button exits above");
assert.equal(mobileBuyBarVisible(true, true, 300, false), false, "Hidden while the main button is visible");
assert.equal(mobileBuyBarVisible(false, false, -1, false), false, "Never visible at 768px and above");
assert.equal(mobileBuyBarVisible(true, false, -1, true), false, "Overlays take precedence");
console.log("Mobile buy bar visibility rules passed");