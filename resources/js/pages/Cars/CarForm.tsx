import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Car {
    id?: number;
    name: string;
    registration_number: string;
}

interface CarFormProps {
    car?: Car;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CarForm({ car, open, onOpenChange }: CarFormProps) {
    const isEditing = !!car;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: car?.name ?? '',
        registration_number: car?.registration_number ?? '',
    });

    // Add this effect to handle form data updates when car prop changes
    useEffect(() => {
        if (car) {
            setData({
                name: car.name,
                registration_number: car.registration_number,
            });
        } else {
            reset();
        }
    }, [car]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/cars/${car.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post('/cars', {
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
                        <SheetTitle>{isEditing ? 'Edit Car' : 'Create Car'}</SheetTitle>
                        <SheetDescription>{isEditing ? 'Update your car details' : 'Add a new car to your fleet'}</SheetDescription>
                    </SheetHeader>

                    <div className="p-4 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">
                                    Registration Number
                                </Label>
                                <Input
                                    type="text"
                                    id="registration_number"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.registration_number} />
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
