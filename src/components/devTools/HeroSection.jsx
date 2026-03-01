'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import dev_back from "../../assets/img/dev-tool.png";

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

export default function HeroSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20  dark:from-indigo-950/10">
            <div
                aria-hidden="true"
                className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:-mr-80 lg:-mr-96 dark:bg-gray-800/30 dark:shadow-indigo-400/10 dark:ring-white/5"
            />
            <div className="mx-auto max-w-7xl py-16">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-44">
                    <h1 className="text-4xl font-meedium tracking-tight text-gray-900 dark:text-white sm:text-5xl leading-tight">
                        Developer Tools That
                        <br />
                        <span className="text-cyan-600 dark:text-cyan-400">
                            Simplify Your Workflow
                        </span>
                    </h1>
                    <div className="mt-2 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                        <div className=" max-w-xl">
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Access a complete suite of fast, reliable, and browser-based developer tools
                                designed to boost productivity.
                            </p>

                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Built for developers who value speed, privacy, and simplicity. Every tool
                                runs securely in your browser, ensuring your data stays safe while you work
                                smarter and faster.
                            </p>
                        </div>
                        <div className="mt-10 flex gap-6">
                            <a
                                href="#"
                                className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-600/80 transition"
                            >
                                Start Using Tools
                            </a>

                            <a
                                href="#"
                                className="text-sm font-medium text-cyan-600 dark:text-white border border-cyan-600 px-4 py-2.5 rounded-lg"
                            >
                                View All Tools →
                            </a>
                        </div>
                    </div>
                    <img
                        alt=""
                        src={dev_back}
                        className="mt-10 aspect-6/5 w-full max-w-lg rounded-xl object-cover outline-1 -outline-offset-1 outline-black/5 sm:mt-16 lg:mt-0 lg:max-w-lg xl:row-span-2 xl:row-end-2 dark:outline-white/10 shadow-md shadow-cyan-100 border border-cyan-600"
                    />
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32 dark:from-gray-900" />
        </div>
    )
}