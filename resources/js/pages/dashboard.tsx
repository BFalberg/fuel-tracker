import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Car, ChartNoAxesCombined, Coins, Wallet } from 'lucide-react';

interface CarStats {
    id: number;
    name: string;
    stats: {
        currentMonth: {
            amount: number;
            kilometers: number;
        };
        averages: {
            monthlyAmount: number;
            monthlyKilometers: number;
        };
        totals: {
            amount: number;
            kilometers: number;
            pricePerKilometer: number;
        };
    };
}

interface Props {
    cars: CarStats[];
    message?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ cars, message }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: 'DKK',
        }).format(amount);
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('da-DK').format(number);
    };

    if (message) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <Button onClick={() => router.visit('/cars/create')}>Add Car</Button>
                    </div>
                    <div className="text-center text-gray-500">{message}</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {cars.map((car) => (
                    <div key={car.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">{car.name}</h1>
                            <Button onClick={() => router.visit('/refuels/create')}>Create Refuel</Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                                    <Wallet className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(car.stats.currentMonth.amount)}</div>
                                    <p className="text-muted-foreground text-xs">Avg. {formatCurrency(car.stats.averages.monthlyAmount)}/month</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Distance This Month</CardTitle>
                                    <Car className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatNumber(car.stats.currentMonth.kilometers)} km</div>
                                    <p className="text-muted-foreground text-xs">
                                        Avg. {formatNumber(car.stats.averages.monthlyKilometers)} km/month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Price per Kilometer</CardTitle>
                                    <Coins className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(car.stats.totals.pricePerKilometer)}</div>
                                    <p className="text-muted-foreground text-xs">per kilometer driven</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">All time</CardTitle>
                                    <ChartNoAxesCombined className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(car.stats.totals.amount)}</div>
                                    <p className="text-muted-foreground text-xs">{formatNumber(car.stats.totals.kilometers)} km driven</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
