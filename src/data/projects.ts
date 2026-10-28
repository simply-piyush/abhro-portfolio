export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  year: string;
  tools: string[];
  description: string;
  color: string;
  accentColor: string;
  stats?: { label: string; value: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: "project-01",
    number: "01",
    title: "Beacon in the Abyss",
    subtitle: "Blender Ocean Simulation & Cinematic Lighting",
    category: "3D Blender Animation",
    type: "video",
    src: "https://res.cloudinary.com/o46echks/video/upload/v1793205375/video-1.mp4",
    poster: "https://res.cloudinary.com/o46echks/image/upload/v1793205569/video-1-poster.jpg",
    year: "2024",
    tools: ["Blender"],
    description:
      "A cinematic night ocean simulation exploring turbulent water displacement, atmospheric fog scattering, and a lone maritime beacon piercing through the dark waves.",
    color: "#0a192f",
    accentColor: "#DB4726",
    stats: [
      { label: "Render Engine", value: "Cycles" },
      { label: "Simulation", value: "Ocean Displacement" },
      { label: "Resolution", value: "848x480 Widescreen" },
    ],
  },
  {
    id: "project-02",
    number: "02",
    title: "The Silent Witness",
    subtitle: "Creature Rigging & Stylized Environment",
    category: "3D Character & Nature",
    type: "video",
    src: "https://res.cloudinary.com/o46echks/video/upload/v1793205375/video-2.mp4",
    poster: "https://res.cloudinary.com/o46echks/image/upload/v1793205569/video-2-poster.jpg",
    year: "2024",
    tools: ["Blender"],
    description:
      "A vibrant 3D vignette featuring an articulated tree frog perched atop lilypads in a mountain sanctuary, accompanied by fluttering butterfly dynamics.",
    color: "#1e3a2f",
    accentColor: "#2ecc71",
    stats: [
      { label: "Rig Type", value: "Skeletal Deform" },
      { label: "Lighting", value: "Daylight HDRi" },
      { label: "Environment", value: "Procedural Foliage" },
    ],
  },
  {
    id: "project-03",
    number: "03",
    title: "Oreo: Dream in Blue",
    subtitle: "Commercial CGI Splash & Advertising Design",
    category: "Poster",
    type: "image",
    src: "https://res.cloudinary.com/o46echks/image/upload/v1793205568/image-4.jpg",
    year: "2024",
    tools: ["Photoshop"],
    description:
      "Commercial product poster design showcasing dynamic fluid splash dynamics, floating Oreo cookie physics, and bold marketing typography.",
    color: "#004b91",
    accentColor: "#00a8ff",
    stats: [
      { label: "Client Style", value: "Cadbury Oreo" },
      { label: "Medium", value: "CGI Compositing" },
      { label: "Campaign", value: "Limited Edition" },
    ],
  },
  {
    id: "project-04",
    number: "04",
    title: "Phoenix Pulse: Flyer",
    subtitle: "Heat of the Beat Commercial Render",
    category: "Product Visualization",
    type: "image",
    src: "https://res.cloudinary.com/o46echks/image/upload/v1793205568/image-2.jpg",
    year: "2024",
    tools: [ "Photoshop"],
    description:
      "Striking product showcase of the crimson and gold Phoenix Pulse wireless headphones, combining sleek metallic reflections with distressed grunge display lettering.",
    color: "#4a0e17",
    accentColor: "#DB4726",
    stats: [
      { label: "Material", value: "Anodized Gold & Leather" },
      { label: "Type", value: "Product Key Visual" },
      { label: "Format", value: "Poster Campaign" },
    ],
  },
  {
    id: "project-05",
    number: "05",
    title: "Phoenix Pulse: Brochure",
    subtitle: "Multi-page Identity System & Marketing Layout",
    category: "Product Visualization",
    type: "image",
    src: "https://res.cloudinary.com/o46echks/image/upload/v1793205568/image-1.jpg",
    year: "2024",
    tools: [ "Photoshop"],
    description:
      "A comprehensive brand brochure demonstrating color harmony, grid-based specifications, product catalog spreads, and promotional marketing collateral.",
    color: "#2b2d42",
    accentColor: "#e63946",
    stats: [
      { label: "Pages", value: "3-Spread Catalog" },
      { label: "Grid", value: "Swiss Modular" },
      { label: "Deliverable", value: "Print & Digital Spec" },
    ],
  },
  {
    id: "project-06",
    number: "06",
    title: "Weekly Jump: Magazine Design",
    subtitle: "Handcrafted Manga Cover & Wrap Design",
    category: "Manga & Editorial Illustration",
    type: "image",
    src: "https://res.cloudinary.com/o46echks/image/upload/v1793205568/image-3.jpg",
    year: "2023",
    tools: [ "Photoshop"],
    description:
      "Print production wrap cover paying homage to Shonen Jump and the Bleach universe, capturing intense character expressions and authentic publishing aesthetics.",
    color: "#8B0000",
    accentColor: "#FF4500",
    stats: [
      { label: "Format", value: "Tankobon Wrap" },
      { label: "Art Style", value: "Ink & Screentone" },
      { label: "Medium", value: "Digital Painting" },
    ],
  },
  {
    id: "project-07",
    number: "07",
    title: "Rolex Mood Board",
    subtitle: "Luxury Horology Mood Board & Identity",
    category: "Visual Direction & Luxury",
    type: "image",
    src: "https://res.cloudinary.com/o46echks/image/upload/v1793205570/image-5.jpg",
    year: "2023",
    tools: [ "Photoshop"],
    description:
      "Curated visual identity moodboard exploring luxury emerald and champagne tones, watch movement textures, typography pairings, and timeless brand motifs.",
    color: "#044731",
    accentColor: "#c0943b",
    stats: [
      { label: "Palette", value: "British Racing Green & Gold" },
      { label: "Typography", value: "Playfair & Baskerville" },
      { label: "Discipline", value: "Creative Direction" },
    ],
  },
];
