# Abhinay Pratap Singh — Portfolio

The source for my personal portfolio site: an interactive, responsive frontend experience that introduces my work, interests, and contact paths.

**Live site:** https://myportfolio-delta-ecru-62.vercel.app

## What this project demonstrates

- Responsive layout and interaction design without a frontend framework
- Scroll-driven visual storytelling and theme switching
- Accessible labels for navigation and social links
- A deployed, public-facing product maintained alongside the source code

## Run locally

```bash
git clone https://github.com/abhinayhoon/myportfolio.git
cd myportfolio
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Project structure

```text
.
├── index.html                    # page content and semantic structure
├── style.css                     # layout, themes, and responsive styling
├── script.js                     # navigation and animation behaviour
├── profile.jpg                   # profile image
├── hero-bg.png                   # hero artwork
└── AbhinayPratapSingh_Resume.pdf # downloadable résumé
```

## Stack

HTML, CSS, vanilla JavaScript, GSAP/ScrollTrigger, Lenis, and Vercel.

## Maintenance notes

Before presenting a new project or skill on the live site, make sure it has a public repository or another verifiable artifact. Keep project descriptions factual and replace placeholder claims with links to shipped work.

## Roadmap

- [ ] Add a lightweight deployment and accessibility check
- [ ] Add direct repository links beside live demos
- [ ] Audit third-party CDN dependencies and pin versions where possible
- [ ] Remove OS/editor artifacts from version control
