## Contributing to WickLog Blog

This repo is for our internal use. If you want to make changes or add a post:

1. **Sync:** Always pull the latest changes from `master` before starting.
2. **Branch:** Create a new branch for your specific task (e.g., `feat/topic-name` or `fix/issue-name`).
3. **Review:** Once you push, open a Pull Request and tag a team member for a quick review.

Please keep our coding standards and existing folder structure in mind. Happy coding!

## Writing a post

1. Copy `content/posts/_template.mdx` to `content/posts/<slug>.mdx` and fill in the frontmatter.
2. Put images in `public/images/` and reference them as `/blog/images/<file>`.
3. Link to other posts with a relative path: `[text](/<slug>)`.
4. Run `npm run check:content` before pushing. It also runs automatically before every build and **fails the build** on:
   - visible editorial markers like `[SCREENSHOT: …]` or `[NEEDS SOURCE: …]`
   - missing images, broken links between posts, duplicate slugs, invalid frontmatter
   - MDX that doesn't compile (e.g. a bare `<` or `{` in text)

   If you're waiting on a screenshot, use a hidden comment instead: `{/* TODO screenshot: … */}`.
   `npm run check:content -- --todo` lists every outstanding TODO.

### Facts that go stale

Re-check these against the live site / exchange before publishing, and grep older posts when they change:

- WickLog pricing and plan limits (currently Pro ₹349/month or ₹2,250/year; free plan 50 trades + 50 journal entries a month)
- NSE lot sizes (Nifty 65, Bank Nifty 30 from the January 2026 series) and expiry days (Nifty weekly on Tuesday; Bank Nifty has no weekly expiry)
- STT and exchange charges (STT 0.15% on option premium sold, 0.05% on futures sold, since 1 April 2026)
- SEBI loss statistics (latest: August 2026 study, 87.7% of individual F&O traders lost money in FY26)

When you materially revise a published post, add `updated: "YYYY-MM-DD"` to its frontmatter.
