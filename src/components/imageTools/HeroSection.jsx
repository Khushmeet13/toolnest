import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import profile from "../../assets/img/profile-img.png";
import image_back from "../../assets/img/image-tool.png";

const features = [
    {
        name: 'Push to deploy.',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'SSL certificates.',
        description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
        icon: LockClosedIcon,
    },
    {
        name: 'Database backups.',
        description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
        icon: ServerIcon,
    },
]

export default function HeroSection() {
    return (
        <div className="overflow-hidden bg-white pt-16 pb-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                    <div className="lg:pt-0 lg:pr-4">
                        <div className="lg:max-w-2xl">
                            <h2 className="text-sm font-medium text-cyan-600 dark:text-indigo-400 uppercase">Image Tools</h2>
                            <p className="mt-2 text-4xl font-medium tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                                Powerful Online Image Tools
                            </p>
                            <p className="mt-3 text-lg/8 text-gray-700 dark:text-gray-300">
                                Compress, resize, convert, and enhance your images with our fast,
                                secure, and AI-powered tools. Designed for creators, developers,
                                and businesses who need high-performance image processing.
                            </p>
                            <div className="mt-8">
                                <a
                                    href="#"
                                    className="inline-flex rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cyan-600/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                >
                                    Explore Tools
                                </a>
                            </div>
                            <figure className="mt-16 border-l border-gray-200 pl-8 text-gray-700 dark:border-gray-700 dark:text-gray-300">
                                <blockquote className="text-base/7">
                                    <p>
                                        “High-quality visuals shouldn’t come at the cost of speed. Our image tools
                                        are built to optimize, enhance, and convert your images instantly —
                                        without compromising clarity or security.”
                                    </p>
                                </blockquote>
                                <figcaption className="mt-6 flex gap-x-4 text-sm/6">
                                    <img
                                        alt=""
                                        src={profile}
                                        className="size-6 flex-none rounded-full"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900 dark:text-white">Khushmeet Saini</span> –{' '}
                                        <span className="text-gray-600 dark:text-gray-400">Web Developer</span>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                    <div className="sm:px-6 lg:px-0">
                        <div className="relative isolate overflow-hidden bg-cyan-600 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-xl sm:pt-4 sm:pr-0 sm:pl-4 lg:mx-0 lg:max-w-none">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-white ring-inset"
                            />
                            <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                                <img
                                    alt="Product screenshot"
                                    src={image_back}
                                    width={2432}
                                    height={1442}
                                    className="-mb-12 w-200 max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10 dark:hidden"
                                />

                            </div>
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset sm:rounded-xl dark:ring-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}