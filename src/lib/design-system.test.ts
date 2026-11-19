import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("every page and component follows docs/DESIGN_SYSTEM.md", () => {
  const r = spawnSync(process.execPath, ["scripts/audit-design-system.mjs"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
