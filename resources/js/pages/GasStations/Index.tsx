import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import GasStationCard from './GasStationCard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gas Stations',
        href: '/gas-stations',
    },
];

interface GasStation {
    id: number;
    name: string;
    address: string;
}

interface Props {
    gasStations: GasStation[];
}

export default function GasStations({ gasStations }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);

    const handleDelete = (station: GasStation) => {
        setSelectedStation(station);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedStation) {
            router.delete(`/gas-stations/${selectedStation.id}`);
            setIsDeleteOpen(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gas Stations" />
            <Heading level={1} title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {gasStations.map((station) => (
                        <GasStationCard
                            key={station.id}
                            gasStation={station} // <-- use gasStation prop name
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {selectedStation && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete ${selectedStation.name}`}
                        description={`Are you sure you want to delete ${selectedStation.name}? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
