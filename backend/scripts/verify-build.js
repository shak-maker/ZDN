#!/usr/bin/env node
/**
 * Post-build sanity check for the compiled NestJS output.
 *
 * A partial/corrupt `dist/` (e.g. caused by a stale TypeScript incremental
 * cache) crashes the app on boot with `Cannot find module './x'`, which under
 * PM2 turns into an endless restart loop and a 502 at the gateway.
 *
 * This verifier statically resolves every relative `require()` emitted into the
 * build and fails loudly if any target file is missing — BEFORE we (re)start
 * the process. It does not execute any application code.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.argv[2] || 'dist');
const entry = path.join(distDir, 'main.js');

function listJsFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...listJsFiles(full));
    else if (name.isFile() && full.endsWith('.js')) out.push(full);
  }
  return out;
}

// Matches require("./x"), require('../x/y') — relative specifiers only.
const RELATIVE_REQUIRE = /require\(\s*(['"])(\.\.?\/[^'"]+)\1\s*\)/g;

function resolves(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.js`,
    `${base}.json`,
    `${base}.node`,
    path.join(base, 'index.js'),
    path.join(base, 'index.json'),
  ];
  return candidates.some((c) => {
    try {
      return fs.statSync(c).isFile();
    } catch {
      return false;
    }
  });
}

function main() {
  if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
    console.error(`[verify-build] dist directory not found: ${distDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(entry)) {
    console.error(`[verify-build] entrypoint missing: ${entry}`);
    process.exit(1);
  }

  const files = listJsFiles(distDir);
  if (files.length === 0) {
    console.error(`[verify-build] no compiled .js files in ${distDir}`);
    process.exit(1);
  }

  const missing = [];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    let m;
    RELATIVE_REQUIRE.lastIndex = 0;
    while ((m = RELATIVE_REQUIRE.exec(src)) !== null) {
      const spec = m[2];
      if (!resolves(file, spec)) {
        missing.push({ file: path.relative(distDir, file), spec });
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      `[verify-build] FAILED: ${missing.length} unresolved relative import(s) in compiled output:`,
    );
    for (const { file, spec } of missing) {
      console.error(`  - ${file} -> ${spec}`);
    }
    console.error(
      '[verify-build] The build is incomplete. Refusing to deploy a partial dist.',
    );
    process.exit(1);
  }

  console.log(
    `[verify-build] OK: ${files.length} compiled files, all relative imports resolve.`,
  );
}

main();
