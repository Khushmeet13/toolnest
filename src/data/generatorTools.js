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

  // RANDOM
  {
    id: 13,
    title: "Random Name Generator",
    description: "Generate random names for projects or characters.",
    category: "Random",
    icon: UserIcon,
  },
  {
    id: 14,
    title: "Random Number Generator",
    description: "Generate random numbers instantly.",
    category: "Random",
    icon: HashtagIcon,
  },

  // BUSINESS
  {
    id: 15,
    title: "Invoice Generator",
    description: "Create professional invoices for your business.",
    category: "Business",
    icon: ReceiptPercentIcon,
  },
  {
    id: 16,
    title: "Business Name Generator",
    description: "Find creative and unique business names.",
    category: "Business",
    icon: BuildingOfficeIcon,
  },

  // FUN
  {
    id: 17,
    title: "Meme Generator",
    description: "Create funny memes in just a few clicks.",
    category: "Fun",
    icon: FaceSmileIcon,
  },
  {
    id: 18,
    title: "Emoji Generator",
    description: "Generate fun and creative emoji combinations.",
    category: "Fun",
    icon: Smile,
  },
];

export default generators;