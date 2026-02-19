# LionLearn — Business Processes

_Last updated: February 19, 2026_

---

## 1. Student Acquisition

- **School outreach** → pitch to department heads / IT directors
- **Class rep network** → identify influential students in each class who spread the word
- **Demo sessions** → 30-min live demo in a lecture hall showing the platform
- **Registration link** → send directly to WhatsApp class groups
- **Intake period** → best window is week 1–2 of semester or 3 weeks before exams

---

## 2. School Onboarding

1. Collect school info (name, city, logo)
2. Upload course materials (PDFs/MD files) → convert to course content
3. Create school → department → class hierarchy in admin panel
4. Set up demo student account for professors to review
5. Grant 50 welcome credits to first-wave students

---

## 3. Content Management

- **Per semester**: add/update course markdown files when syllabi change
- **Ad hoc**: create new courses when departments expand
- Monitor which courses get most AI generation to prioritize content quality
- Review AI-generated content quality periodically (check activity log for errors)

---

## 4. Student Support

- Monitor admin activity log daily (5 min) for errors or stuck users
- Handle password reset requests (currently manual — admin resets)
- Respond to content quality complaints (wrong answers, bad exercises)
- Deactivate abusive/shared accounts

---

## 5. Revenue & Credits

- **Subscription activation**: student pays → admin activates in user detail page → done
- **Credit sales**: student requests credits → admin grants via admin panel
- **Payment tracking**: currently manual (Mobile Money screenshot → verify → activate)
- **Monthly reconciliation**: check how many active subscribers vs. credit pack sales
- Invoice/receipt on request (manual for now)

### Credit Pack Pricing
| Pack | Credits | Price (FCFA) |
|------|---------|-------------|
| Starter | 30 | 500 |
| Standard | 75 | 1 000 |
| Pro | 200 | 2 500 |

### Subscription Pricing
| Plan | Price (FCFA) | Duration |
|------|-------------|----------|
| Mensuel | 5 000 | 30 days |
| Annuel | 40 000 | 365 days |

### Break-even
- Monthly costs: ~37 500 FCFA (VPS + domain)
- Break-even subscriptions: **12 students** at 5 000 FCFA/month
- 100 subscribers: **~296 000 FCFA/month net** (~89% margin)

---

## 6. Technical Operations

- Monitor server uptime: `https://lionlearning.briskprototyping.com`
- Check container logs weekly: `docker compose logs app --tail=50`
- Deploy updates: `Set-Location c:\Users\bwagu\dev\lion\school\tutoring-app; docker compose up -d --build`
- Gemini API quota monitoring (free tier: ~1 500 req/day)

### Database Backup (manual until automated)
```bash
docker compose exec db pg_dump -U lionlearn lionlearn > backup_$(date +%Y%m%d).sql
```

---

## 7. Daily Automated Operations

- **5:00 UTC** → scheduler fires, reads `daily_recommendations_enabled` + `daily_recommendations_hour` from DB
- Generates personalized content per active student: exercises, study guides, or flashcards (based on progress rotation)
- Sends email notification if SMTP is configured
- Logs all activity visible in Admin → Activity Log

Manual trigger: Admin → Settings → "Déclencher maintenant"

---

## 8. Analytics & Reporting

- **Daily**: glance at activity log for errors or unusual patterns
- **Weekly**: check admin dashboard (active users, AI generations, top courses)
- **Monthly**: count new registrations, subscription revenue, credit sales
- **Per school**: report usage stats to the school contact to demonstrate value and drive renewals

---

## Critical Gaps (Prioritized)

| # | Gap | Risk | Recommended Fix |
|---|-----|------|----------------|
| 1 | **No DB backup** | Catastrophic — one server failure = total data loss | Automated `pg_dump` via cron daily, upload to cloud storage |
| 2 | **Manual payments** | Doesn't scale beyond ~20 students | Mobile Money API or voucher code system |
| 3 | **No password reset flow** | Students who forget password churn | Self-service reset email |
| 4 | **No invoice/receipt** | Schools won't pay without paperwork | Simple PDF receipt generation |
| 5 | **SMTP not configured** | Daily recommendations silently skip email | Set up Gmail SMTP or Brevo (free tier) |

---

## Key URLs & Commands

| Resource | Value |
|----------|-------|
| Production URL | https://lionlearning.briskprototyping.com |
| Admin panel | https://lionlearning.briskprototyping.com/admin |
| Admin email | admin@lionai.com |
| Workspace | `c:\Users\bwagu\dev\lion\school\tutoring-app` |
| Deploy command | `docker compose up -d --build` |
| View logs | `docker compose logs app --tail=50` |
| Restart app | `docker compose restart app` |
