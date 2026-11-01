export interface Artwork {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  tags: string[];
  location: string;
  span?: string;
}

// Cloudinary CDN Base URL fallback
const CLOUDINARY_BASE =
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ||
  "https://res.cloudinary.com/o46echks/image/upload";

export const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Chainsaw Devil",
    desc: "Traditional Acrylic & Ink exploration capturing raw energy and brutal transformation lines.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_1_URL ||
      `${CLOUDINARY_BASE}/v1793271981/art1.jpg`,
    likes: 9311,
    commentsCount: 987,
    timeAgo: "5 DAYS AGO",
    tags: ["chainsawman", "denji", "traditionalart", "inkdrawing", "acrylic", "animeart"],
    location: "Traditional Studio • Acrylic & Ink",
  },
  {
    id: 2,
    title: "Melancholy",
    desc: "Graphite & charcoal tonal value study focusing on subtle facial shadows and delicate hair strands.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_2_URL ||
      `${CLOUDINARY_BASE}/v1793271982/art2.jpg`,
    likes: 6420,
    commentsCount: 412,
    timeAgo: "1 WEEK AGO",
    tags: ["graphite", "charcoal", "portraitstudy", "mangaart", "sketchbook"],
    location: "Graphite Study • Sketchbook",
  },
  {
    id: 3,
    title: "Windborne",
    desc: "Ink and mechanical pencil character gesture capturing intense motion and expressive linework.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_3_URL ||
      `${CLOUDINARY_BASE}/v1793271982/art3.jpg`,
    likes: 4890,
    commentsCount: 285,
    timeAgo: "2 WEEKS AGO",
    tags: ["gesturedrawing", "characterdesign", "inksketch", "illustration"],
    location: "Ink & Pencil Sketch",
  },
  {
    id: 4,
    title: "Cyan Gaze",
    desc: "Mixed media piece blending deep indigo pigment with alcohol markers and crisp Micron pens.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_4_URL ||
      `${CLOUDINARY_BASE}/v1793271987/art4.jpg`,
    likes: 7150,
    commentsCount: 520,
    timeAgo: "3 WEEKS AGO",
    tags: ["mixedmedia", "markerdrawing", "stylizedrealism", "bluepalette"],
    location: "Mixed Media • Marker & Ink",
  },
  {
    id: 5,
    title: "Ichigo Hollow",
    desc: "Bleach homage capturing hollow mask fragmentation with intense saturated ink washes.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_5_URL ||
      `${CLOUDINARY_BASE}/v1793271983/art5.jpg`,
    likes: 8740,
    commentsCount: 643,
    timeAgo: "1 MONTH AGO",
    tags: ["bleach", "ichigokurosaki", "hollowfication", "markerart", "shonen"],
    location: "Vibrant Marker & Ink",
  },
  {
    id: 6,
    title: "Planar Contours",
    desc: "Geometric head construction and Reilly method facial rhythm lines in 2B graphite.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_6_URL ||
      `${CLOUDINARY_BASE}/v1793271983/art6.jpg`,
    likes: 3820,
    commentsCount: 194,
    timeAgo: "1 MONTH AGO",
    tags: ["anatomystudy", "headconstruction", "academicdrawing", "graphite"],
    location: "Academic Study • Graphite",
  },
  {
    id: 7,
    title: "Ghost of Sparta",
    desc: "Kratos portrait rendering brooding anger through heavy cross-hatching and ink wash textures.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_7_URL ||
      `${CLOUDINARY_BASE}/v1793271982/art7.jpg`,
    likes: 5690,
    commentsCount: 376,
    timeAgo: "2 MONTHS AGO",
    tags: ["godofwar", "kratos", "fanart", "crosshatching", "inkwash"],
    location: "Pencil & Ink Wash",
  },
  {
    id: 8,
    title: "After School",
    desc: "Nostalgic classroom study rendered with delicate mechanical pencils and soft shading blenders.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_8_URL ||
      `${CLOUDINARY_BASE}/v1793271984/art8.jpg`,
    likes: 7410,
    commentsCount: 488,
    timeAgo: "2 MONTHS AGO",
    tags: ["animeaesthetic", "sliceoflife", "pencildrawing", "composition"],
    location: "Pencil Anime Study",
  },
  {
    id: 9,
    title: "Jinx Expression Study",
    desc: "Trio of emotional expressions capturing manic intensity, vulnerability, and defiance from Arcane.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_9_URL ||
      `${CLOUDINARY_BASE}/v1793272047/WhatsApp_Image_2026-10-29_at_14.41.37.jpg`,
    likes: 8920,
    commentsCount: 754,
    timeAgo: "3 DAYS AGO",
    tags: ["arcane", "jinx", "leagueoflegends", "pencildrawing", "expressions", "sketchbook"],
    location: "Graphite & Pencil • Expression Sheet",
  },
  {
    id: 10,
    title: "Hollowfied Bankai",
    desc: "High-contrast dynamic ink rendering of Ichigo's Horn of Salvation form with piercing gold iris.",
    url:
      process.env.NEXT_PUBLIC_ARTWORK_10_URL ||
      `${CLOUDINARY_BASE}/v1793272046/WhatsApp_Image_2026-10-29_at_14.44.09.jpg`,
    likes: 10420,
    commentsCount: 1120,
    timeAgo: "YESTERDAY",
    tags: ["bleach", "ichigo", "hornofsalvation", "inkart", "mangaart", "thousandyearbloodwar"],
    location: "High-Contrast Ink • Studio",
  },
];
