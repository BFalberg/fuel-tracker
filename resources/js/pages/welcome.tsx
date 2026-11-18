import { Head, Link, usePage } from '@inertiajs/react';
import { Gauge, PiggyBank, Zap } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';

const features = [
    {
        icon: Zap,
        title: 'Log a charge in seconds',
        description:
            'Your car, nearest station and last reading are filled in for you.',
    },
    {
        icon: PiggyBank,
        title: 'Know what driving costs',
        description:
            'Price per km and per kWh, charging subscription included.',
    },
    {
        icon: Gauge,
        title: 'Watch efficiency change',
        description: 'kWh per 100 km, month by month, through every season.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
                <main className="flex w-full max-w-sm flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <AppLogoIcon className="size-12 fill-current text-foreground" />
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">
                                Fuel Tracker
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                A logbook for your car's charging, costs and
                                consumption.
                            </p>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-4">
                        {features.map(({ icon: Icon, title, description }) => (
                            <li key={title} className="flex gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Button asChild size="lg" className="w-full">
                        {auth.user ? (
                            <Link href={dashboard()}>Open dashboard</Link>
                        ) : (
                            <Link href={login()}>Log in</Link>
                        )}
                    </Button>
                </main>
            </div>
        </>
    );
}
