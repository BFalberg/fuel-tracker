import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Gauge, MapPin, PiggyBank, Zap } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login } from '@/routes';

const features = [
    {
        icon: MapPin,
        title: 'Log a charge in seconds',
        description:
            'Your car, the nearest station and the last odometer reading are filled in for you.',
    },
    {
        icon: PiggyBank,
        title: 'Know what driving costs',
        description:
            'Price per km and per kWh, with the charging subscription counted in.',
    },
    {
        icon: Gauge,
        title: 'See efficiency through the seasons',
        description:
            'kWh per 100 km, month by month, from summer highs to winter lows.',
    },
];

/** Illustrative bar heights for the decorative efficiency chart. */
const bars = [52, 48, 50, 49, 58, 70];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-primary-foreground">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklch,var(--accent)_18%,transparent)_1px,transparent_0)] [mask-image:linear-gradient(to_bottom,black,transparent_70%)] bg-[size:24px_24px]"
                />

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10 px-6 py-12">
                    <section className="flex flex-col items-center gap-6 text-center">
                        <div className="relative">
                            <div
                                aria-hidden
                                className="absolute inset-0 rounded-[22%] bg-accent/40 blur-xl"
                            />
                            <AppLogoIcon className="relative size-20 ring-1 ring-accent/30" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                                Fuel Tracker
                            </p>
                            <h1 className="text-4xl font-semibold tracking-tight text-balance">
                                Every charge,{' '}
                                <span className="bg-gradient-to-r from-accent to-emerald-200 bg-clip-text text-transparent">
                                    counted.
                                </span>
                            </h1>
                            <p className="text-base text-pretty text-primary-foreground/70">
                                A private logbook for your car's charging, costs
                                and consumption.
                            </p>
                        </div>
                    </section>

                    <div
                        aria-hidden
                        className="rounded-2xl border border-accent/15 bg-white/[0.03] p-5 shadow-2xl shadow-black/30 backdrop-blur"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-primary-foreground/60">
                                    Efficiency
                                </p>
                                <p className="text-2xl font-semibold">
                                    18.3{' '}
                                    <span className="text-sm font-normal text-primary-foreground/60">
                                        kWh/100km
                                    </span>
                                </p>
                            </div>
                            <div className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                                <Zap className="size-4" />
                            </div>
                        </div>
                        <div className="mt-5 flex h-20 items-end gap-2">
                            {bars.map((height, index) => (
                                <div
                                    key={index}
                                    style={{ height: `${height}%` }}
                                    className={
                                        index === bars.length - 1
                                            ? 'flex-1 rounded-md bg-accent'
                                            : 'flex-1 rounded-md bg-accent/25'
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <ul className="flex flex-col gap-3">
                        {features.map(({ icon: Icon, title, description }) => (
                            <li
                                key={title}
                                className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                                    <Icon className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">{title}</p>
                                    <p className="text-sm text-primary-foreground/60">
                                        {description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                        >
                            {auth.user ? 'Open dashboard' : 'Log in'}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <p className="text-xs text-primary-foreground/40">
                            Invite only
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
