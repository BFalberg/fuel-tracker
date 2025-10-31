import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';

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
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('gas-stations.edit', { gas_station: gasStation.id })} className="flex items-center">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete?.(gasStation)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
