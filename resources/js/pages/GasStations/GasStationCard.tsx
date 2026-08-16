import ActionSheet from '@/components/action-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Pencil, Trash2 } from 'lucide-react';

interface GasStationCardProps {
    gasStation: {
        id: number;
        name: string;
        address: string;
    };
    onDelete?: (gasStation: GasStationCardProps['gasStation']) => void;
}

export default function GasStationCard({ gasStation, onDelete }: GasStationCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{gasStation.name}</CardTitle>
                <ActionSheet
                    title={gasStation.name}
                    items={[
                        { label: 'Edit', icon: Pencil, href: route('gas-stations.edit', { gas_station: gasStation.id }) },
                        { label: 'Delete', icon: Trash2, onSelect: () => onDelete?.(gasStation), destructive: true },
                    ]}
                />
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="size-5" />
                    {gasStation.address}
                </div>
            </CardContent>
        </Card>
    );
}
