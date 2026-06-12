# Phase 1: Data Backup and Download Strategy

## Goal
Secure all existing content from the Sanity CMS before we begin any structural or schema changes, ensuring we do not lose any hard-to-replace information. 

## Steps

1. **Verify the Dataset**
   - Identify the current active dataset in Sanity (e.g., `production`).
   - Use the Sanity CLI to verify access and authentication (`sanity login`).

2. **Execute Full Backup**
   - Create a script or use the CLI command: `sanity dataset export <dataset> ./studio/data_downloads/production-backup.tar.gz`.
   - Ensure the tarball is successfully generated inside the `/studio/data_downloads` directory.

3. **Extract Content for Analysis**
   - Unpack the `.tar.gz` file to inspect `data.ndjson`.
   - Run a validation script to read `data.ndjson` and summarize document counts by type (e.g., `projects`, `experience`, `post`, `skill`, etc.).

4. **Identify Essential Data vs. Removable Data**
   - Maintain core documents: Projects, Experiences, Certifications, Blog Posts, Profiles.
   - Flag documents marked for deletion (e.g., the `skill` documents).

5. **Commit Structure**
   - The `/studio/data_downloads/` folder will be strictly added to `.gitignore` to prevent massive JSON/tarballs from bloating the Git repo.
   - However, a `README.md` inside `/studio/data_downloads/` will document *how* to generate the backup.

## Expected Outcome
A robust safety net in `/studio/data_downloads/` and a clear map of what exists in our CMS right now.
