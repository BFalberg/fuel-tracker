import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface Refuel {
    id?: number;
    car_id: number;
    gas_station_id: number;
    liters_refueled: number;
    total_price: number;
    mileage: number;
}

interface RefuelFormProps {
    refuel?: Refuel;
    cars: Array<{ id: number; name: string }>;
    gasStations: Array<{ id: number; name: string }>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RefuelForm({ refuel, cars, gasStations, open, onOpenChange }: RefuelFormProps) {
    const isEditing = !!refuel;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        car_id: refuel?.car_id?.toString() ?? '',
        gas_station_id: refuel?.gas_station_id?.toString() ?? '',
        liters_refueled: refuel?.liters_refueled ?? '',
        total_price: refuel?.total_price ?? '',
        mileage: refuel?.mileage ?? '',
    });

    // Reset form when refuel prop changes (switching between create/edit)
    useEffect(() => {
        if (refuel) {
            setData({
                car_id: refuel.car_id.toString(),
                gas_station_id: refuel.gas_station_id.toString(),
                liters_refueled: refuel.liters_refueled,
                total_price: refuel.total_price,
                mileage: refuel.mileage,
            });
        } else {
            reset();
        }
    }, [refuel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/refuels/${refuel.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/refuels', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom">
                <div className="mx-auto w-full max-w-sm">
                    <SheetHeader>
                        <SheetTitle>{isEditing ? 'Edit Refuel' : 'Create Refuel'}</SheetTitle>
                        <SheetDescription>{isEditing ? 'Update your refuel details' : 'Add a new refuel record'}</SheetDescription>
                    </SheetHeader>

                    <div className="p-4 pt-0">
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <Label htmlFor="total_price" className="block text-sm font-medium text-gray-700">
                                    Total Price
                                </Label>
                                <Input
                                    id="total_price"
                                    type="number"
                                    inputMode="decimal"
                                    pattern="[0-9]*"
                                    step="0.01"
                                    value={data.total_price}
                                    onChange={(e) => setData('total_price', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.total_price} />
                            </div>
                            <div>
                                <Label htmlFor="liters_refueled" className="block text-sm font-medium text-gray-700">
                                    Liters Refueled
                                </Label>
                                <Input
                                    id="liters_refueled"
                                    type="number"
                                    inputMode="decimal"
                                    pattern="[0-9]*"
                                    step="0.01"
                                    value={data.liters_refueled}
                                    onChange={(e) => setData('liters_refueled', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.liters_refueled} />
                            </div>
                            <div>
                                <Label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                                    Mileage
                                </Label>
                                <Input
                                    id="mileage"
                                    type="number"
                                    inputMode="decimal"
                                    pattern="[0-9]*"
                                    value={data.mileage}
                                    onChange={(e) => setData('mileage', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.mileage} />
                            </div>
                            <div>
                                <Label htmlFor="gas_station_id">Gas Station</Label>
                                <Select value={data.gas_station_id.toString()} onValueChange={(value) => setData('gas_station_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a gas station" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gasStations.map((station, index) => (
                                            <React.Fragment key={station.id}>
                                                {index === 1 && <SelectSeparator />}
                                                <SelectItem value={station.id.toString()}>{station.name}</SelectItem>
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gas_station_id} />
                            </div>
                            <div>
                                <Label htmlFor="car_id">Car</Label>
                                <Select value={data.car_id.toString()} onValueChange={(value) => setData('car_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a car" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cars.map((car) => (
                                            <SelectItem key={car.id} value={car.id.toString()}>
                                                {car.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.car_id} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button className="w-full" type="submit" disabled={processing}>
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                                <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
