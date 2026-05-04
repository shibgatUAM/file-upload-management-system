import { Link } from '@inertiajs/react';
import CompanyLogo from '../components/CompanyLogo';

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
            <div className="relative flex min-h-screen flex-col">
                {/* Nav */}
                <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md md:px-12">
                    <CompanyLogo />
                    <Link className="flex items-center gap-2 rounded-lg border bg-(--brand-strong) px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-(--brand) hover:text-(--brand-strong) hover:shadow-sm md:px-5 md:py-2 md:text-sm">
                        Admin Login
                    </Link>
                </nav>

                {/* Hero */}
                <header className="bg-slate-50/50 px-6 pt-16 pb-12 text-center">
                    <span className="mb-6 inline-block rounded-full border border-(--brand) bg-(--brand)/20 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-(--brand-strong) uppercase">
                        Secure Submission
                    </span>
                    <h1 className="mb-4 text-4xl leading-tight font-extrabold text-slate-900 md:text-5xl">
                        Upload Documents,
                        <br />
                        <span className="text-(--brand)">
                            Get Your Quotation
                        </span>
                    </h1>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500">
                        Submit your files securely in seconds. Our team will
                        review and provide a tailored quote.
                    </p>
                </header>
            </div>
        </div>
    );
}
