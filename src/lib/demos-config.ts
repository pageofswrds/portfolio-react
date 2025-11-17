export const demosConfig = {
  markdown: {
    title: "Markdown Converter",
    subtitle: "Experimenting with AI image processing",
    year: "2025",
    thumbnail:
      "https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/markdown/markdown-cover-temp.jpg",
    order: null,
    visible: false,
  },
  "marking-menu": {
    title: "Marking Menu",
    subtitle: "Interactive radial menu demonstration",
    year: "2025",
    thumbnail:
      "https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/marking-menu/marking-menu-cover.jpg",
    order: 2,
    visible: true,
  },
  // 'portals': {
  //   title: 'Thinking with Portals',
  //   subtitle: 'Experimenting with Three.js physics',
  //   year: '2024',
  //   thumbnail: "https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/portals/portals-cover.jpg",
  //   order: null,
  //   visible: true,
  // },
  arboretum: {
    title: "Arboretum Explorer",
    subtitle: "Experimenting with d3.js",
    year: "2023",
    thumbnail:
      "https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/arboretum/arb-demo-cover.jpg",
    order: 1,
    visible: true,
  },
};

export type DemoMetadata = {
  title: string;
  subtitle: string;
  year: string;
  thumbnail: string;
  order: number | null;
  visible: boolean;
};
