# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and internship coordinators deciding whether to shortlist Faiz Syauqi, a Bachelor in Information Technology (Hons.) student at UiTM, for an internship or entry-level role. They usually skim fast, often between other candidates and sometimes on a phone from a link in a CV or LinkedIn. They are trying to answer one question: is this student capable, well-rounded, and worth an interview?

No other audiences have been confirmed. Lecturers, judges, friends, and followers may visit, but the site is not built for them.

## Product Purpose

A personal portfolio site that presents Faiz as a capable, well-rounded IT student: who they are, what they have studied, what they can do, and what they have built or designed. Success means a recruiter can tell what Faiz can do within one short visit, opens at least one project, and has a clear way to reach them (LinkedIn, GitHub).

## Positioning

Breadth backed by real coursework and recognition. Faiz is a well-rounded IT student, not a specialist. The evidence covers UI/UX design (FreshDash, D'WanaConnect, Limited Focus), full-stack enterprise development (DWASPA in Java EE/JSP with a database), and databases, and one project won an external award (Limited Focus, Silver Medal at KL3IS 2025). The site should come across as a student with range and proof behind it, not as a designer-only or developer-only portfolio.

## Operating Context

- Recruiters arrive from a CV, LinkedIn profile, or a shared link and spend very little time on the site.
- Projects are university group assignments (course codes ICT552, CSC584, ISP640, ICT554) plus one competition entry. Work is presented as screenshot galleries in a lightbox.
- Static site, edited by hand and versioned in git.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS. No build step and no framework. Pages: `index.html` (Home), `biography.html`, `projects.html`. Shared `site.css` and `site.js`; GSAP, ScrollTrigger and Lenis load from CDNs (no build step).
- Projects page detail view: `[data-project="id"]` buttons open a project sheet. Screens come from `assets/projects-web/gallery-data.js` (generated from `manifest.json`); the info column is cloned from `<template id="sheet-id">` in projects.html. Domino's opens in phone-frame mode (screens at native 1x size, never upscaled).
- Images: WebP copies (max 1600px wide, plus 240px thumbs) live in `assets/projects-web/`; originals in `images/` and `portfolio-assets/` are kept.
- Resume: `AHMAD FAIZ SYAUQI_RESUME.pdf` at the root, linked from the nav on every page, the home hero and the projects contact row.
- Group projects must stay labelled as group assignments. Do not imply solo authorship.
- Gaming and the casual personality are minimal: at most a line in the biography. The headline is "IT Student · UI/UX & Full-Stack Development" (approved by the user, Nov 2026).
- Email (faizsyq@gmail.com) and a resume PDF are published. Still undecided: a contact form, or availability dates for internships.

## Brand Commitments

- Name: Faiz Syauqi (full name on LinkedIn: Ahmad Faiz Syauqi bin Mohd Fauzi).
- Personal logo: `My Landing Page Logo.png` (also the favicon).
- Profile photo: `portrait.webp` with `portrait.png` fallback (waist-up transparent cutout, 819×1339, upscaled 4× with Real-ESRGAN and edge-cleaned). Unedited cutout: `portrait-original.png`. Original photo: `My Profile Pic.jpeg`.
- Voice: first person, friendly and plain, leaning professional for a recruiter audience.

## Evidence on Hand

- **Projects** (screenshots under `images/`):
  - FreshDash UI Design: e-commerce grocery app UI with an AI meal planner. ICT552 group assignment, Canva. `images/FreshDash/`
  - DWASPA E-Commerce Web App: full system (front end, back end, database) for a spa and wellness business. CSC584 group assignment, Java EE/JSP/HTML/CSS. `images/DWASPA/`
  - D'WanaConnect System: spa management system UI. ISP640 group assignment, Canva. `images/D'WanaConnect/`
  - Limited Focus Application: support app for OKU (persons with disabilities). ICT554 group assignment and KL3IS 2025 entry, **Silver Medal**. `images/Limited Focus/`
  - ShutterQ, photography studio booking system: ICT600 group project (team of 5), PHP/MySQL/Bootstrap/JS on XAMPP. Role: UX design & development. GitHub: github.com/rifhanbusy/Photography_Booking. `portfolio-assets/photography-studio-booking/` (only the blurred admin/customer screens may be used).
  - Domino's Pizza app IA redesign: ICT603 group project (team of 4). Role: UI/UX design. SUS test with 10 users; 90% rated Compare Offers 4 or 5 out of 5 (from the resume). Screens are ~130x300 exports. `portfolio-assets/dominos-app-redesign/`
  - FitTrack exercise tracker: ICT600 individual assignment, PHP/MySQL/Bootstrap 5/JS. `portfolio-assets/fittrack-exercise-tracker/`
  - Project details source: `portfolio-assets/PROJECTS.md` and the resume PDF.
- **Education:** BIT (Hons.) at UiTM (current). Foundation in Engineering at UiTM, CGPA 3.56. High school Pure Science, 7As and 2Bs.
- **Skills listed:** HTML, CSS, JavaScript, Java (OOP, servlets), SQL/MySQL, C++ basics. Interests in AI (exploring, not studying machine learning) and content creation (graphic design, photography, video editing).
- **Profiles:** GitHub `faizsyq`, LinkedIn. (Instagram and TikTok were removed from the site in Nov 2026; do not re-add.)
- **Absent, do not fabricate:** testimonials, employer references, internship or work experience, live demo URLs, code repositories for specific projects (except the ShutterQ GitHub repo), individual contribution breakdowns for group work, and metrics.

## Product Principles

1. **Recruiter's scan first.** Every page should answer "what can Faiz do, and what's the proof?" within seconds.
2. **Range with receipts.** Show breadth across design, development, and databases, and tie each claim to a project, course, or result.
3. **Honest attribution.** Group work is labelled as group work, and awards and grades are stated exactly as earned.
4. **Professional before personal.** Personality shows in the voice, not in hobby content.
5. **Easy next step.** A route to LinkedIn and GitHub (and any future CV or contact option) is always close at hand.
