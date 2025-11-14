import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { Banknote, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';

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
    return (
        <Card>
            <CardHeader className="">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Banknote className="size-6" />
                        Expenses
                    </CardTitle>
                    <Button asChild variant="default" size="sm">
                        <Link href={route('cars.expenses.create', { car: carId })}>
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
                        <ul className="divide-border flex flex-col">
                            {expenses.map((expense: Expense) => (
                                <li key={expense.id} className="relative mt-4 flex flex-col gap-1 border-t pt-4">
                                    <div className="flex flex-col justify-between rounded-md">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-foreground text-base font-medium">
                                                <span className="text-base font-semibold">{expense.expense_type}</span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('cars.expenses.edit', { car: carId, expense: expense.id })}
                                                            className="flex items-center"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.delete(route('cars.expenses.destroy', { car: carId, expense: expense.id }))
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                            <span className="col-span-2">
                                                {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(expense.amount)}
                                            </span>
                                            {expense.vendor && <span className="text-muted-foreground">{expense.vendor}</span>}
                                            <div className="text-muted-foreground">{expense.invoice_date}</div>
                                            {expense.description && (
                                                <div className="text-muted-foreground col-span-2 mt-1">{expense.description}</div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
