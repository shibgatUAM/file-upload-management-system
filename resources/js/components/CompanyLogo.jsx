import Logo from '../../../public/images/insurer.webp';

export default function CompanyLogo() {
    return (
        <div className="flex items-center gap-3.5">
            <img
                src={Logo}
                alt="Insurer Logo"
                className="h-auto w-32 object-contain md:w-48"
            />

            {/* <div className="flex flex-col">
                <span className="text-2xl leading-tight font-bold tracking-wider text-slate-900">
                    DocVault
                </span>
                <span className="font-mono text-[12px] font-semibold tracking-widest text-(--brand-strong) uppercase">
                    File Management
                </span>
            </div> */}
        </div>
    );
}
