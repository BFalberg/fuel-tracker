import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { useForm } from '@inertiajs/react';

interface Car {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    expense_type: string;
    amount: number | string;
    description?: string | null;
    vendor?: string | null;
    invoice_date?: string | null;
}

interface ExpenseFormProps {
    formType: 'create' | 'edit';
    car: Car;
    expenseTypes: string[];
    expense?: Expense;
}

export default function ExpenseForm({ formType, car, expenseTypes, expense }: ExpenseFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        expense_type: expense?.expense_type ?? '',
        amount: expense?.amount?.toString() ?? '',
        description: expense?.description ?? '',
        vendor: expense?.vendor ?? '',
        invoice_date: expense?.invoice_date ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formType === 'edit' && expense) {
            put(route('cars.expenses.update', { car: car.id, expense: expense.id }));
        } else {
            post(route('cars.expenses.store', { car: car.id }));
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4">
                <div className="grid gap-2">
                    <Label htmlFor="expense_type">Type</Label>
                    <NativeSelect
                        id="expense_type"
                        required
                        tabIndex={1}
                        value={data.expense_type}
                        onChange={(e) => setData('expense_type', e.target.value)}
                    >
                        <NativeSelectOption value="" disabled>
                            Vælg type
                        </NativeSelectOption>
                        {expenseTypes.map((expenseType) => (
                            <NativeSelectOption key={expenseType} value={expenseType}>
                                {expenseType}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                    <InputError message={errors.expense_type} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        required
                        tabIndex={2}
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        placeholder="0,00"
                    />
                    <InputError message={errors.amount} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        tabIndex={3}
                        autoComplete="off"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                        id="vendor"
                        type="text"
                        tabIndex={4}
                        autoComplete="off"
                        value={data.vendor}
                        onChange={(e) => setData('vendor', e.target.value)}
                    />
                    <InputError message={errors.vendor} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="invoice_date">Invoice date</Label>
                    <Input
                        id="invoice_date"
                        type="date"
                        tabIndex={5}
                        value={data.invoice_date}
                        onChange={(e) => setData('invoice_date', e.target.value)}
                    />
                    <InputError message={errors.invoice_date} />
                </div>
                <Button className="w-full" type="submit" disabled={processing} tabIndex={6}>
                    {formType === 'edit' ? 'Update Expense' : 'Create Expense'}
                </Button>
            </form>
        </Card>
    );
}
