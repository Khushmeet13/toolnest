import {
    QrCode,
    FileText,
    Image,
    Code,
    Lock,
    Zap,
} from "lucide-react";
import qr_back from "../../assets/img/qr-img.jpg";
import form_back from "../../assets/img/form-builder.webp";
import img_convert from "../../assets/img/img-converter.png";
import json_back from "../../assets/img/json-convert.jpg";
import password_back from "../../assets/img/password-gen.jpg";

function ToolCard({ Icon, name, image }) {
    return (
        <div
            className="relative aspect-[2/3] w-full rounded-xl shadow-lg 
                       flex flex-col items-center justify-center gap-3 
                       bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="absolute inset-0 bg-black/60 rounded-xl" />

            <Icon size={36} className="text-white z-10" />
            <p className="font-bold text-white text-center px-2 z-10">
                {name}
            </p>
        </div>
    );
}

export default function HeroSection() {
    return (

        <main>
            <div className="relative isolate">
                <svg
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 -z-10 h-256 w-full mask-[radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-200"
                >
                    <defs>
                        <pattern
                            x="50%"
                            y={-1}
                            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                            width={200}
                            height={200}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
                </svg>
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                        }}
                        className="aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    />
                </div>
                <div className="overflow-hidden">
                    <div className="mx-auto max-w-7xl py-10">
                        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                            <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                                    One Platform.
                                    <span className="block text-cyan-600">
                                        Endless Useful Tools
                                    </span>
                                </h1>

                                <p className="mt-8 text-lg text-gray-500">
                                    Stop searching across multiple websites. Access hundreds of
                                    powerful tools for work, study, and development  in one unified platform — fast, reliable, and easy to use.
                                    Everything you need, available instantly and completely free.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <a
                                        href="#tools"
                                        className="rounded-md bg-cyan-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-cyan-600/80"
                                    >
                                        Explore All Tools
                                    </a>

                                    <a
                                        href="#categories"
                                        className="text-sm font-medium text-cyan-600 border px-5 py-2 rounded-md"
                                    >
                                        Browse Categories →
                                    </a>
                                </div>
                            </div>
                            <div className="mt-14 flex justify-end gap-12 lg:mt-0">

                                {/* Column 1 */}
                                <div className="w-44 flex-none space-y-8 pt-52">
                                    <ToolCard Icon={QrCode} name="QR Generator" image={qr_back} />
                                </div>

                                {/* Column 2 */}
                                <div className="w-44 flex-none space-y-8 pt-25">
                                    <ToolCard Icon={FileText} name="Form Builder" image={form_back} />
                                    <ToolCard Icon={Image} name="Image Converter" image={img_convert} />
                                </div>

                                {/* Column 3 */}
                                <div className="w-44 flex-none space-y-8">
                                    <ToolCard Icon={Code} name="JSON Formatter" image={json_back} />
                                    <ToolCard Icon={Lock} name="Password Generator" image={password_back} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}