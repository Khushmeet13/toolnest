// src/data/allTools.js
import generators from "./generatorTools";
import converters from "./converterTools";
import imageTools from "./imageTools";

const toSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const allTools = [
  ...generators.map((t) => ({
    ...t,
    section: "Generators",
    path: `/generators/${toSlug(t.title)}`,
  })),
  ...converters.map((t) => ({
    ...t,
    section: "Converters",
    path: `/converters/${toSlug(t.title)}`,
  })),
  ...imageTools.map((t) => ({
    ...t,
    section: "Image Tools",
    path: `/image-tools/${toSlug(t.title)}`,
  })),
];

export default allTools;