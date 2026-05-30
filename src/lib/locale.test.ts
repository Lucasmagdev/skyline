import assert from "node:assert/strict";
import test from "node:test";
import { detectLocaleFromLanguages } from "./locale.ts";

test("detects Portuguese from browser language preferences", () => {
  assert.equal(detectLocaleFromLanguages(["pt-BR", "en-US"]), "pt-BR");
  assert.equal(detectLocaleFromLanguages(["pt-PT"]), "pt-BR");
});

test("falls back to English for unsupported browser languages", () => {
  assert.equal(detectLocaleFromLanguages(["es-ES", "en-US"]), "en");
  assert.equal(detectLocaleFromLanguages([]), "en");
});
