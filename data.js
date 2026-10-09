/* ==========================================================================
   RED CHAIR PRODUCTIONS — SITE CONTENT
   Everything that changes when real work arrives lives in this file.
   Replace media paths / titles here; the layout never needs to change.

   Media rules
   - video:  muted preview loop, 16:9, ideally ≤ 8s and ≤ 2 MB (H.264 MP4)
   - poster: a frame taken from that same clip (JPG/WEBP), shown until the
             video loads and on slow connections
   - full:   optional full-length film opened in the fullscreen player
   ========================================================================== */

window.RC = {
  studio: {
    name: 'Red Chair Productions',
    city: 'Dhaka, Bangladesh',
    email: 'info@redchairproductions.com',
    // Replace '#' with the real profile URLs.
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },

  hero: {
    video: 'assets/media/showreel-v2.mp4',          // landscape 16:9
    videoMobile: 'assets/media/hero-mobile-v2.mp4', // vertical 9:16, same edit
    poster: 'assets/media/showreel-v2.jpg',
    posterMobile: 'assets/media/hero-mobile-v2.jpg',
  },

  reel: {
    video: 'assets/media/showreel-v2.mp4',
    poster: 'assets/media/showreel-v2.jpg',
    runtime: '00:00:19:20',
  },

  // Formats listed in "What we create"
  formats: [
    'Film & Video Production', 'TVC', 'OVC', 'Commercials', 'Branded Content',
    'Brand Stories', 'Documentaries', 'Social Campaigns', 'Post Production',
    'Motion Graphics', 'Creative Design', 'VFX',
  ],

  filters: [
    'All', 'Commercials', 'TVC', 'OVC', 'Branded Content', 'Documentaries',
    'Film', 'Social Content', 'VFX', 'Motion Graphics',
  ],

  /* Featured work. Order = order on the page.
     size: 'xl' full-width hero · 'l' large landscape · 'm' half · 's' supporting · 'p' portrait
     placeholder: true shows a small "Concept" tag. Set false for real client work. */
  projects: [
    { title: 'Dhaka After Dark', category: 'Brand Film', year: '2026', size: 'xl',
      tags: ['Film', 'Branded Content', 'Commercials'],
      video: 'assets/media/dhaka-after-dark-cinematic-loop.mp4', poster: 'assets/media/dhaka-after-dark-cinematic.webp', placeholder: true },
    { title: 'City in Motion', category: 'Commercial', year: '2026', size: 'l',
      tags: ['Commercials', 'TVC', 'OVC'],
      video: 'assets/media/city-in-motion-cinematic-loop.mp4', poster: 'assets/media/city-in-motion-cinematic.webp', placeholder: true },
    { title: 'Monsoon Stories', category: 'Documentary', year: '2026', size: 'p',
      tags: ['Documentaries', 'Film', 'Social Content'],
      video: 'assets/media/monsoon-stories-cinematic-loop.mp4', poster: 'assets/media/monsoon-stories-cinematic.webp', placeholder: true },
    { title: 'Made Here', category: 'Product Film', year: '2026', size: 'm',
      tags: ['Branded Content', 'Commercials', 'OVC'],
      video: 'assets/media/made-here-cinematic-loop.mp4', poster: 'assets/media/made-here-cinematic.webp', placeholder: true },
    { title: 'The Evening Table', category: 'Social Campaign', year: '2026', size: 'm',
      tags: ['Social Content', 'OVC', 'Commercials'],
      video: 'assets/media/evening-table-cinematic-loop.mp4', poster: 'assets/media/evening-table-cinematic.webp', placeholder: true },
    { title: 'Built for Tomorrow', category: 'Brand Story', year: '2026', size: 'xl',
      tags: ['Documentaries', 'Branded Content', 'TVC'],
      video: 'assets/media/built-for-tomorrow-cinematic-loop.mp4', poster: 'assets/media/built-for-tomorrow-cinematic.webp', placeholder: true },
    { title: 'Behind the Frame', category: 'Production', year: '2026', size: 's',
      tags: ['Film', 'Social Content'],
      video: 'assets/media/cinema-rig-cinematic-loop.mp4', poster: 'assets/media/cinema-rig-cinematic.webp', placeholder: true },
    { title: 'Final Grade', category: 'Post Production', year: '2026', size: 's',
      tags: ['VFX', 'Motion Graphics'],
      video: 'assets/media/post-production-cinematic-loop.mp4', poster: 'assets/media/post-production-cinematic.webp', placeholder: true },
    { title: 'In the Chair', category: 'Director Portrait', year: '2026', size: 's',
      tags: ['Documentaries', 'Motion Graphics', 'VFX'],
      video: 'assets/media/azafi-sifat-director-loop.mp4', poster: 'assets/media/azafi-sifat-director.webp', placeholder: true },
  ],

  services: [
    ['Film & Video Production', 'End-to-end production, from first treatment to final master.'],
    ['TVC Production', 'Broadcast commercials built for impact in the first three seconds.'],
    ['OVC Production', 'Online-first films cut for every platform and aspect ratio.'],
    ['Commercial Production', 'Product and brand commercials with a cinematic finish.'],
    ['Brand Storytelling', 'Finding the human story behind a brand and filming it honestly.'],
    ['Documentary Production', 'Long and short-form non-fiction, researched and shot with care.'],
    ['Post Production', 'Offline to online, sound, finishing and delivery under one roof.'],
    ['Video Editing', 'Rhythm, structure and pace that keep people watching.'],
    ['Color Grading', 'A deliberate look, consistent from the first frame to the last.'],
    ['Motion Graphics', 'Type, titles and animation that move with the story.'],
    ['VFX', 'Clean-up, compositing and invisible effects.'],
    ['Creative Direction', 'Concept, treatment and a clear point of view before a frame is shot.'],
    ['Creative Design', 'Key art, title design and campaign visuals.'],
  ],

  process: [
    ['Idea', 'Concept, treatment, script'],
    ['Pre-Production', 'Casting, locations, planning'],
    ['Production', 'Crew, camera, light, sound'],
    ['Post', 'Edit, grade, sound, VFX'],
    ['Delivery', 'Masters for every screen'],
  ],

  /* Client / partner logos. Leave logo: null to show an empty slot.
     For a real logo use an SVG or transparent PNG: { name: 'Brand', logo: 'assets/clients/brand.svg' } */
  clients: [
    { name: 'Client 01', logo: null }, { name: 'Client 02', logo: null },
    { name: 'Client 03', logo: null }, { name: 'Client 04', logo: null },
    { name: 'Client 05', logo: null }, { name: 'Client 06', logo: null },
    { name: 'Client 07', logo: null }, { name: 'Client 08', logo: null },
  ],
};
