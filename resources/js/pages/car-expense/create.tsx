import { Head } from '@inertiajs/react';
import ExpenseForm from '@/components/car-expense-form';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

interface Car {
    id: number;
    name: string;
}

interface CreateProps {
    car: Car;
    expenseTypes: string[];
}

export default function Create({ car, expenseTypes }: CreateProps) {
    return (
        <AppLayout>
            <Head title="Add Expense" />
            <Heading level={1} title={`Add Expense for ${car.name}`} />
            <ExpenseForm
                formType="create"
                car={car}
                expenseTypes={expenseTypes}
            />
        </AppLayout>
    );
}
