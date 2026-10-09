# Red Chair Productions — website

Static site: `index.html`, `styles.css`, `main.js`, and `data.js`. There's no build step.
GSAP, ScrollTrigger, Flip and Lenis are loaded from a CDN.

## Swapping in real work
Change **`data.js`** only. You can edit the hero and reel videos, the projects, services, process steps, client logos, socials and email there.

- Project preview: a muted 16:9 MP4 loop, ideally 8s or shorter and 2 MB or smaller. Its poster should be a frame from the same clip.
- `full`: optional. Set it on a project to open a full-length film in the player.
- `placeholder: false`: removes the "Concept" tag.
- `size`: `xl`, `l`, `m`, `s` or `p`. This sets the editorial rhythm of the grid.
- Client logos: `{ name, logo: 'assets/clients/x.svg' }`. Logos show in monochrome and switch to colour on hover.

Brand: #EA2336 / #000 / #FFF · Space Mono (titles, labels) + Inter (reading).
