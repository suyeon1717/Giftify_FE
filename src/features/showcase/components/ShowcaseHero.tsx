import Image from 'next/image';

interface ShowcaseHeroProps {
    title: string;
    subtitle: string;
    imageUrl: string;
}

export function ShowcaseHero({ title, subtitle, imageUrl }: ShowcaseHeroProps) {
    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-black text-white">
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover opacity-70"
                priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <span className="mb-4 text-sm font-medium tracking-[0.2em] uppercase opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl break-keep animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {title}
                </h1>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-[1px] h-12 bg-white/50"></div>
            </div>
        </div>
    );
}
