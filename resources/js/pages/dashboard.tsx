import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, XAxis } from 'recharts';

interface CarItem {
    id: number;
    name: string;
}

interface MonthlyTrend {
    month: string;
    cost: number;
    efficiency: number | null;
    distance: number;
}

interface CarStats {
    id: number;
    name: string;
    isElectric: boolean;
    stats: {
        currentMonth: { amount: number; kilometers: number; refuelCount: number };
        averages: { monthlyAmount: number; monthlyKilometers: number };
        totals: { amount: number; kilometers: number; pricePerKilometer: number };
        efficiency: { currentMonth: number | null; allTime: number | null };
        monthlyTrends: MonthlyTrend[];
    };
}

interface Props {
    cars: CarItem[];
    selectedCarId: number | null;
    stats?: CarStats;
    message?: string;
}

type ChartTab = 'cost' | 'efficiency' | 'distance';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const chartConfig = {
    value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

export default function Dashboard({ cars, selectedCarId, stats, message }: Props) {
    const [activeTab, setActiveTab] = useState<ChartTab>('cost');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(amount);

    const formatNumber = (n: number) => new Intl.NumberFormat('da-DK').format(n);

    const formatMonthLabel = (month: string) => {
        const [year, m] = month.split('-');
        return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('da-DK', { month: 'short' });
    };

    const currentMonth = new Date().toISOString().slice(0, 7);

    const efficiencyUnit = stats?.isElectric ? 'kWh' : 'L';

    const costDelta =
        stats && stats.stats.averages.monthlyAmount > 0
            ? stats.stats.currentMonth.amount > stats.stats.averages.monthlyAmount
                ? '↑'
                : '↓'
            : null;

    const effDelta =
        stats?.stats.efficiency.currentMonth !== null && stats?.stats.efficiency.allTime !== null
            ? (stats!.stats.efficiency.currentMonth ?? 0) > (stats!.stats.efficiency.allTime ?? 0)
                ? '↑'
                : '↓'
            : null;

    const chartData = (stats?.stats.monthlyTrends ?? []).map((t) => ({
        month: formatMonthLabel(t.month),
        value:
            activeTab === 'cost' ? t.cost : activeTab === 'efficiency' ? (t.efficiency ?? 0) : t.distance,
        rawMonth: t.month,
    }));

    if (message) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <p className="text-muted-foreground">{message}</p>
                    <Button asChild>
                        <Link href={route('cars.create')}>Add a car</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4">
                {/* Car switcher + Log Refuel */}
                <div className="flex items-center gap-3">
                    {cars.length > 1 && (
                        <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5">
                            {cars.map((car) => (
                                <button
                                    key={car.id}
                                    onClick={() => router.get('/dashboard', { car: car.id })}
                                    className={[
                                        'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                        car.id === selectedCarId
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground',
                                    ].join(' ')}
                                >
                                    {car.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <Button asChild size="sm" className="ml-auto shrink-0">
                        <Link href={route('refuels.create')}>
                            <Plus className="mr-1 h-4 w-4" />
                            Log Refuel
                        </Link>
                    </Button>
                </div>

                <Deferred
                    data="stats"
                    fallback={
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1].map((i) => (
                                    <Card key={i}>
                                        <CardHeader className="pb-1 pt-4">
                                            <Skeleton className="h-3 w-20" />
                                        </CardHeader>
                                        <CardContent className="space-y-1 pb-4">
                                            <Skeleton className="h-7 w-28" />
                                            <Skeleton className="h-3 w-24" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <CardContent className="space-y-1 pb-4 pt-4">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-5 w-20" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Card>
                                <CardContent className="pb-4 pt-4">
                                    <Skeleton className="h-44 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    }
                >
                    {stats && (
                        <div className="flex flex-col gap-4">
                            {/* Hero cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card>
                                    <CardHeader className="pb-1 pt-4">
                                        <CardTitle className="text-muted-foreground text-xs font-medium">This Month</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="text-xl font-bold">
                                            {formatCurrency(stats.stats.currentMonth.amount)}
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            avg. {formatCurrency(stats.stats.averages.monthlyAmount)}/month
                                            {costDelta && ` ${costDelta}`}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-1 pt-4">
                                        <CardTitle className="text-muted-foreground text-xs font-medium">Efficiency</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="text-xl font-bold">
                                            {stats.stats.efficiency.currentMonth !== null
                                                ? `${stats.stats.efficiency.currentMonth} ${efficiencyUnit}/100km`
                                                : '—'}
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            {stats.stats.efficiency.allTime !== null
                                                ? `avg. ${stats.stats.efficiency.allTime} ${efficiencyUnit}/100km${effDelta ? ` ${effDelta}` : ''}`
                                                : '—'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Secondary 2×2 grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Distance This Month</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatNumber(stats.stats.currentMonth.kilometers)} km
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            avg. {formatNumber(stats.stats.averages.monthlyKilometers)} km/month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Price per km</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatCurrency(stats.stats.totals.pricePerKilometer)}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatNumber(stats.stats.totals.kilometers)} km total
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">All-Time Cost</p>
                                        <p className="mt-0.5 font-semibold">
                                            {formatCurrency(stats.stats.totals.amount)}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pb-4 pt-4">
                                        <p className="text-muted-foreground text-xs">Refuels This Month</p>
                                        <p className="mt-0.5 font-semibold">
                                            {stats.stats.currentMonth.refuelCount}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Monthly trend chart */}
                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <div className="flex gap-1">
                                        {(['cost', 'efficiency', 'distance'] as ChartTab[]).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={[
                                                    'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                                                    activeTab === tab
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                ].join(' ')}
                                            >
                                                {tab === 'cost' ? 'Cost' : tab === 'efficiency' ? 'Efficiency' : 'Distance'}
                                            </button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <ChartContainer config={chartConfig} className="h-44 w-full">
                                        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 11 }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel
                                                        formatter={(value) =>
                                                            activeTab === 'cost'
                                                                ? formatCurrency(value as number)
                                                                : activeTab === 'efficiency'
                                                                  ? `${value} ${efficiencyUnit}/100km`
                                                                  : `${formatNumber(value as number)} km`
                                                        }
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="var(--color-value)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                    <p className="text-muted-foreground mt-1 text-center text-xs">
                                        Current month is partial
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </Deferred>
            </div>
        </AppLayout>
    );
}
