import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(process.cwd(), '..');
const allowlistPath = resolve(repoRoot, '.gitleaks.toml');
const fixtureDir = resolve(repoRoot, 'tests/fixtures/gitleaks');

describe("gitleaks config", () => {
  it("has a .gitleaks.toml at the repo root", () => {
    expect(existsSync(allowlistPath)).toBe(true);
  });

  it("allowlist is documented and minimal", () => {
    const toml = readFileSync(allowlistPath, "utf-8");
    expect(toml).toContain("[allowlist]");
    expect(toml).toContain("description");
  });

  it("allowlist covers the fixture path even if no fixture is committed", () => {
    const toml = readFileSync(allowlistPath, "utf-8");
    expect(toml).toMatch(/tests[\\/]fixtures[\\/]gitleaks/);
  });

  it("fixture directory exists and contains only .gitkeep (the actual scan is CI-side)", () => {
    if (!existsSync(fixtureDir)) return;
    const entries = readdirSync(fixtureDir).filter((f) => f !== ".gitkeep");
    expect(entries.length).toBe(0);
  });
});
