import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Car {
    id?: number;
    name: string;
    registration_number: string;
}

interface CarFormProps {
    formType: 'create' | 'edit';
    car?: Car;
}

export default function CarForm({ formType, car }: CarFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: car?.name ?? '',
        registration_number: car?.registration_number ?? '',
    });

    useEffect(() => {
        if (car) {
            setData({
                name: car.name,
                registration_number: car.registration_number,
            });
        } else {
            reset();
        }
    }, [car, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'edit' && car?.id) {
            put(`/cars/${car.id}`, {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post('/cars', {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="off"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Car name"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                        id="registration_number"
                        type="text"
                        required
                        tabIndex={2}
                        autoComplete="off"
                        value={data.registration_number}
                        onChange={(e) => setData('registration_number', e.target.value)}
                        placeholder="ABC123"
                    />
                    <InputError message={errors.registration_number} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="w-full" type="submit" disabled={processing}>
                        {formType === 'edit' ? 'Update Car' : 'Create Car'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
