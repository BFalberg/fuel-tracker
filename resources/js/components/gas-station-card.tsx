import { MapPin, Pencil, Trash2 } from 'lucide-react';
import ActionSheet from '@/components/action-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { edit as editGasStation } from '@/routes/gas-stations';

interface GasStationCardProps {
    gasStation: {
        id: number;
        name: string;
        address: string;
    };
    onDelete?: (gasStation: GasStationCardProps['gasStation']) => void;
}

export default function GasStationCard({
    gasStation,
    onDelete,
}: GasStationCardProps) {
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
                        },
                        {
                            label: 'Delete',
                            icon: Trash2,
                            onSelect: () => onDelete?.(gasStation),
                            destructive: true,
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
