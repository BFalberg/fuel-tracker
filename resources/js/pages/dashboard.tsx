import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { MonthPicker } from '@/components/ui/month-picker';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
    liters: number;
}

interface CarStats {
    id: number;
    name: string;
    isElectric: boolean;
    stats: {
        currentMonth: { amount: number; kilometers: number; litersThisMonth: number };
        averages: { monthlyAmount: number; monthlyKilometers: number; monthlyLiters: number };
        totals: { amount: number; kilometers: number; pricePerKilometer: number };
        efficiency: { currentMonth: number | null; allTime: number | null };
        monthlyTrends: MonthlyTrend[];
    };
}

interface Props {
    cars: CarItem[];
    selectedCarId: number | null;
    selectedFrom: string;
    selectedTo: string;
    stats?: CarStats;
    message?: string;
}

type ChartTab = 'cost' | 'efficiency' | 'distance' | 'refuel';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const chartConfig = {
    value: { label: 'Value', color: 'var(--accent)' },
} satisfies ChartConfig;

const CHART_TABS: { tab: ChartTab; label: string }[] = [
    { tab: 'refuel', label: 'Refuel' },
    { tab: 'cost', label: 'Cost' },
    { tab: 'efficiency', label: 'Efficiency' },
    { tab: 'distance', label: 'Distance' },
];

export default function Dashboard({ cars, selectedCarId, selectedFrom, selectedTo, stats, message }: Props) {
    const [activeTab, setActiveTab] = useState<ChartTab>('refuel');
    const [selectedBar, setSelectedBar] = useState<number | null>(null);
    const [localFrom, setLocalFrom] = useState(selectedFrom);
    const [localTo, setLocalTo] = useState(selectedTo);

    useEffect(() => {
        setLocalFrom(selectedFrom);
        setLocalTo(selectedTo);
    }, [selectedFrom, selectedTo]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(amount);

    const formatNumber = (n: number) => new Intl.NumberFormat('da-DK').format(n);

    const formatMonthLabel = (month: string) => {
        const [year, m] = month.split('-');
        return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('da-DK', { month: 'short' });
    };

    const applyPeriod = () => {
        router.get('/dashboard', { car: selectedCarId ?? undefined, from: localFrom, to: localTo });
    };

    const isDirty = localFrom !== selectedFrom || localTo !== selectedTo;

    const efficiencyUnit = stats?.isElectric ? 'kWh' : 'L';

    const chartData = (stats?.stats.monthlyTrends ?? []).map((t) => ({
        month: formatMonthLabel(t.month),
        value: activeTab === 'cost' ? t.cost : activeTab === 'efficiency' ? (t.efficiency ?? 0) : activeTab === 'refuel' ? t.liters : t.distance,
        rawMonth: t.month,
    }));

    const formatChartValue = (value: number) => {
        switch (activeTab) {
            case 'cost':
                return formatCurrency(value);
            case 'efficiency':
                return `${value} ${efficiencyUnit}/100km`;
            case 'refuel':
                return `${formatNumber(value)} ${efficiencyUnit}`;
            default:
                return `${formatNumber(value)} km`;
        }
    };

    /**
     * Hover tooltips are a pointer affordance, so the chart is read by tapping a
     * bar instead and the value is shown in the card header. Defaults to the
     * most recent month so a value is always on screen.
     */
    const readoutIndex = selectedBar !== null && selectedBar < chartData.length ? selectedBar : chartData.length - 1;
    const readout = chartData[readoutIndex];

    const selectTab = (tab: ChartTab) => {
        setActiveTab(tab);
        setSelectedBar(null);
    };

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
                {/* Car switcher */}
                {cars.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-0.5">
                        {cars.map((car) => (
                            <button
                                key={car.id}
                                onClick={() => router.get('/dashboard', { car: car.id, from: selectedFrom, to: selectedTo })}
                                className={cn(
                                    'min-h-11 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors',
                                    car.id === selectedCarId ? 'bg-accent text-primary' : 'bg-primary text-primary-foreground',
                                )}
                            >
                                {car.name}
                            </button>
                        ))}
                    </div>
                )}

                <Deferred
                    data="stats"
                    fallback={
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-11 w-full" />
                            <Card>
                                <CardHeader className="gap-3 pb-2">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-52 w-full" />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-1">
                                    <Skeleton className="h-3 w-24" />
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    <Skeleton className="h-9 w-40" />
                                    <Skeleton className="h-3 w-28" />
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <CardHeader className="pb-1">
                                            <Skeleton className="h-3 w-16" />
                                        </CardHeader>
                                        <CardContent className="space-y-1">
                                            <Skeleton className="h-5 w-20" />
                                            <Skeleton className="h-3 w-24" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    }
                >
                    {stats && (
                        <div className="flex flex-col gap-4">
                            {/* Monthly trend chart */}
                            <div className="flex items-center gap-2">
                                <MonthPicker value={localFrom} max={localTo} onChange={setLocalFrom} label="From month" />
                                <span className="text-muted-foreground text-xs">–</span>
                                <MonthPicker
                                    value={localTo}
                                    min={localFrom}
                                    max={new Date().toISOString().slice(0, 7)}
                                    onChange={setLocalTo}
                                    label="To month"
                                />
                                {isDirty && <Button onClick={applyPeriod}>Apply</Button>}
                            </div>
                            <Card>
                                <CardHeader className="gap-3 pb-2">
                                    <div className="bg-input grid grid-cols-4 gap-1 rounded-lg p-1">
                                        {CHART_TABS.map(({ tab, label }) => (
                                            <button
                                                key={tab}
                                                onClick={() => selectTab(tab)}
                                                className={cn(
                                                    'min-h-10 rounded-md px-1 text-xs font-medium transition-colors',
                                                    activeTab === tab ? 'bg-accent text-primary' : 'text-muted-foreground',
                                                )}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    {readout && (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold">{formatChartValue(readout.value)}</span>
                                            <span className="text-muted-foreground text-xs">{readout.month}</span>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-52 w-full">
                                        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 11 }}
                                                interval="preserveStartEnd"
                                                minTickGap={12}
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="var(--color-value)"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={40}
                                                fillOpacity={0.55}
                                                activeIndex={readoutIndex}
                                                activeBar={{ fillOpacity: 1 }}
                                                onClick={(_, index) => setSelectedBar(index)}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Hero card */}
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-sm">Cost this month</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{formatCurrency(stats.stats.currentMonth.amount)}</div>
                                    <p className="text-muted-foreground text-xs">avg. {formatCurrency(stats.stats.averages.monthlyAmount)}/month</p>
                                </CardContent>
                            </Card>

                            {/* Stat tiles */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-xs">Efficiency</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">
                                            {stats.stats.efficiency.currentMonth !== null
                                                ? `${stats.stats.efficiency.currentMonth} ${efficiencyUnit}/100km`
                                                : '—'}
                                        </p>
                                        <p className="text-muted-foreground text-[0.7rem]">
                                            {stats.stats.efficiency.allTime !== null
                                                ? `avg. ${stats.stats.efficiency.allTime} ${efficiencyUnit}/100km`
                                                : ''}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-xs">Distance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">{formatNumber(stats.stats.currentMonth.kilometers)} km</p>
                                        <p className="text-muted-foreground text-[0.7rem]">
                                            avg. {formatNumber(stats.stats.averages.monthlyKilometers)} km/month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-xs">Price per km</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">{formatCurrency(stats.stats.totals.pricePerKilometer)}</p>
                                        <p className="text-muted-foreground text-[0.7rem]">{formatNumber(stats.stats.totals.kilometers)} km total</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-xs">Fuel</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">
                                            {formatNumber(stats.stats.currentMonth.litersThisMonth)} {efficiencyUnit}
                                        </p>
                                        <p className="text-muted-foreground text-[0.7rem]">
                                            avg. {formatNumber(stats.stats.averages.monthlyLiters)} {efficiencyUnit}/month
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </Deferred>
            </div>
        </AppLayout>
    );
}
