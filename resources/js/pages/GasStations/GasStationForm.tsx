import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface GasStation {
    id?: number;
    name: string;
    address: string;
}

interface GasStationFormProps {
    formType: 'create' | 'edit';
    gasStation?: GasStation;
}

export default function GasStationForm({ formType, gasStation }: GasStationFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: gasStation?.name ?? '',
        address: gasStation?.address ?? '',
    });

    useEffect(() => {
        if (gasStation) {
            setData({
                name: gasStation.name,
                address: gasStation.address,
            });
        } else {
            reset();
        }
    }, [gasStation, reset, setData]);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
                    );

                    if (!response.ok) {
                        return;
                    }

                    const data = await response.json();
                    const address = data?.address ?? {};
                    const street = [address.road, address.house_number].filter(Boolean).join(' ');
                    const locality = address.city || address.town || address.village || address.suburb || address.city_district;
                    const cityLine = [address.postcode, locality].filter(Boolean).join(' ');
                    const formatted = [street, cityLine].filter(Boolean).join(', ');

                    if (formatted) {
                        setData('address', formatted);
                    } else if (data?.display_name) {
                        setData('address', data.display_name);
                    }
                } catch {
                    // no-op
                }
            },
            () => {
                // no-op
            },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'edit' && gasStation?.id) {
            put(`/gas-stations/${gasStation.id}`, {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post('/gas-stations', {
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
                        placeholder="Gas station name"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        type="text"
                        required
                        tabIndex={2}
                        autoComplete="off"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="123 Main St"
                    />
                    <InputError message={errors.address} />
                    <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
                        Use current location
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="w-full" type="submit" disabled={processing} tabIndex={3}>
                        {formType === 'edit' ? 'Update Gas Station' : 'Create Gas Station'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
