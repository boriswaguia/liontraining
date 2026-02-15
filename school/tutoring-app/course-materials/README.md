# Course Materials — Multitenant Structure

This directory drives the seed script. Drop in a new school, department, class, or course and re-run the seed to populate the database.

## Directory Layout

```
course-materials/
├── <SchoolFolder>/
│   ├── school.json              ← School metadata
│   ├── <DepartmentFolder>/
│   │   ├── department.json      ← Department metadata
│   │   ├── <ClassFolder>/
│   │   │   ├── class.json       ← Class metadata
│   │   │   ├── Course_A.md      ← Course content with YAML frontmatter
│   │   │   ├── Course_B.md
│   │   │   └── ...
│   │   └── <AnotherClass>/
│   │       ├── class.json
│   │       └── ...
│   └── <AnotherDept>/
│       └── ...
└── <AnotherSchool>/
    └── ...
```

## Metadata Files

### `school.json`
```json
{
  "name": "Institut Universitaire de Technologie de Douala",
  "shortName": "UIT Douala",
  "city": "Douala",
  "country": "Cameroun",
  "description": "Optional description"
}
```

### `department.json`
```json
{
  "name": "Génie Informatique",
  "code": "GI",
  "description": "Optional description"
}
```

### `class.json`
```json
{
  "name": "Licence 1",
  "code": "L1",
  "academicYear": "2025/2026",
  "description": "Optional description"
}
```

## Course Markdown Files

Each `.md` file must start with YAML frontmatter:

```markdown
---
code: MTIN-121
title: Analyse Mathématique
description: Nombres complexes, équations, séries et suites numériques
hours: 36
semester: 1
level: 1
category: math
---

# Course content below...
```

**Required fields:** `code`, `title`  
**Optional fields:** `description`, `hours` (default 36), `semester` (default 1), `level` (default 1), `category` (default "general")

Files without frontmatter or missing `code`/`title` are skipped with a warning.

## Adding a New School

1. Create a folder: `course-materials/My-University/`
2. Add `school.json` with name, shortName, city
3. Create department folder(s) with `department.json`
4. Create class folder(s) with `class.json`
5. Add course `.md` files with frontmatter
6. Re-run the seed: `docker compose exec app node seed.js`
