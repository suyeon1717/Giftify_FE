'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFundingParticipants } from '@/lib/api/fundings';
import { queryKeys } from '@/lib/query/keys';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ParticipantsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fundingId: string;
}

export function ParticipantsModal({ open, onOpenChange, fundingId }: ParticipantsModalProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: [...queryKeys.funding(fundingId), 'participants'],
        queryFn: () => getFundingParticipants(fundingId),
        enabled: open && !!fundingId,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>참여자 목록</DialogTitle>
                    <DialogDescription>
                        이 펀딩에 참여한 분들입니다.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : isError || !data ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                참여자 정보를 불러올 수 없습니다.
                            </p>
                        </div>
                    ) : data.items.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                아직 참여자가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.items.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={participant.member.avatarUrl || undefined} />
                                        <AvatarFallback>
                                            {participant.member.nickname[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm truncate">
                                                {participant.member.nickname}
                                            </p>
                                            {participant.isOrganizer && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary">
                                                    주최자
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(participant.participatedAt), {
                                                addSuffix: true,
                                                locale: ko,
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">
                                            ₩{participant.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
