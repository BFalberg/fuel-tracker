import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

interface Car {
    id: number;
    name: string;
}

interface CreateProps {
    car: Car;
}

export default function Create({ car }: CreateProps) {
    const breadcrumbs = [
        { title: 'Cars', href: '/cars' },
        { title: car.name, href: `/cars/${car.id}` },
        { title: 'Add Expense', href: `/cars/${car.id}/expenses/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        expense_type: '',
        amount: '',
        description: '',
        vendor: '',
        invoice_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('cars.expenses.store', { car: car.id }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Heading level={1} title={`Add Expense for ${car.name}`} />
            <div className="mx-auto max-w-xl">
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div>
                                <label className="mb-1 block text-xs">Type</label>
                                <NativeSelect value={data.expense_type} onChange={(e) => setData('expense_type', e.target.value)} required>
                                    <NativeSelectOption value="" disabled>
                                        Vælg type
                                    </NativeSelectOption>
                                    <NativeSelectOption value="Værksted">Værksted</NativeSelectOption>
                                    <NativeSelectOption value="Forsikring">Forsikring</NativeSelectOption>
                                    <NativeSelectOption value="Afgift">Afgift</NativeSelectOption>
                                    <NativeSelectOption value="Tilkøb">Tilkøb</NativeSelectOption>
                                </NativeSelect>
                                {errors.expense_type && <div className="text-xs text-red-500">{errors.expense_type}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs">Description</label>
                                <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs">Vendor</label>
                                <Input value={data.vendor} onChange={(e) => setData('vendor', e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs">Invoice Date</label>
                                <Input type="date" value={data.invoice_date} onChange={(e) => setData('invoice_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs">Amount</label>
                                <Input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} required />
                                {errors.amount && <div className="text-xs text-red-500">{errors.amount}</div>}
                            </div>
                            <Button type="submit" disabled={processing} className="mt-4 w-full">
                                Create Expense
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
