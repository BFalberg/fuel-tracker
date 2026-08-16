import ActionSheet from '@/components/action-sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Refuel } from '@/types';
import { BanknoteIcon, Car, Fuel, Gauge, MapPin, Pencil, Trash2 } from 'lucide-react';

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

    const isElectric = refuel.type ? refuel.type === 'charge' : (refuel.car?.is_electric ?? false);
    const liters = Number(refuel.liters_refueled);
    const totalPrice = Number(refuel.total_price);
    // Guard against a zero-litre record producing Infinity or NaN.
    const unitPrice = liters > 0 ? totalPrice / liters : null;
    const unitLabel = isElectric ? 'kWh' : 'L';
    const unitPriceLabel = isElectric ? 'kr./kWh' : 'kr./L';

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
                <ActionSheet
                    title={`Refuel · ${formatDate(refuel.created_at)}`}
                    items={[
                        { label: 'Edit', icon: Pencil, href: route('refuels.edit', { refuel: refuel.id }) },
                        { label: 'Delete', icon: Trash2, onSelect: () => onDelete?.(refuel), destructive: true },
                    ]}
                />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <Car className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{refuel.mileage.toLocaleString('da-DK')} km</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Fuel className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">
                            {formatNumber(liters)} {unitLabel}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BanknoteIcon className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Gauge className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{unitPrice === null ? '—' : `${formatNumber(unitPrice)} ${unitPriceLabel}`}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
