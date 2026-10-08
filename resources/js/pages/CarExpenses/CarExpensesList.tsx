import { Link, router } from '@inertiajs/react';
import { Banknote, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ActionSheet from '@/components/action-sheet';
import DeleteConfirmation from '@/components/delete-confirmation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createExpense, destroy as destroyExpense, edit as editExpense } from '@/routes/cars/expenses';

type Expense = {
    id: number;
    expense_type: string;
    amount: number;
    vendor?: string;
    description?: string;
    invoice_date: string;
};

type CarExpensesListProps = {
    expenses: Expense[];
    carId: number;
};

export default function CarExpensesList({ expenses, carId }: CarExpensesListProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const handleDelete = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedExpense) {
            return;
        }

        router.delete(destroyExpense.url({ car: carId, expense: selectedExpense.id }), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedExpense(null);
            },
        });
    };

    return (
        <Card>
            <CardHeader className="">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Banknote className="size-6" />
                        Expenses
                    </CardTitle>
                    <Button asChild variant="default">
                        <Link href={createExpense(carId)}>
                            <Plus /> Expense
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    {expenses.length === 0 ? (
                        <div className="text-muted-foreground">No expenses found.</div>
                    ) : (
                        <ul className="flex flex-col divide-border">
                            {expenses.map((expense: Expense) => (
                                <li key={expense.id} className="relative mt-4 flex flex-col gap-1 border-t pt-4">
                                    <div className="flex flex-col justify-between rounded-md">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-base font-medium text-foreground">
                                                <span className="text-base font-semibold">{expense.expense_type}</span>
                                            </div>
                                            <ActionSheet
                                                title={`${expense.expense_type} expense`}
                                                items={[
                                                    {
                                                        label: 'Edit',
                                                        icon: Pencil,
                                                        href: editExpense.url({ car: carId, expense: expense.id }),
                                                    },
                                                    {
                                                        label: 'Delete',
                                                        icon: Trash2,
                                                        onSelect: () => handleDelete(expense),
                                                        destructive: true,
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                            <span className="col-span-2">
                                                {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(expense.amount)}
                                            </span>
                                            {expense.vendor && <span className="text-muted-foreground">{expense.vendor}</span>}
                                            <div className="text-muted-foreground">{expense.invoice_date}</div>
                                            {expense.description && (
                                                <div className="col-span-2 mt-1 text-muted-foreground">{expense.description}</div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>

            {selectedExpense && (
                <DeleteConfirmation
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onConfirm={confirmDelete}
                    title={`Delete ${selectedExpense.expense_type} expense`}
                    description="This expense will be permanently removed. This action cannot be undone."
                />
            )}
        </Card>
    );
}
