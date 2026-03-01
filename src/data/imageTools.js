const imageTools = [

  // ESSENTIALS
  {
    id: 1,
    title: "Image Resizer",
    description: "Resize images to any custom dimension instantly.",
    category: "Basic",
  },
  {
    id: 2,
    title: "Image Compressor",
    description: "Reduce image file size without losing quality.",
    category: "Basic",
  },
  {
    id: 3,
    title: "Crop Image Tool",
    description: "Crop images to focus on important areas.",
    category: "Basic",
  },
  {
    id: 4,
    title: "Rotate Image",
    description: "Rotate images left, right or 180 degrees.",
    category: "Basic",
  },
  {
    id: 5,
    title: "Flip Image",
    description: "Flip images horizontally or vertically.",
    category: "Basic",
  },
  {
    id: 6,
    title: "Image Format Converter",
    description: "Convert JPG, PNG, and WebP formats easily.",
    category: "Basic",
  },
  {
    id: 7,
    title: "Image to PDF Converter",
    description: "Convert images into downloadable PDF files.",
    category: "Basic",
  },
  {
    id: 8,
    title: "PDF to Image Converter",
    description: "Extract images from PDF files instantly.",
    category: "Basic",
  },

  // EDITING
  {
    id: 9,
    title: "Image Background Remover",
    description: "Remove image backgrounds in one click.",
    category: "Editor",
  },
  {
    id: 10,
    title: "Blur Image Tool",
    description: "Apply blur effect to selected areas of images.",
    category: "Editor",
  },
  {
    id: 11,
    title: "Add Text to Image",
    description: "Overlay custom text on images easily.",
    category: "Editor",
  },
  {
    id: 12,
    title: "Add Watermark Tool",
    description: "Protect images by adding watermark text or logo.",
    category: "Editor",
  },
  {
    id: 13,
    title: "Image Color Picker",
    description: "Extract color codes from any image instantly.",
    category: "Editor",
  },
  {
    id: 14,
    title: "Brightness & Contrast Adjuster",
    description: "Adjust image brightness and contrast easily.",
    category: "Editor",
  },
  {
    id: 15,
    title: "Image Sharpener",
    description: "Enhance image sharpness and clarity.",
    category: "Editor",
  },
  {
    id: 16,
    title: "Image Filter Tool",
    description: "Apply stylish filters to your images.",
    category: "Editor",
  },

  // CONVERTERS
  {
    id: 17,
    title: "JPG to PNG Converter",
    description: "Convert JPG images into PNG format.",
    category: "Convert",
  },
  {
    id: 18,
    title: "PNG to JPG Converter",
    description: "Convert PNG images into JPG format.",
    category: "Convert",
  },
  {
    id: 19,
    title: "WebP to PNG Converter",
    description: "Convert WebP images into PNG format.",
    category: "Convert",
  },
  {
    id: 20,
    title: "PNG to WebP Converter",
    description: "Convert PNG images into WebP format.",
    category: "Convert",
  },
  {
    id: 21,
    title: "HEIC to JPG Converter",
    description: "Convert HEIC images into JPG format.",
    category: "Convert",
  },
  {
    id: 22,
    title: "SVG to PNG Converter",
    description: "Convert SVG files into PNG images.",
    category: "Convert",
  },
  {
    id: 23,
    title: "Image to Base64",
    description: "Convert image files into Base64 strings.",
    category: "Convert",
  },
  {
    id: 24,
    title: "Base64 to Image",
    description: "Convert Base64 strings back into images.",
    category: "Convert",
  },

  // AI TOOLS
  {
    id: 25,
    title: "AI Image Enhancer",
    description: "Improve image quality using AI technology.",
    category: "AI Tools",
  },
  {
    id: 26,
    title: "AI Upscaler",
    description: "Increase image resolution without losing clarity.",
    category: "AI Tools",
  },
  {
    id: 27,
    title: "AI Background Remover",
    description: "Automatically remove backgrounds with AI precision.",
    category: "AI Tools",
  },
  {
    id: 28,
    title: "AI Image to Cartoon",
    description: "Transform photos into cartoon-style images.",
    category: "AI Tools",
  },
  {
    id: 29,
    title: "AI Image to Sketch",
    description: "Convert photos into pencil sketch art.",
    category: "AI Tools",
  },
  {
    id: 30,
    title: "AI Face Enhancer",
    description: "Enhance facial details and clarity instantly.",
    category: "AI Tools",
  },
  {
    id: 31,
    title: "AI Image Colorizer",
    description: "Add color to black and white images.",
    category: "AI Tools",
  },
  {
    id: 32,
    title: "AI Object Remover",
    description: "Remove unwanted objects from images easily.",
    category: "AI Tools",
  },

  // OCR
  {
    id: 33,
    title: "Image to Text (OCR)",
    description: "Extract text from images instantly.",
    category: "OCR",
  },
  {
    id: 34,
    title: "Screenshot to Text",
    description: "Convert screenshots into editable text.",
    category: "OCR",
  },
  {
    id: 35,
    title: "Handwriting to Text Converter",
    description: "Convert handwritten notes into digital text.",
    category: "OCR",
  },

  // SOCIAL
  {
    id: 36,
    title: "YouTube Thumbnail Resizer",
    description: "Resize thumbnails for perfect YouTube fit.",
    category: "Social",
  },
  {
    id: 37,
    title: "Instagram Post Resizer",
    description: "Resize images for Instagram posts.",
    category: "Social",
  },
  {
    id: 38,
    title: "Facebook Cover Resizer",
    description: "Resize images for Facebook cover photos.",
    category: "Social",
  },
  {
    id: 39,
    title: "LinkedIn Banner Resizer",
    description: "Create perfectly sized LinkedIn banners.",
    category: "Social",
  },
  {
    id: 40,
    title: "Twitter Header Resizer",
    description: "Resize images for Twitter headers.",
    category: "Social",
  },

  // CREATIVE
  {
    id: 41,
    title: "Meme Generator",
    description: "Create funny and viral memes easily.",
    category: "Creative",
  },
  {
    id: 42,
    title: "GIF Maker",
    description: "Convert images or videos into animated GIFs.",
    category: "Creative",
  },
  {
    id: 43,
    title: "Image Collage Maker",
    description: "Combine multiple images into a collage.",
    category: "Creative",
  },
  {
    id: 44,
    title: "Photo Frame Generator",
    description: "Add stylish frames to your photos.",
    category: "Creative",
  },
  {
    id: 45,
    title: "Avatar Generator",
    description: "Create custom avatars from your photos.",
    category: "Creative",
  },
  {
    id: 46,
    title: "Emoji Sticker Creator",
    description: "Design fun emoji stickers from images.",
    category: "Creative",
  },
];

export default imageTools;