import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function About() {
    return (
        <GuestLayout>
            <Head title="About" />
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Text Section */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-3xl font-bold mb-4">
                                About <span className="text-blue-600">Filipino Profanity API</span>
                            </h2>

                            <p className="mb-4">
                                The <strong>Filipino Profanity API</strong> is built to help developers create
                                safer and more inclusive online spaces. We know that many apps, forums, and
                                communities allow users to post freely — but this can also open the door to
                                offensive or harmful language.
                            </p>

                            <p className="mb-4">
                                Our API provides an easy way to{" "}
                                <span className="text-blue-600 font-semibold">detect and filter Filipino bad words</span>{" "}
                                in text. It doesn’t just stop at common profanity — it also supports{" "}
                                <strong>regional slang and variations</strong> across the Philippines, making it
                                more accurate than generic filters.
                            </p>

                            <p className="mb-4">
                                Whether you're building a <em>social media app, community forum,
                                or messaging platform</em>, our goal is to give you a tool that helps keep
                                conversations <strong>respectful, clean, and safe</strong>.
                            </p>

                            <ul className="list-style-none pl-6 space-y-2 mt-4">
                                <li className="list">✅ Detects common Filipino bad words</li>
                                <li>✅ Supports regional profanity and slang</li>
                                <li>✅ Simple API integration for developers</li>
                                <li>✅ Helps maintain a positive community environment</li>
                            </ul>

                            <div className="text-center text-red-600 mt-6">
                                disclaimer: “This API is for developers to filter offensive content. Not
                                intended for promoting profanity.”
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="max-h-80 max-w-xs object-contain"
                        />
                        <span className="text-lg font-semibold mt-2">
                            Filipino Profanity API
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 text-center py-4 mt-10 flex justify-center items-center gap-2">
                <span>Contact the developer:</span>
                <a
                    href="mailto:jobelgolde45@gmail.com"
                    className="text-blue-600 hover:underline"
                >
                    jobelgolde45@gmail.com
                </a>
            </footer>
        </GuestLayout>
    );
}
