export type Refuel = {
    id: number;
    car_id: number;
    gas_station_id?: number | null;
    liters_refueled: number;
    total_price: number;
    mileage: number;
    type?: 'fossil' | 'charge';
    created_at: string;
    car?: {
        name: string;
        is_electric?: boolean;
    };
    gas_station?: {
        name: string;
    } | null;
};
