import { CircleDollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CarCostsData {
    energy: number;
    otherExpenses: number;
    ownership: number;
    total: number;
    kilometers: number;
    perKilometer: {
        energy: number;
        otherExpenses: number;
        total: number;
    };
}

const formatCurrency = (value: number) =>
    value.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' });

export default function CarCosts({
    costs,
    isElectric,
}: {
    costs: CarCostsData;
    isElectric: boolean;
}) {
    const energyLabel = isElectric ? 'Charging' : 'Fuel';
    const energyHint = isElectric ? 'Charges and subscription' : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <CircleDollarSign className="size-6" />
                    Car Costs
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs tracking-wide text-muted-foreground">
                            {energyLabel}
                        </div>
                        <div className="font-semibold">
                            {formatCurrency(costs.energy)}
                        </div>
                        {energyHint && (
                            <div className="text-xs text-muted-foreground">
                                {energyHint}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-xs tracking-wide text-muted-foreground">
                            Other expenses
                        </div>
                        <div className="font-semibold">
                            {formatCurrency(costs.otherExpenses)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-xs tracking-wide text-muted-foreground">
                            {energyLabel} per km
                        </div>
                        <div className="text-lg font-medium">
                            {formatCurrency(costs.perKilometer.energy)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-xs tracking-wide text-muted-foreground">
                            Other expenses per km
                        </div>
                        <div className="text-lg font-medium">
                            {formatCurrency(costs.perKilometer.otherExpenses)}
                        </div>
                    </div>
                    <div className="col-span-2 mt-2 flex flex-col gap-2 border-t pt-4">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">
                                Purchase less sale:
                            </span>
                            <span className="text-lg font-medium">
                                {formatCurrency(costs.ownership)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">Total Cost:</span>
                            <span className="text-lg font-medium">
                                {formatCurrency(costs.total)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">
                                Total km driven:
                            </span>
                            <span className="text-lg font-medium">
                                {costs.kilometers.toLocaleString('da-DK')} km
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">Total per km:</span>
                            <span className="text-lg font-medium">
                                {formatCurrency(costs.perKilometer.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
