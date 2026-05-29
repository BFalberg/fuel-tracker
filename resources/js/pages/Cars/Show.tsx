import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { Deferred, Head } from '@inertiajs/react';
import { Car, User } from 'lucide-react';
import CarExpensesList from '../CarExpenses/CarExpensesList';
import CarCosts from './CarCosts';

type CarType = {
    id: number;
    name: string;
    registration_number: string;
    user?: { name?: string };
    purchase_price?: number | null;
    sale_price?: number | null;
    start_milage?: number | null;
    is_electric?: boolean;
};

type ExpenseType = {
    id: number;
    expense_type: string;
    amount: number;
    description: string;
    vendor: string;
    invoice_date: string;
};

type RefuelType = {
    id: number;
    date: string;
    amount: number;
    price: number;
};

type BreadcrumbItem = {
    title: string;
    href: string;
};

interface ShowProps {
    car: CarType;
    expenses?: ExpenseType[];
    refuels?: RefuelType[];
    start_milage: number | null;
}

export default function Show({ car, expenses, refuels, start_milage }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${car.name}`,
            href: `/car/${car.id}`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cars" />
            <Heading level={1} title={breadcrumbs[0].title} />

            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Car className="size-6" />
                            {car.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-muted-foreground text-xs">Registration Number</div>
                                <div className="flex items-center gap-2 font-medium">
                                    <Car className="size-4" />
                                    {car.registration_number}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs">Owner</div>
                                <div className="flex items-center gap-2 font-medium">
                                    <User className="size-4" />
                                    {car.user?.name ?? '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs">Purchase Price</div>
                                <div className="font-medium">
                                    {car.purchase_price != null
                                        ? new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(car.purchase_price)
                                        : '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs">Sale Price</div>
                                <div className="font-medium">
                                    {car.sale_price != null
                                        ? new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(car.sale_price)
                                        : '-'}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs">Start Milage</div>
                                <div className="font-medium">{car.start_milage != null ? car.start_milage.toLocaleString('da-DK') : '-'} km</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs">Type</div>
                                <div className="font-medium">{car.is_electric ? 'EV' : 'Fossil'}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Deferred
                    data={['expenses', 'refuels']}
                    fallback={
                        <div className="space-y-6">
                            <div className="rounded-xl border p-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-8 w-28" />
                                </div>
                            </div>
                            <div className="rounded-xl border p-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-32" />
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton key={index} className="h-4 w-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                >
                    <CarCosts
                        expenses={expenses ?? []}
                        refuels={refuels ?? []}
                        startMilage={start_milage}
                        purchasePrice={car.purchase_price}
                        salePrice={car.sale_price}
                    />
                    <CarExpensesList expenses={expenses ?? []} carId={car.id} />
                </Deferred>
            </div>
        </AppLayout>
    );
}
