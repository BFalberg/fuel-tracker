import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

type RefuelType = {
    id: number;
    car_id: number;
    gas_station_id: number;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    created_at: string;
};

type ExpenseType = {
    id: number;
    expense_type: string;
    amount: number;
    description: string;
    vendor: string;
    invoice_date: string;
};

export default function CarCosts({
    expenses = [],
    refuels = [],
    startMilage,
    purchasePrice = null,
    salePrice = null,
}: {
    expenses?: ExpenseType[];
    refuels?: RefuelType[];
    startMilage: number | null;
    purchasePrice?: number | null;
    salePrice?: number | null;
}) {
    const totalExpenseCost = (expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalRefuelCost = (refuels ?? []).reduce((sum, refuel) => sum + Number(refuel.total_price), 0);
    const milages = (refuels ?? []).map((r) => Number(r.mileage));
    const minMilage = startMilage ?? (milages.length > 0 ? Math.min(...milages) : 0);
    const maxMilage = milages.length > 0 ? Math.max(...milages) : minMilage;
    const kmDriven = maxMilage - minMilage;
    const purchasePriceValue = Number(purchasePrice) || 0;
    const salePriceValue = Number(salePrice) || 0;
    const totalCost = purchasePriceValue + totalExpenseCost + totalRefuelCost - salePriceValue;
    const refuelPerKm = kmDriven > 0 ? totalRefuelCost / kmDriven : 0;
    const expensePerKm = kmDriven > 0 ? totalExpenseCost / kmDriven : 0;
    const totalPerKm = kmDriven > 0 ? totalCost / kmDriven : 0;

    return (
        <Card>
            <CardHeader className="">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <CircleDollarSign className="size-6" />
                        Car Costs
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <div className="text-muted-foreground text-xs tracking-wide">Total Expense</div>
                            <div className="font-semibold">{totalExpenseCost.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-muted-foreground text-xs tracking-wide">Total Refuel</div>
                            <div className="font-semibold">{totalRefuelCost.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-muted-foreground text-xs tracking-wide">Expense per km</div>
                            <div className="text-lg font-medium">{expensePerKm.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-muted-foreground text-xs tracking-wide">Refuel per km</div>
                            <div className="text-lg font-medium">{refuelPerKm.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</div>
                        </div>
                        <div className="col-span-2 mt-2 flex flex-col gap-2 border-t pt-4">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">Total Cost:</span>
                                <span className="text-lg font-medium">
                                    {totalCost.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">Total km driven:</span>
                                <span className="text-lg font-medium">{kmDriven.toLocaleString('da-DK')} km</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold">Total per km: </div>
                                <div className="text-lg font-medium">
                                    {totalPerKm.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
