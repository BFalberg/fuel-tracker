import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface GasStation {
    id?: number;
    name: string;
    address: string;
}

interface GasStationFormProps {
    gasStation?: GasStation;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function GasStationForm({ gasStation, open, onOpenChange }: GasStationFormProps) {
    const isEditing = !!gasStation;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: gasStation?.name ?? '',
        address: gasStation?.address ?? '',
    });

    // Add this effect to handle form data updates when gasStation prop changes
    useEffect(() => {
        if (gasStation) {
            setData({
                name: gasStation.name,
                address: gasStation.address,
            });
        } else {
            reset();
        }
    }, [gasStation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/gas-stations/${gasStation.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/gas-stations', {
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
                        <SheetTitle>{isEditing ? 'Edit Gas Station' : 'Create Gas Station'}</SheetTitle>
                        <SheetDescription>{isEditing ? 'Update gas station details' : 'Add a new gas station'}</SheetDescription>
                    </SheetHeader>
                    <div className="p-4 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                <InputError message={errors.address} />
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
