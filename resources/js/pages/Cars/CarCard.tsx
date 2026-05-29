import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Car, MoreVertical, Pencil, Trash2, User } from 'lucide-react';
interface CarCardProps {
    car: {
        id: number;
        name: string;
        registration_number: string;
        is_electric?: boolean;
        user?: {
            id: number;
            name: string;
        };
    };
    onDelete?: (car: CarCardProps['car']) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
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
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('cars.edit', { car: car.id })} className="flex items-center">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete?.(car)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-4">
                    <p className="text-muted-foreground col-span-2 flex items-center gap-2 text-sm">
                        <Car className="size-5" />
                        {car.registration_number}
                    </p>
                    <p className="text-muted-foreground col-span-3 flex items-center gap-2 text-sm">
                        <User className="size-5" />
                        {car.user?.name ?? '-'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
