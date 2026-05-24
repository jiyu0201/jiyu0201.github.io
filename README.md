# Yu Ji / 纪雨 Academic Homepage

This is the personal academic homepage of Yu Ji / 纪雨, designed for deployment with GitHub Pages.

Pages included:

- About
- Publications
- Patents
- Projects

All editable data files are located in the `data/` directory.

Update personal profile information in:

```text
data/profile.json
```

Update publications in:

```text
data/publications.json
```

Update patents in:

```text
data/patents.json
```

Update projects in:

```text
data/projects.json
```

Project records only need:

```json
{
  "title": "Project title",
  "start_date": "2025-11-01",
  "partner": "Partner organization",
  "role": "主持",
  "period": "2025-2026",
  "status": "在研"
}
```

`start_date` is used for descending sort and year grouping only. It is not displayed on the page.

Example files are available in:

```text
data/examples/
```

Use these UTF-8 examples as templates, but keep real website data in:

```text
data/profile.json
data/publications.json
data/patents.json
data/projects.json
```

No build step is required. Upload the repository contents to GitHub Pages and visit the configured GitHub Pages URL.
