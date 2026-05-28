import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Car {
    id?: number;
    name: string;
    registration_number: string;
    start_milage?: number | '';
    purchase_price?: number | '';
    sale_price?: number | '';
    is_electric?: boolean;
}

interface CarFormProps {
    formType: 'create' | 'edit';
    car?: Car;
}

export default function CarForm({ formType, car }: CarFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: car?.name ?? '',
        registration_number: car?.registration_number ?? '',
        start_milage: car?.start_milage ?? '',
        purchase_price: car?.purchase_price ?? '',
        sale_price: car?.sale_price ?? '',
        is_electric: car?.is_electric ?? false,
    });

    useEffect(() => {
        if (car) {
            setData({
                name: car.name,
                registration_number: car.registration_number,
                start_milage: car.start_milage ?? '',
                purchase_price: car.purchase_price ?? '',
                sale_price: car.sale_price ?? '',
                is_electric: car.is_electric ?? false,
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
                <div className="flex items-center gap-3">
                    <Checkbox id="is_electric" checked={data.is_electric} onCheckedChange={(checked) => setData('is_electric', Boolean(checked))} />
                    <Label htmlFor="is_electric">Electric vehicle (EV)</Label>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="start_milage">Start Milage</Label>
                    <Input
                        id="start_milage"
                        type="number"
                        tabIndex={4}
                        autoComplete="off"
                        value={data.start_milage}
                        onChange={(e) => setData('start_milage', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                    />
                    <InputError message={errors.start_milage} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="purchase_price">Purchase Price</Label>
                    <Input
                        id="purchase_price"
                        type="number"
                        tabIndex={5}
                        autoComplete="off"
                        value={data.purchase_price}
                        onChange={(e) => setData('purchase_price', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                    />
                    <InputError message={errors.purchase_price} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="sale_price">Sale Price</Label>
                    <Input
                        id="sale_price"
                        type="number"
                        tabIndex={6}
                        autoComplete="off"
                        value={data.sale_price}
                        onChange={(e) => setData('sale_price', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                    />
                    <InputError message={errors.sale_price} />
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
