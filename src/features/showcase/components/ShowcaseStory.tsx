import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ShowcaseStoryProps {
    title: string;
    description: string;
    imageUrl: string;
    imagePosition?: 'left' | 'right';
    isFullWidth?: boolean;
}

export function ShowcaseStory({
    title,
    description,
    imageUrl,
    imagePosition = 'left',
    isFullWidth = false
}: ShowcaseStoryProps) {
    if (isFullWidth) {
        return (
            <div className="w-full py-24 bg-white">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 tracking-tight">{title}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-32 bg-white">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className={cn(
                    "flex flex-col gap-12 lg:gap-24 items-center",
                    imagePosition === 'right' ? "lg:flex-row-reverse" : "lg:flex-row"
                )}>
                    <div className="flex-1 w-full">
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 w-full text-center lg:text-left">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-8 tracking-tight leading-tight">
                                {title}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
