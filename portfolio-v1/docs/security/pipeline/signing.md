# Cosign Keyless Signing Policy

This document describes how the Namias portfolio uses Cosign keyless signing to bind deploy artifacts to the OIDC identity of the GitHub Actions workflow that built them. It is the canonical answer to "what is signed, how, and how do I verify?"

## Why sign deploy artifacts

A signed artifact can be verified by anyone, anywhere, without trusting the publisher's key management. The signature proves two things:

1. **Integrity**: the artifact has not been modified since it was signed
2. **Provenance**: the artifact was signed by a specific OIDC identity (a specific GitHub Actions workflow run)

For the portfolio, the signed artifact is the SBOM of the deployed Worker. The signature is the audit trail that says "this exact set of dependencies, with this exact lockfile, was built by this exact workflow run."

## What is signed

`cloudflare-deploy.yml` generates a CycloneDX 1.5 JSON SBOM from `package-lock.json` and signs it with `cosign sign-blob`. The signature, the certificate, and the SBOM itself are uploaded as a single artifact (`deploy-sbom-signed-${{ github.run_id }}`).

The deploy itself is not signed directly because Cloudflare Workers is a serverless runtime; there is no container image to sign. The SBOM is the next-best proxy: it captures the dependency set that shipped in that deploy, and the signature binds it to the workflow run.

## How keyless signing works

Keyless signing is a two-party protocol:

1. **The workflow** (the runner) generates an ephemeral key pair in memory. The private key is destroyed at the end of the run.
2. The workflow requests a signing certificate from **Sigstore Fulcio**, presenting the GitHub Actions OIDC token as proof of identity. Fulcio mints a short-lived X.509 certificate that binds the public key to the OIDC identity (`https://github.com/PP-Namias/Portfolio/.github/workflows/cloudflare-deploy.yml@refs/heads/main`).
3. The workflow uses the private key to sign the artifact. The signature, the public key (via the cert), and the artifact are uploaded.
4. **The transparency log** (Sigstore Rekor) records the signing event. This is the public, append-only audit trail.

Verification later is a three-step process:

1. The verifier checks that the signature is valid for the public key in the certificate.
2. The verifier checks that the certificate was issued by Fulcio.
3. The verifier checks that the certificate's OIDC identity matches the expected identity (e.g. the workflow file + the branch).

No KMS, no key rotation, no secret to leak.

## The OIDC identity we expect

The Cosign sign step is part of the `cloudflare-deploy.yml` workflow. The expected OIDC identity, when verifying, is:

```
https://github.com/PP-Namias/Portfolio/.github/workflows/cloudflare-deploy.yml@refs/heads/main
```

This identity is bound by the Fulcio certificate at signing time. The certificate is uploaded with the signature, so a verifier only needs:

```bash
cosign verify-blob \
  --certificate sbom.cdx.json.cert \
  --signature sbom.cdx.json.sig \
  --certificate-identity 'https://github.com/PP-Namias/Portfolio/.github/workflows/cloudflare-deploy.yml@refs/heads/main' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  sbom.cdx.json
```

The `verify-blob` subcommand (not `verify`) is the correct one for non-image artifacts.

## Failure handling

A Cosign verification failure is treated as a **security event**, not a configuration issue:

1. The deploy is paused.
2. The on-call engineer is paged (or the workflow fails loudly, depending on the deploy target).
3. The event is investigated:
   - Was the artifact substituted between build and deploy? (the worst case)
   - Was the workflow refactored and the OIDC identity changed without updating the verify step? (a config issue)
   - Was the signing certificate's transparency log entry missing? (a Sigstore incident)

There is no "ignore the failure" path. If a failure cannot be explained, the deploy is rolled back and the artifact is treated as compromised.

## How to verify locally

```bash
# Install cosign: https://docs.sigstore.dev/cosign/installation/

cosign verify-blob \
  --certificate sbom.cdx.json.cert \
  --signature sbom.cdx.json.sig \
  --certificate-identity 'https://github.com/PP-Namias/Portfolio/.github/workflows/cloudflare-deploy.yml@refs/heads/main' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  sbom.cdx.json
```

The exit code is 0 on success, non-zero on failure. The output prints the verified identity, the issuer, the transparency log entry, and the certificate expiry.

## Why not also sign the deploy itself

Cloudflare Workers doesn't have a "deploy" artifact in the Sigstore sense. The closest equivalent would be the Worker script bundle, but Cloudflare's deploy API doesn't expose the bundle for signing. The SBOM is the audit trail we have. If the deploy target changes to a container-based platform, the container image would also be signed with `cosign sign --keyless` (instead of `sign-blob`), and a verify step would be added to the deploy.

## Related documents

- `docs/security/pipeline.md` - the seven-stage gate
- `.github/workflows/cloudflare-deploy.yml` - the workflow with the sign step
