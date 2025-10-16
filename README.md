# normal-resume

Version control for my resume. Now a PDF generates from html so I can vibe code my resume.

- GitHub README and personal website both point to the file `Justin_Avery_Chan_Resume.pdf`.
    - You need to keep the pages environment up for the link to the file to work
    - Link to file: [https://www.averychan.site/normal-resume/Justin_Avery_Chan_Resume.pdf](https://www.averychan.site/normal-resume/Justin_Avery_Chan_Resume.pdf)
- Record where I add links here incase I ever change url again. Linked to from:
    - [Website] About page
    - [Website] Resume nav link
    - [GitHub README] Badge
    - LinkedIn Profile

## Dev

### Resume Generator

**Local PDF generation:**
```bash
npm run setup    # First time only
npm run generate # Create Justin_Avery_Chan_Resume.pdf
npm run preview  # View at localhost:3000
```

**GitHub Actions:** Auto-generates PDF on push to main/html-workflow or manual dispatch. PDF commits back to repo for GitHub Pages.
