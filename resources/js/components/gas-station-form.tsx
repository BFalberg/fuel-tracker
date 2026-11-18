import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reverseGeocode } from '@/lib/reverse-geocode';
import {
    store as storeGasStation,
    update as updateGasStation,
} from '@/routes/gas-stations';

interface GasStation {
    id?: number;
    name: string;
    address: string;
    latitude?: string | null;
    longitude?: string | null;
}

/** A fix less precise than this could place the station on the wrong street. */
const maxAccuracyMeters = 100;

const toCoordinate = (value?: string | null) =>
    value == null ? null : Number(value);

interface GasStationFormProps {
    formType: 'create' | 'edit';
    gasStation?: GasStation;
}

export default function GasStationForm({
    formType,
    gasStation,
}: GasStationFormProps) {
    const [locationError, setLocationError] = useState<string | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: gasStation?.name ?? '',
        address: gasStation?.address ?? '',
        latitude: toCoordinate(gasStation?.latitude),
        longitude: toCoordinate(gasStation?.longitude),
    });

    useEffect(() => {
        if (gasStation) {
            setData({
                name: gasStation.name,
                address: gasStation.address,
                latitude: toCoordinate(gasStation.latitude),
                longitude: toCoordinate(gasStation.longitude),
            });
        } else {
            reset();
        }
    }, [gasStation, reset, setData]);

    const hasPosition = data.latitude !== null && data.longitude !== null;

    // Standing at the station gives both its position and its address.
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Location is not available on this device.');

            return;
        }

        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                if (coords.accuracy > maxAccuracyMeters) {
                    setLocationError(
                        `Your location is only accurate to ${Math.round(coords.accuracy)} m. Try again outside or closer to the charger.`,
                    );

                    return;
                }

                setData((current) => ({
                    ...current,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }));

                const address = await reverseGeocode(
                    coords.latitude,
                    coords.longitude,
                );

                if (address) {
                    setData('address', address);
                }
            },
            () => {
                setLocationError('Location permission was denied.');
            },
            { enableHighAccuracy: true, timeout: 10_000 },
        );
    };

    const clearPosition = () => {
        setData((current) => ({ ...current, latitude: null, longitude: null }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'edit' && gasStation?.id) {
            put(updateGasStation.url(gasStation.id), {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post(storeGasStation.url(), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4">
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
                </div>
                <div className="grid gap-2">
                    <Label>Position</Label>
                    {hasPosition ? (
                        <p className="text-sm">
                            {data.latitude?.toFixed(5)},{' '}
                            {data.longitude?.toFixed(5)}{' '}
                            <a
                                href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=18/${data.latitude}/${data.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent underline underline-offset-4"
                            >
                                Check on map
                            </a>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Not placed yet. It is set the next time a refuel is
                            logged here on the spot.
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleUseCurrentLocation}
                        >
                            Use my location
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearPosition}
                            disabled={!hasPosition}
                        >
                            Clear position
                        </Button>
                    </div>
                    {locationError && (
                        <p className="text-sm text-destructive">
                            {locationError}
                        </p>
                    )}
                    <InputError message={errors.latitude ?? errors.longitude} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={processing}
                        tabIndex={3}
                    >
                        {formType === 'edit'
                            ? 'Update Gas Station'
                            : 'Create Gas Station'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
