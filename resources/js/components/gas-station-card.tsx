import { MapPin, Pencil, Trash2 } from 'lucide-react';
import ActionSheet from '@/components/action-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { edit as editGasStation } from '@/routes/gas-stations';

interface GasStationCardProps {
    gasStation: {
        id: number;
        name: string;
        address: string;
        can_manage: boolean;
    };
    onDelete?: () => void;
}

const sharedHint = "Used by another user's car, so it can't be changed.";

export default function GasStationCard({
    gasStation,
    onDelete,
}: GasStationCardProps) {
    const canManage = gasStation.can_manage;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{gasStation.name}</CardTitle>
                <ActionSheet
                    title={gasStation.name}
                    items={[
                        {
                            label: 'Edit',
                            icon: Pencil,
                            href: editGasStation.url(gasStation.id),
                            disabled: !canManage,
                            hint: canManage ? undefined : sharedHint,
                        },
                        {
                            label: 'Delete',
                            icon: Trash2,
                            onSelect: () => onDelete?.(),
                            destructive: true,
                            disabled: !canManage,
                            hint: canManage ? undefined : sharedHint,
                        },
                    ]}
                />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-5" />
                    {gasStation.address}
                </div>
            </CardContent>
        </Card>
    );
}
