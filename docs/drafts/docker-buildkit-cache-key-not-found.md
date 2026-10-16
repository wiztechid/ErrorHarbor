# Docker BuildKit: “failed to compute cache key … not found” — diagnose the missing COPY source

**Editorial state:** DRAFT — NOT PUBLISHED / NOT INDEXABLE  
**Target URL (pending gate):** `/errors/dev/docker/failed-to-compute-cache-key-not-found/`  
**Last reviewed:** 2026-10-17  
**Applies to:** Docker BuildKit / `docker build`, `docker buildx build`, Compose builds using Dockerfiles with `COPY` or `ADD`  
**Risk:** Low for inspection; medium if changing build inputs or ignore rules. Never expose credentials through the build context.

## Quick answer

When BuildKit says `failed to solve: failed to compute cache key: failed to calculate checksum of ref ... "/some/path": not found` while processing `COPY`, the named source is not available in the source filesystem BuildKit is reading. Most often, the file is outside the **build context**, has been excluded by `.dockerignore`, is misspelled (including capitalization), or the `COPY --from` stage does not contain it. Clearing the build cache does not restore an absent source.

## Error fingerprint

You are likely in the right place if the build log highlights `COPY` or `ADD`, and the final error includes `failed to compute cache key`, `failed to calculate checksum`, and a quoted path ending in `not found`. Record that path and the highlighted Dockerfile line. If the error instead says `failed to read dockerfile`, diagnose the Dockerfile location separately.

## Choose your path

| Evidence | Inspect first | Likely correction |
|---|---|---|
| `COPY package.json ./` fails only with `docker build -f docker/Dockerfile docker` | Positional build context (`docker`) | Build from repository root with `docker build -f docker/Dockerfile .`, if the intended inputs are under root |
| File exists on disk but not in build | Root `.dockerignore` and Dockerfile-specific ignore file | Narrow exclusion or add a deliberate exception; do not include secrets |
| Works on Windows, fails in Linux CI | Exact filename capitalization and tracked files | Match the case exactly and commit required files |
| `COPY --from=builder /app/dist ...` fails | The builder stage and actual output directory | Ensure preceding stage generates the named directory |
| Works locally, fails in CI | CI checkout, submodules, working directory, build context and ignore files | Align the CI build invocation and inputs with the verified local command |

## Quick checks (read-only)

1. Copy the exact failing `COPY` line and the quoted missing path from the build log.
2. Find the **last positional argument** of your build command. In `docker build -f docker/Dockerfile .`, the context is `.`, **not** `docker/`. For Compose, inspect the service's `build.context` relative to the Compose project file.
3. From the context root, check whether the source actually exists. On macOS/Linux: `pwd; ls -la; ls -la path/to/source`. On PowerShell: `Get-Location; Get-ChildItem -Force; Test-Path path/to/source`.
4. Inspect `.dockerignore` at the context root and any Dockerfile-specific ignore file (for example, `docker/build.Dockerfile.dockerignore`). The latter takes precedence for that Dockerfile.
5. If `COPY --from=...` is used, check the named stage's `WORKDIR`, `RUN` output and the exact path inside that stage. The source is **not** taken from the local context in that case.

**Verification:** Rebuild using the same command and inspect whether the original `COPY` step now succeeds. A later, different build failure is a new diagnostic branch, not proof that the whole image works.

## Fix 1 — Correct the build context, not the Dockerfile directory

Example repository:

```text
project/
  package.json
  src/
  docker/
    Dockerfile
```

With `COPY package.json ./` in `docker/Dockerfile`, run from `project/`:

```sh
docker build --progress=plain -f docker/Dockerfile -t myapp:diagnostic .
```

The trailing `.` sends `project/` as the context. Running `docker build -f docker/Dockerfile docker/` instead excludes root-level `package.json`. **Verify:** the log progresses beyond the `COPY package.json` instruction. If it still fails, inspect ignore rules before making more edits.

## Fix 2 — Check `.dockerignore` and Dockerfile-specific exclusions

For a source `dist/app.js`, an ignore rule such as `dist` may exclude the entire directory. A narrowly scoped exception can be appropriate, but Docker's ignore matching is order-sensitive: the **last matching rule** determines inclusion. Inspect all matching rules and the Dockerfile-specific ignore file. Never solve the error by sending `.env`, private keys or credentials to the builder.

**Verify:** run the build again and confirm the previously missing source is available. If an exception doesn't help, revisit context root and case sensitivity rather than removing every ignore rule.

## Fix 3 — Correct source spelling and CI checkout

Linux paths are case-sensitive. `COPY Config.json ./` does not find `config.json` on a Linux builder. Check `git ls-files` for the exact tracked path, ensure the CI checkout includes it, and check whether the file is generated in an earlier job but never copied into the build context. For submodules, verify they are initialized in CI before building.

**Verify:** compare the failing command, context and tracked file tree between local and CI; rebuild with the same CI inputs.

## Fix 4 — For multi-stage builds, check the producing stage

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

Here `/app/dist` must be created **inside** `builder`. If the build tool emits `/app/build` instead, adjust the producing command or the final `COPY` path after confirming the output. Do not change paths by guesswork.

**Verify:** build the builder stage alone using `docker build --target builder --progress=plain -t myapp:builder .`; if necessary, inspect its filesystem with a disposable container appropriate to that stage. Confirm the output path exists before the final stage.

## What not to do

- Do **not** start with `docker system prune -a` or deleting build caches; it can remove useful local images and does not fix an absent source.
- Do **not** disable BuildKit to mask an incorrect context or missing file.
- Do **not** remove `.dockerignore` wholesale or copy secrets into the image.
- Do **not** change `COPY --from` paths without checking the producing stage.

## Still seeing the error?

Capture the exact command, working directory, Dockerfile path, build context, failing `COPY` line, full quoted missing path, applicable ignore files, `docker version`, `docker buildx version`, and whether the same commit works locally and in CI. Redact registry credentials, environment secrets and private source paths before sharing. If the source exists in the verified context and is not ignored, collect a minimal reproducer and check current BuildKit issues rather than assuming a cache bug.

## Sources and further reading

- Docker Docs — Build context: https://docs.docker.com/build/concepts/context/
- Docker Docs — Dockerfile reference: https://docs.docker.com/reference/dockerfile/
- Docker Docs — CopyIgnoredFile build check: https://docs.docker.com/reference/build-checks/copy-ignored-file/
- BuildKit issue #4132 (community case; not a general confirmed root cause): https://github.com/moby/buildkit/issues/4132

## Editorial release checklist (BLOCKING)

- [ ] Confirm no existing canonical page/registry entry targets the same intent.
- [ ] Document 2–5 live SERP variants, weakness and MOS evidence; record competing strong specialist coverage.
- [ ] Convert this draft to site-standard HTML with answer, decision paths, verification, safety, related links, references and structured data.
- [ ] Atomic SEO graph update: `data/search-index.json`, parent hub, homepage latest six, at least one relevant sibling backlink, sitemap, changelog and current publication registry.
- [ ] Validate AQS >=80, SEO Link Guard, lightweight CI, live canonical/indexability and URL after deploy.
- [ ] Do not backdate publication or claim tested fixes without reproducible testing.
