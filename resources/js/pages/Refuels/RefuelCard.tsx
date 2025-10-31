import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { BanknoteIcon, Car, Fuel, Gauge, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface Refuel {
    id: number;
    car_id: number;
    gas_station_id: number;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    created_at: string; // Add this for the date
    car?: {
        name: string;
    };
    gas_station?: {
        name: string;
    };
}

interface RefuelCardProps {
    refuel: Refuel;
    onEdit?: (refuel: Refuel) => void;
    onDelete?: (refuel: Refuel) => void;
}

export default function RefuelCard({ refuel, onDelete }: RefuelCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: 'DKK',
        }).format(amount);
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('da-DK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('da-DK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-base">{formatDate(refuel.created_at)}</CardTitle>
                    <div className="flex items-center space-x-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-sm">{refuel.gas_station?.name ?? 'Unknown Station'}</span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('refuels.edit', { refuel: refuel.id })} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(refuel)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <Car className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{refuel.mileage.toLocaleString('da-DK')} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Fuel className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{formatNumber(refuel.liters_refueled)} L</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BanknoteIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{formatCurrency(refuel.total_price)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Gauge className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{formatCurrency(refuel.total_price / refuel.liters_refueled).replace('kr.', 'kr./L')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
