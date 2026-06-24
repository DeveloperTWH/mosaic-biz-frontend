import test from "node:test";
import assert from "node:assert/strict";
import { formatMarketPrice, isDisplayablePrice, toFiniteNumber } from "../marketplace/display";

test("toFiniteNumber reads normal and Decimal128-like prices", () => {
  assert.equal(toFiniteNumber(12.5), 12.5);
  assert.equal(toFiniteNumber("18.75"), 18.75);
  assert.equal(toFiniteNumber({ $numberDecimal: "20.00" }), 20);
});

test("formatMarketPrice rejects missing, invalid, and implicit zero prices", () => {
  assert.equal(formatMarketPrice(undefined), null);
  assert.equal(formatMarketPrice("not-a-price"), null);
  assert.equal(formatMarketPrice(Number.NaN), null);
  assert.equal(formatMarketPrice(0), null);
});

test("formatMarketPrice can show zero only when explicitly allowed", () => {
  assert.equal(formatMarketPrice(0, { allowZero: true }), "$0.00");
});

test("isDisplayablePrice requires a real positive price by default", () => {
  assert.equal(isDisplayablePrice(12), true);
  assert.equal(isDisplayablePrice(0), false);
  assert.equal(isDisplayablePrice(null), false);
});
