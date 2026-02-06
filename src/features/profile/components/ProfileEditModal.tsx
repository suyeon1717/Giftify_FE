'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateProfile } from '@/features/profile/hooks/useProfile';
import type { Member } from '@/types/member';

interface ProfileEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: Member;
}

function ProfileEditForm({ member, onCancel, onSuccess }: { member: Member; onCancel: () => void; onSuccess: () => void }) {
    const [nickname, setNickname] = useState(member.nickname || '');
    const updateProfile = useUpdateProfile();

    const handleSave = async () => {
        if (nickname.trim() === member.nickname) {
            onSuccess();
            return;
        }

        if (nickname.trim().length < 2) {
            return;
        }

        updateProfile.mutate(
            { nickname: nickname.trim() },
            {
                onSuccess,
            }
        );
    };

    const isChanged = nickname.trim() !== member.nickname;
    const isValid = nickname.trim().length >= 2;

    return (
        <>
            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="nickname"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        닉네임
                    </label>
                    <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력하세요"
                        maxLength={20}
                        aria-invalid={!isValid}
                    />
                    {!isValid && nickname.trim().length > 0 && (
                        <p className="text-sm text-destructive">
                            닉네임은 최소 2자 이상이어야 합니다
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        이메일
                    </label>
                    <p className="text-sm">{member.email}</p>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={updateProfile.isPending}
                >
                    취소
                </Button>
                <Button
                    onClick={handleSave}
                    className="flex-1"
                    disabled={!isChanged || !isValid || updateProfile.isPending}
                >
                    {updateProfile.isPending ? '저장 중...' : '저장'}
                </Button>
            </div>
        </>
    );
}

export function ProfileEditModal({
    open,
    onOpenChange,
    member,
}: ProfileEditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>프로필 수정</DialogTitle>
                    <DialogDescription>
                        닉네임을 변경할 수 있습니다
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <ProfileEditForm
                        member={member}
                        onCancel={() => onOpenChange(false)}
                        onSuccess={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
