import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import CarForm from './CarForm';

interface Car {
    id: number;
    name: string;
    registration_number: string;
    start_milage?: number;
    purchase_price?: number;
    sale_price?: number;
    is_electric?: boolean;
}

interface CarUser {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'co_driver';
}

interface CarEditProps {
    car: Car;
    carUsers: CarUser[];
    isOwner: boolean;
}

function AddCoDriverForm({ carId }: { carId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('cars.users.store', { car: carId }), {
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
                <Input type="email" placeholder="Email address" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <Button type="submit" disabled={processing} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add
            </Button>
        </form>
    );
}

export default function CarEdit({ car, carUsers, isOwner }: CarEditProps) {
    const breadcrumbs = [
        { title: 'Cars', href: '/cars' },
        { title: 'Edit Car', href: `/cars/${car.id}/edit` },
    ];

    function handleRemoveUser(userId: number) {
        router.delete(route('cars.users.destroy', { car: car.id, user: userId }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title="Edit Car" />
            <CarForm formType="edit" car={car} />

            {isOwner && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users className="h-4 w-4" />
                            Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="divide-y">
                            {carUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-muted-foreground text-xs">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                                            {user.role === 'owner' ? 'Owner' : 'Co-driver'}
                                        </Badge>
                                        {user.role === 'co_driver' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <AddCoDriverForm carId={car.id} />
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
