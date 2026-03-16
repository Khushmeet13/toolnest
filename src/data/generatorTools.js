import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CircleStackIcon,
  KeyIcon,
  FingerPrintIcon,
  CreditCardIcon,
  QrCodeIcon,
  Bars3Icon,
  SwatchIcon,
  PaintBrushIcon,
  UserIcon,
  HashtagIcon,
  ReceiptPercentIcon,
  BuildingOfficeIcon,
  FaceSmileIcon,
  GlobeAltIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  SunIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Smile } from "lucide-react";

const generators = [
  // TEXT
  {
    id: 1,
    title: "AI Text Generator",
    description: "Generate high-quality AI content instantly.",
    category: "Text",
    icon: SparklesIcon,
  },
  {
    id: 2,
    title: "Instagram Caption Generator",
    description: "Create catchy captions for your social media posts.",
    category: "Text",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    id: 3,
    title: "Email Template Generator",
    description: "Generate professional email templates in seconds.",
    category: "Text",
    icon: EnvelopeIcon,
  },
  {
    id: 4,
    title: "Resume Summary Generator",
    description: "Create compelling resume summaries effortlessly.",
    category: "Text",
    icon: DocumentTextIcon,
  },
  {
    id: 5,
    title: "Fake Data Generator",
    description: "Generate dummy data for testing and development.",
    category: "Text",
    icon: CircleStackIcon,
  },

  // SECURITY
  {
    id: 6,
    title: "Password Generator",
    description: "Generate strong and secure passwords instantly.",
    category: "Security",
    icon: KeyIcon,
  },
  {
    id: 7,
    title: "UUID Generator",
    description: "Create universally unique identifiers quickly.",
    category: "Security",
    icon: FingerPrintIcon,
  },
  {
    id: 8,
    title: "Fake Credit Card Generator",
    description: "Generate test credit card numbers for development use.",
    category: "Security",
    icon: CreditCardIcon,
  },
  {
    id: 9,
    title: "QR Code Generator",
    description: "Create custom QR codes for links and text.",
    category: "Security",
    icon: QrCodeIcon,
  },
  {
    id: 10,
    title: "Barcode Generator",
    description: "Generate barcodes for products and inventory.",
    category: "Security",
    icon: Bars3Icon,
  },

  // DESIGN
  {
    id: 11,
    title: "Color Palette Generator",
    description: "Generate beautiful color combinations for design.",
    category: "Design",
    icon: SwatchIcon,
  },
  {
    id: 12,
    title: "Gradient Generator",
    description: "Create modern CSS gradients easily.",
    category: "Design",
    icon: PaintBrushIcon,
  },
  {
    id: 13,
    title: "Color Code Generator",
    description: "Generate random HEX, RGB, and HSL color codes for your design projects.",
    category: "Design",
    icon: CircleStackIcon,
  },
  {
    id: 14,
    title: "Color Shades Generator",
    description: "Generate lighter and darker shades of any color instantly.",
    category: "Design",
    icon: SunIcon,
  },
  {
    id: 15,
    title: "Skeleton Loader Generator",
    description: "Create customizable skeleton loading placeholders for modern UI and web applications.",
    category: "Design",
    icon: Squares2X2Icon,
  },

  // RANDOM
  {
    id: 16,
    title: "Random Name Generator",
    description: "Generate random names for projects or characters.",
    category: "Random",
    icon: UserIcon,
  },
  {
    id: 17,
    title: "Random Number Generator",
    description: "Generate random numbers instantly.",
    category: "Random",
    icon: HashtagIcon,
  },

  // // BUSINESS
  {
    id: 18,
    title: "Invoice Generator",
    description: "Create professional invoices for your business.",
    category: "Business",
    icon: ReceiptPercentIcon,
  },
  {
    id: 19,
    title: "Domain Name Generator",
    description: "Generate unique and available domain name ideas for your website or startup.",
    category: "Business",
    icon: GlobeAltIcon,
  },
  {
    id: 20,
    title: "Brand Name Generator",
    description: "Create catchy and memorable brand name ideas for your business or product.",
    category: "Business",
    icon: SparklesIcon,
  },
  {
    id: 21,
    title: "Marketing Strategy Generator",
    description: "Generate effective marketing strategies and growth ideas for your business.",
    category: "Business",
    icon: MegaphoneIcon,
  },
  {
    id: 22,
    title: "Pricing Strategy Generator",
    description: "Get smart pricing model suggestions to maximize profit and attract customers.",
    category: "Business",
    icon: CurrencyDollarIcon,
  },


  // // FUN
  {
    id: 23,
    title: "Meme Generator",
    description: "Create funny memes in just a few clicks.",
    category: "Fun",
    icon: FaceSmileIcon,
  },
  {
    id: 24,
    title: "Emoji Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
  {
    id: 25,
    title: "Random Challenge Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
  {
    id: 26,
    title: "Poll Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
  {
    id: 27,
    title: "Truth Or Dare Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
  {
    id: 28,
    title: "Emoji Movie Guess",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
  {
    id: 29,
    title: "Dumb Charades Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
];

export default generators;