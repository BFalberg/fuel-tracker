import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import GasStationForm from './GasStationForm';

interface GasStation {
    id: number;
    name: string;
    address: string;
}

interface Props {
    gasStations: GasStation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gas Stations',
        href: '/gas-stations',
    },
];

export default function GasStations({ gasStations }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedGasStation, setSelectedGasStation] = useState<GasStation | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleEdit = (gasStation: GasStation) => {
        setSelectedGasStation(gasStation);
        setIsFormOpen(true);
    };

    const handleDelete = (gasStation: GasStation) => {
        setSelectedGasStation(gasStation);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedGasStation) {
            router.delete(`/gas-stations/${selectedGasStation.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedGasStation(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gas Stations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gas Stations</h1>
                    <Button
                        onClick={() => {
                            setSelectedGasStation(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Create Gas Station
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gasStations.map((gasStation) => (
                                <TableRow key={gasStation.id}>
                                    <TableCell>{gasStation.name}</TableCell>
                                    <TableCell>{gasStation.address}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(gasStation)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(gasStation)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <GasStationForm
                    gasStation={selectedGasStation ?? undefined}
                    open={isFormOpen}
                    onOpenChange={(open) => {
                        setIsFormOpen(open);
                        if (!open) setSelectedGasStation(null);
                    }}
                />

                {selectedGasStation && (
                    <DeleteConfirmation
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={confirmDelete}
                        title={`Delete ${selectedGasStation.name}`}
                        description={`Are you sure you want to delete ${selectedGasStation.name}? This action cannot be undone.`}
                    />
                )}
            </div>
        </AppLayout>
    );
}
