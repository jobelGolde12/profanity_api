import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { url } = usePage();

    return (
        <div>
            <nav className="w-full bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">Free API</h1>
                    <div className="space-x-6">

                        {/* Home Link */}
                        <Link
                            href={route('home')}
                            className={`${
                                url === '/' ? 'font-bold text-gray-800' : 'font-semibold text-gray-700'
                            }`}
                        >
                            Home
                        </Link>

                        <Link
                            href={route('other-endpoint')}
                            className={`${
                                url === '/other-endpoint' ? 'font-bold text-gray-800' : 'font-semibold text-gray-700'
                            }`}
                        >
                            Other Endpoint
                        </Link>

                        {/* About Link */}
                        <Link
                            href={route('about')}
                            className={`${
                                url.startsWith('/about')
                                    ? 'font-bold text-gray-800'
                                    : 'text-gray-600'
                            }`}
                        >
                            About
                        </Link>
                    </div>
                </div>
            </nav>

            {children}
        </div>
    );
}
