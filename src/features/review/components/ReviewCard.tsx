import Image from 'next/image';

interface Review {
    id: string;
    imageUrl: string;
    userName: string;
    rating: number;
    content: string;
    productName: string;
    productBrand: string;
    productImage: string;
    date: string;
}

interface ReviewCardProps {
    review: Review;
    onClick: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
    return (
        <div
            className="relative aspect-square cursor-pointer group bg-secondary overflow-hidden"
            onClick={onClick}
        >
            <Image
                src={review.imageUrl}
                alt={`Review by ${review.userName}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium truncate">
                    {review.productName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-white text-xs opacity-80">{review.userName}</span>
                </div>
            </div>
        </div>
    );
}
