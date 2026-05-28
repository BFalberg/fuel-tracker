import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface Refuel {
    id?: number;
    car_id: number;
    gas_station_id?: number | null;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    type?: 'fossil' | 'charge';
}

interface RefuelFormProps {
    refuel?: Refuel;
    cars: Array<{ id: number; name: string; is_electric?: boolean }>;
    gasStations: Array<{ id: number; name: string }>;
    open: boolean;
    formType: 'create' | 'edit';
}

export default function RefuelForm({ refuel, cars, gasStations, formType }: RefuelFormProps) {
    const isEditing = formType === 'edit';

    const { data, setData, post, put, processing, errors, reset } = useForm({
        car_id: refuel?.car_id?.toString() ?? '',
        gas_station_id: refuel?.gas_station_id?.toString() ?? '',
        liters_refueled: refuel?.liters_refueled ?? '',
        total_price: refuel?.total_price ?? '',
        mileage: refuel?.mileage ?? '',
        new_gas_station_name: '',
    });

    const selectedCar = cars.find((car) => car.id.toString() === data.car_id.toString());
    const isElectric = selectedCar?.is_electric ?? false;
    const energyLabel = isElectric ? 'kWh Charged' : 'Liters Refueled';

    useEffect(() => {
        if (formType === 'edit' && refuel) {
            setData({
                car_id: refuel.car_id.toString(),
                gas_station_id: refuel.gas_station_id?.toString() ?? '',
                liters_refueled: refuel.liters_refueled,
                total_price: refuel.total_price,
                mileage: refuel.mileage,
                new_gas_station_name: '',
            });
        } else if (formType === 'create') {
            reset();
        }
    }, [refuel, formType, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/refuels/${refuel?.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post('/refuels', {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <Card>
            <div className="p-4 pt-0">
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="car_id">Car</Label>
                        <NativeSelect id="car_id" value={data.car_id.toString()} onChange={(e) => setData('car_id', e.target.value)}>
                            <NativeSelectOption value="">Select car</NativeSelectOption>
                            {cars.map((car) => (
                                <NativeSelectOption key={car.id} value={car.id.toString()}>
                                    {car.name}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                        <InputError message={errors.car_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="total_price">Total Price</Label>
                        <Input
                            id="total_price"
                            type="number"
                            required
                            inputMode="decimal"
                            step="0.01"
                            tabIndex={1}
                            autoComplete="off"
                            value={data.total_price}
                            onChange={(e) => setData('total_price', e.target.value)}
                            placeholder="Total price"
                        />
                        <InputError message={errors.total_price} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="liters_refueled">{energyLabel}</Label>
                        <Input
                            id="liters_refueled"
                            type="number"
                            required
                            inputMode="decimal"
                            step="0.01"
                            tabIndex={2}
                            autoComplete="off"
                            value={data.liters_refueled}
                            onChange={(e) => setData('liters_refueled', e.target.value)}
                            placeholder={isElectric ? 'kWh charged' : 'Liters refueled'}
                        />
                        <InputError message={errors.liters_refueled} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mileage">Mileage</Label>
                        <Input
                            id="mileage"
                            type="number"
                            required
                            inputMode="decimal"
                            tabIndex={3}
                            autoComplete="off"
                            value={data.mileage}
                            onChange={(e) => setData('mileage', e.target.value)}
                            placeholder="Mileage"
                        />
                        <InputError message={errors.mileage} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gas_station_id">Station</Label>
                        <NativeSelect
                            id="gas_station_id"
                            value={data.gas_station_id.toString()}
                            onChange={(e) => setData('gas_station_id', e.target.value)}
                        >
                            <NativeSelectOption value="">Select station</NativeSelectOption>
                            {gasStations.map((station) => (
                                <NativeSelectOption key={station.id} value={station.id.toString()}>
                                    {station.name}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                        <InputError message={errors.gas_station_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new_gas_station_name">New station name (optional)</Label>
                        <Input
                            id="new_gas_station_name"
                            type="text"
                            tabIndex={5}
                            autoComplete="off"
                            value={data.new_gas_station_name}
                            onChange={(e) => setData('new_gas_station_name', e.target.value)}
                            placeholder={isElectric ? 'Charging station name' : 'Gas station name'}
                        />
                        <InputError message={errors.new_gas_station_name} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button className="w-full" type="submit" disabled={processing}>
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
