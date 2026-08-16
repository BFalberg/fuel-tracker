import ActionSheet from '@/components/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Car, Pencil, Trash2, User } from 'lucide-react';

interface CarCardProps {
    car: {
        id: number;
        name: string;
        registration_number: string;
        is_electric?: boolean;
        users?: { id: number; name: string }[];
        pivot?: { role: 'owner' | 'co_driver' };
        can_delete?: boolean;
    };
    onDelete?: (car: CarCardProps['car']) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const isOwner = car.pivot?.role === 'owner';
    const ownerName = car.users?.[0]?.name ?? '-';
    // Cars with recorded refuels or expenses are kept permanently; the server enforces this too.
    const canDelete = car.can_delete ?? false;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <CardTitle>
                        <Link href={route('cars.show', { car: car.id })} className="hover:underline">
                            {car.name}
                        </Link>
                    </CardTitle>
                    <Badge variant={car.is_electric ? 'secondary' : 'outline'}>{car.is_electric ? 'EV' : 'Fossil'}</Badge>
                </div>
                {isOwner && (
                    <ActionSheet
                        title={car.name}
                        items={[
                            { label: 'Edit', icon: Pencil, href: route('cars.edit', { car: car.id }) },
                            {
                                label: 'Delete',
                                icon: Trash2,
                                onSelect: () => onDelete?.(car),
                                disabled: !canDelete,
                                destructive: canDelete,
                                hint: canDelete ? undefined : 'This car has refuels or expenses recorded',
                            },
                        ]}
                    />
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-4">
                    <p className="text-muted-foreground col-span-2 flex items-center gap-2 text-sm">
                        <Car className="size-5" />
                        {car.registration_number}
                    </p>
                    <p className="text-muted-foreground col-span-3 flex items-center gap-2 text-sm">
                        <User className="size-5" />
                        {ownerName}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
