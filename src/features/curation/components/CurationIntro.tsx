import Image from 'next/image';

interface CurationIntroProps {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
}

export function CurationIntro({ title, subtitle, description, imageUrl }: CurationIntroProps) {
    return (
        <div className="relative mb-16">
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-screen-xl mx-auto px-6 -mt-32 relative z-10">
                <div className="bg-white p-8 md:p-12 shadow-sm max-w-2xl">
                    <span className="block text-sm font-bold tracking-widest uppercase text-primary mb-4">
                        {subtitle}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
