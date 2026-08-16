import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ExpenseForm from './ExpenseForm';

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

interface EditProps {
    car: Car;
    expense: Expense;
    expenseTypes: string[];
}

export default function Edit({ car, expense, expenseTypes }: EditProps) {
    return (
        <AppLayout>
            <Head title="Edit Expense" />
            <Heading level={1} title={`Edit Expense for ${car.name}`} />
            <ExpenseForm formType="edit" car={car} expenseTypes={expenseTypes} expense={expense} />
        </AppLayout>
    );
}
