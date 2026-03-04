import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
//import { Helmet } from 'react-helmet-async'; // Add this import
import { toast } from "sonner";
// import { website, BASE_URL } from "../Config/SeoConfig";
//import "../assets/global.css";
import { Breadcrumbs } from "../common/Breadcrumbs";
import CommentSection from "./CommentSection";
import { ArrowLeft } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Secure Password Generator",
    type: "Tool",
    description:
      "Create strong and secure passwords instantly with customizable length, symbols, numbers, and uppercase options.",
    date: "Mar 01, 2026",
    category: "Generators",
    featured: true,
    content: `
      <h2>Why Strong Passwords Matter</h2>
      <p>Weak passwords are the biggest cause of online security breaches. This tool helps you generate highly secure and unpredictable passwords instantly.</p>
      <h2>Features</h2>
      <ul>
        <li>Custom length selection</li>
        <li>Symbols & numbers toggle</li>
        <li>Uppercase & lowercase control</li>
        <li>One-click copy</li>
      </ul>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [
      { name: "Security", _id: "t1", slug: "security" },
      { name: "Password", _id: "t2", slug: "password-generator" },
    ],
    typeDetails: [{ name: "Generator" }],
    featuredImage:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7",
    lastUpdated: "2026-03-01",
    location: { name: "Global" },
    averageRating: 4.6,
  },

  {
    id: 2,
    title: "Image to PNG Converter",
    type: "Tool",
    description:
      "Convert JPG, WEBP, and other image formats to high-quality PNG in seconds.",
    date: "Feb 26, 2026",
    category: "Image Tools",
    featured: false,
    content: `
      <h2>High Quality Conversion</h2>
      <p>Convert images to PNG format without losing clarity or resolution.</p>
      <ul>
        <li>Supports JPG, WEBP & more</li>
        <li>Fast processing</li>
        <li>No watermark</li>
      </ul>
    `,
    readTime: 4,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [
      { name: "PNG", _id: "t3", slug: "png-converter" },
      { name: "Images", _id: "t4", slug: "image-tools" },
    ],
    typeDetails: [{ name: "Converter" }],
    featuredImage:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    lastUpdated: "2026-02-26",
    location: { name: "Global" },
    averageRating: 4.5,
  },

  {
    id: 3,
    title: "JSON Formatter & Validator",
    type: "Tool",
    description:
      "Format, beautify, and validate JSON data instantly.",
    date: "Feb 22, 2026",
    category: "Dev Tools",
    featured: false,
    content: `
      <h2>Developer Friendly</h2>
      <p>Instantly format messy JSON and validate errors with clear output.</p>
      <ul>
        <li>Beautify JSON</li>
        <li>Minify JSON</li>
        <li>Error detection</li>
      </ul>
    `,
    readTime: 4,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [
      { name: "JSON", _id: "t5", slug: "json-formatter" },
      { name: "Developer", _id: "t6", slug: "dev-tools" },
    ],
    typeDetails: [{ name: "Formatter" }],
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    lastUpdated: "2026-02-22",
    location: { name: "Global" },
    averageRating: 4.7,
  },

  {
    id: 4,
    title: "Text Case Converter",
    type: "Tool",
    description:
      "Convert text to uppercase, lowercase, title case, and more.",
    date: "Feb 20, 2026",
    category: "Text Tools",
    featured: false,
    content: `
      <h2>Transform Text Easily</h2>
      <p>Switch between different text cases instantly.</p>
      <ul>
        <li>UPPERCASE</li>
        <li>lowercase</li>
        <li>Title Case</li>
        <li>Sentence case</li>
      </ul>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Text", _id: "t7", slug: "text-tools" }],
    typeDetails: [{ name: "Converter" }],
    featuredImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    lastUpdated: "2026-02-20",
    location: { name: "Global" },
    averageRating: 4.4,
  },

  {
    id: 5,
    title: "Unit Converter",
    type: "Tool",
    description:
      "Convert various measurement units quickly and accurately.",
    date: "Feb 18, 2026",
    category: "Converters",
    featured: false,
    content: `
      <h2>Multiple Unit Categories</h2>
      <ul>
        <li>Length</li>
        <li>Weight</li>
        <li>Temperature</li>
        <li>Speed</li>
      </ul>
    `,
    readTime: 4,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Units", _id: "t8", slug: "unit-converter" }],
    typeDetails: [{ name: "Converter" }],
    featuredImage:
      "https://images.unsplash.com/photo-1581090700227-1e8fef6e8c63",
    lastUpdated: "2026-02-18",
    location: { name: "Global" },
    averageRating: 4.5,
  },

  {
    id: 6,
    title: "Base64 Encoder & Decoder",
    type: "Tool",
    description:
      "Encode and decode Base64 strings instantly.",
    date: "Feb 15, 2026",
    category: "Dev Tools",
    featured: false,
    content: `
      <h2>Encode & Decode Easily</h2>
      <p>Convert text to Base64 or decode Base64 back to readable format.</p>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Base64", _id: "t9", slug: "base64-tool" }],
    typeDetails: [{ name: "Encoder/Decoder" }],
    featuredImage:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    lastUpdated: "2026-02-15",
    location: { name: "Global" },
    averageRating: 4.6,
  },

  {
    id: 7,
    title: "Image Compressor",
    type: "Tool",
    description:
      "Reduce image file size without compromising quality.",
    date: "Feb 12, 2026",
    category: "Image Tools",
    featured: false,
    content: `
      <h2>Optimize Images</h2>
      <p>Compress images for faster website loading and better performance.</p>
    `,
    readTime: 4,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Compression", _id: "t10", slug: "image-compressor" }],
    typeDetails: [{ name: "Optimizer" }],
    featuredImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    lastUpdated: "2026-02-12",
    location: { name: "Global" },
    averageRating: 4.5,
  },

  {
    id: 8,
    title: "QR Code Generator",
    type: "Tool",
    description:
      "Generate custom QR codes instantly.",
    date: "Feb 10, 2026",
    category: "Generators",
    featured: false,
    content: `
      <h2>Create QR Codes</h2>
      <p>Generate QR codes for URLs, text, contact details, and more.</p>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "QR Code", _id: "t11", slug: "qr-generator" }],
    typeDetails: [{ name: "Generator" }],
    featuredImage:
      "https://images.unsplash.com/photo-1595079676339-1534801ad6cf",
    lastUpdated: "2026-02-10",
    location: { name: "Global" },
    averageRating: 4.4,
  },

  {
    id: 9,
    title: "Word Counter Tool",
    type: "Tool",
    description:
      "Count words, characters, sentences, and paragraphs in real-time.",
    date: "Feb 08, 2026",
    category: "Text Tools",
    featured: false,
    content: `
      <h2>Real-Time Word Counting</h2>
      <p>Instantly see word count, character count, and readability metrics.</p>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Word Count", _id: "t12", slug: "word-counter" }],
    typeDetails: [{ name: "Counter" }],
    featuredImage:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
    lastUpdated: "2026-02-08",
    location: { name: "Global" },
    averageRating: 4.5,
  },

  {
    id: 10,
    title: "Color Picker & HEX Generator",
    type: "Tool",
    description:
      "Pick colors visually and generate HEX, RGB, and HSL codes.",
    date: "Feb 05, 2026",
    category: "Dev Tools",
    featured: false,
    content: `
      <h2>Choose Perfect Colors</h2>
      <p>Select colors and instantly copy HEX, RGB, and HSL values.</p>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Colors", _id: "t13", slug: "color-picker" }],
    typeDetails: [{ name: "Generator" }],
    featuredImage:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    lastUpdated: "2026-02-05",
    location: { name: "Global" },
    averageRating: 4.6,
  },

  {
    id: 11,
    title: "Percentage Calculator",
    type: "Tool",
    description:
      "Quickly calculate percentages and discounts.",
    date: "Feb 03, 2026",
    category: "Converters",
    featured: false,
    content: `
      <h2>Accurate Calculations</h2>
      <p>Calculate percentage increase, decrease, and discounts instantly.</p>
    `,
    readTime: 2,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Calculator", _id: "t14", slug: "percentage-calculator" }],
    typeDetails: [{ name: "Calculator" }],
    featuredImage:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
    lastUpdated: "2026-02-03",
    location: { name: "Global" },
    averageRating: 4.3,
  },

  {
    id: 12,
    title: "New Tools Added This Month",
    type: "Update",
    description:
      "Explore the latest tools added to ToolNest.",
    date: "Feb 01, 2026",
    category: "Newly Added",
    featured: false,
    content: `
      <h2>Latest Additions</h2>
      <p>This month we introduced multiple productivity and developer tools to enhance your workflow.</p>
    `,
    readTime: 3,
    user: [{ name: "ToolNest Team", _id: "1" }],
    tagDetails: [{ name: "Updates", _id: "t15", slug: "new-tools" }],
    typeDetails: [{ name: "News" }],
    featuredImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    lastUpdated: "2026-02-01",
    location: { name: "Global" },
    averageRating: 4.2,
  },
];


const forbiddenProps = ["color", "font-size"];
DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "style") {
    const styles = data.attrValue.split(";").map((s) => s.trim());
    const filtered = styles.filter(
      (rule) =>
        !forbiddenProps.some((prop) =>
          rule.toLowerCase().startsWith(prop)
        )
    );
    data.attrValue = filtered.join("; ");
  }
});
const emojiList = ["👎", "😟", "😐", "😊", "❤️"];
const CustomEmojiRating = ({
  value = 0,
  onClick,
  edit = true,
}) => {
  const [temporaryValue, setTemporaryValue] = useState(value);
  const handleMouseEnter = (index) => {
    if (!edit) return;
    setTemporaryValue(index + 1);
  };
  const handleMouseLeave = () => {
    if (!edit) return;
    setTemporaryValue(value);
  };
  const handleClick = (index) => {
    if (edit && onClick) {
      onClick(index + 1);
    }
  };
  const displayValue = edit ? temporaryValue : value;
  return (
    <div style={{ display: 'inline-flex' }}>
      {emojiList.map((emoji, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label={`Rate ${index + 1}`}
          tabIndex={edit ? 0 : -1}
          onKeyDown={(e) => {
            if (edit && (e.key === "Enter" || e.key === " ")) {
              handleClick(index);
            }
          }}
          style={{
            cursor: edit ? 'pointer' : 'default',
            fontSize: 14,
            marginRight: 6,
            transform: displayValue === index + 1 ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.2s ease',
            opacity: displayValue >= index + 1 ? 1 : 0.5,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};
const ContentDescription = () => {
  const { slug } = useParams();
  const activeBlog = blogs.find(
    (b) => b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  ) || blogs[0];

  const navigate = useNavigate();
  const [rating, setRating] = useState(activeBlog.averageRating || 0);
  const [averageRating, setAverageRating] = useState(activeBlog.averageRating || null);
  const [readingTime, setReadingTime] = useState(activeBlog.readTime || 1);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("userDocRatings") || "{}");
    const storedRating = storedRatings[activeBlog.id]?.rating;
    if (storedRating) setRating(Number(storedRating));
  }, [activeBlog.id]);

  // Helper functions for SEO
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return `${BASE_URL}/default-og-image.jpg`;
    if (imageUrl.startsWith('https')) return imageUrl;
    return `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };
  const getCurrentUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : `${BASE_URL}/docs/${activeSlug}`;
  };

  const getUserIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return null;
    }
  };
  // Handle user rating submission
  const handleRatingSubmit = (ratingValue) => {
    const storedRatings = JSON.parse(localStorage.getItem("userDocRatings") || "{}");
    storedRatings[activeBlog.id] = { rating: ratingValue };
    localStorage.setItem("userDocRatings", JSON.stringify(storedRatings));
    setRating(ratingValue);
    setAverageRating(Math.round((averageRating + ratingValue) / 2));
    toast.success("Thanks for your rating!");
  };

  const sanitizedContent = DOMPurify.sanitize(activeBlog.content);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-8 min-h-screen">
        {/* Left Column */}
        <div className="flex flex-col items-end w-full lg:w-80 shrink-0 py-5">
          {/* Info Card */}
          <div className="lg:sticky top-[4rem] w-full p-4 pr-0 pt-0 text-end text-[13px] space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 bg-white inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <span className="text-gray-500">By </span>
              <span className="text-primary font-medium">{activeBlog.user[0]?.name || "Anonymous"}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Type:</span>{" "}
              <a
                href={`/
                  "blog"
                  }`}
                className="text-primary"
              >
                {"Blog"}
              </a>
            </div>
            <div className="text-gray-500">
              Published:{" "}
              <span className="text-gray-800 font-medium">{new Date(activeBlog.date).toLocaleDateString()}</span>
            </div>
            <div className="text-gray-500">
              Updated:{" "}
              <span className="text-gray-800 font-medium">{new Date(activeBlog.date).toLocaleDateString()}</span>
            </div>

            {/* Reading Time Estimate */}
            <div className="text-gray-500">
              Reading Time Estimate:
              <span className="text-gray-800 font-medium">{readingTime} min read</span>
            </div>


            <div className="text-gray-500">Location: <span className="text-gray-800 font-medium">{activeBlog.location?.name || "-"}</span></div>


            <div className="flex flex-wrap justify-end gap-2 mt-2">
            {activeBlog.tagDetails.map((tag) => (
              <a
                key={tag._id}
                href={`/tag/${tag.slug}`}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition"
              >
                {tag.name}
              </a>
            ))}
          </div>
            <div className="flex justify-end items-center">
              <span className="text-gray-500 font-medium mr-2">
                Your Rating:
              </span>
              <CustomEmojiRating
                value={Number(rating) || 0}
                onClick={handleRatingSubmit}
                edit={true}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="mb-2 text-md text-default">Average Rating:</span>
              <span className="text-size text-dark-custom fw-medium text-gray-600">{averageRating}</span>
            </div>
            <div className="mt-8 text-default">
              <p className="mb-2 text-md">Share it with your friends</p>
              <div className="flex justify-end items-end gap-4 text-gray-600">
                <a
                  href={""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition"
                  aria-label="Share on Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 5.01 3.66 9.16 8.44 9.93v-7.03h-2.54v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7.03C18.34 21.23 22 17.08 22 12.07z" />
                  </svg>
                </a>
                <a
                  href={""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition"
                  aria-label="Share on LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.75 2.24 5 5 5h14c2.75 0 5-2.25 5-5v-14c0-2.76-2.25-5-5-5zm-11.5 19h-3v-9h3v9zm-1.5-10.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.75 1.75-1.75s1.75.78 1.75 1.75c0 .97-.78 1.76-1.75 1.76zm13 10.27h-3v-4.98c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.61v5.07h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.59 1.99 3.59 4.58v4.75z" />
                  </svg>
                </a>
                <a
                  href={""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition"
                  aria-label="Share on Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5.5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a
                  href={""}
                  className="hover:text-gray-900 transition"
                  aria-label="Share via Email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col px-2 pt-6">
          <Breadcrumbs />
          <div className="prose prose-base text-default reset-prose break-words max-w-[45rem]">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>

          <div className="mt-6 border-t pt-6 w-3/4">
            <CommentSection docId={activeBlog.id} />
          </div>
        </div>
      </div>
    </>
  );
};
export default ContentDescription;