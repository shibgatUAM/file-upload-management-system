import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import CompanyLogo from '../components/CompanyLogo';

export default function Home() {
    const { flash } = usePage().props;
    const [form, setForm] = useState({ customer_name: '', customer_email: '' });
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(!!flash?.success);
    const fileInputRef = useRef(null);

    const handleFiles = (selectedFiles) => {
        const newFiles = [...selectedFiles].filter((file) => {
            const allowed = [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
            ];
            return allowed.includes(file.type);
        });

        if (files.length + newFiles.length > 5) {
            setErrors((e) => ({
                ...e,
                file: 'You can upload up to 5 files at a time.',
            }));
            return;
        }

        setErrors((e) => ({ ...e, file: null }));

        const filesWithPreviews = newFiles.map((file) => ({
            file,
            id: crypto.randomUUID(),
            preview: file.type.startsWith('image/')
                ? URL.createObjectURL(file)
                : null,
            name: file.name,
        }));

        setFiles((prev) => [...prev, ...filesWithPreviews]);
    };

    const removeFile = (id) => {
        setFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id !== id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }

            return prev.filter((f) => f.id !== id);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('customer_name', form.customer_name);
        data.append('customer_email', form.customer_email);

        files.forEach((f, index) => {
            data.append(`files[${index}]`, f.file);
        });

        router.post('/upload', data, {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(true);

                files.forEach((f) => {
                    if (f.preview) URL.revokeObjectURL(f.preview);
                });

                setFiles([]);
                setForm({ customer_name: '', customer_email: '' });
                setErrors({});
            },
            onError: (errs) => setErrors(errs),
            onFinish: () => setLoading(false),
        });
    };

    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
        };
    }, []);

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

                <main className="mx-auto -mt-6 w-full max-w-135 flex-1 px-6 pb-20">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 ml-1 block text-[11px] font-bold text-slate-500 uppercase">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    className={`w-full rounded-xl border ${errors.customer_name ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-slate-900 transition-all outline-none focus:ring-4 focus:ring-blue-500/5`}
                                    placeholder="Enter your name"
                                    value={form.customer_name}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            customer_name: e.target.value,
                                        }))
                                    }
                                />

                                {errors.customer_name && (
                                    <p className="mt-1 ml-1 text-[11px] text-red-500">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 ml-1 block text-[11px] font-bold text-slate-500 uppercase">
                                    Email Address
                                </label>
                                <input
                                    className={`w-full rounded-xl border ${errors.customer_email ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-3 text-slate-900 transition-all outline-none focus:ring-4 focus:ring-blue-500/5`}
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={form.customer_email}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            customer_email: e.target.value,
                                        }))
                                    }
                                />

                                {errors.customer_email && (
                                    <p className="mt-1 ml-1 text-[11px] text-red-500">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 ml-1 block text-[11px] font-bold text-slate-500 uppercase">
                                    Upload Files (Max 5)
                                </label>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        handleFiles(e.dataTransfer.files);
                                    }}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFiles(e.target.files)
                                        }
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-(--brand) text-(--brand-strong) transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line
                                                    x1="12"
                                                    y1="3"
                                                    x2="12"
                                                    y2="15"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Drag and drop or click to select
                                        </p>
                                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            PDF, PNG, JPG (Max 20MB/File)
                                        </p>
                                    </div>
                                </div>

                                {errors.file && (
                                    <span className='className="text-red-500 mt-2 ml-1 block text-[11px]'>
                                        {errors.file}
                                    </span>
                                )}

                                <div className="mt-4 max-h-75 space-y-2 overflow-y-auto pr-1">
                                    {files.map((f) => (
                                        <div
                                            key={f.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {f.preview ? (
                                                    <img
                                                        src={f.preview}
                                                        className="h-10 w-10 rounded-lg border border-slate-100 object-cover"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
                                                        <span className="text-[9px] font-black text-red-500">
                                                            PDF
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="max-w-45 truncate text-[12px] font-semibold text-slate-700 md:max-w-60">
                                                        {f.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                        {(
                                                            f.file.size / 1024
                                                        ).toFixed(0)}{' '}
                                                        KB
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(f.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                title="Remove File"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || files.length === 0}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-(--brand-strong) py-4 font-bold text-white shadow-lg transition-all hover:bg-(--brand) hover:text-(--brand-strong) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>
                                            Processing {files.length}{' '}
                                            {files.length > 1
                                                ? 'Files'
                                                : 'File'}
                                            ...
                                        </span>
                                    </>
                                ) : (
                                    `Submit ${files.length} Document${files.length !== 1 ? 's' : ''}`
                                )}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
