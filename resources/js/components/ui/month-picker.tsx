import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MonthPickerProps {
    value: string;
    onChange: (value: string) => void;
    max?: string;
    min?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseYM(ym: string): [number, number] {
    const [y, m] = ym.split('-').map(Number);
    return [y, m];
}

function formatYM(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}

export function MonthPicker({ value, onChange, max, min }: MonthPickerProps) {
    const [selectedYear, setSelectedYear] = useState(() => parseYM(value)[0]);
    const [open, setOpen] = useState(false);

    const [selYear, selMonth] = parseYM(value);
    const [maxYear, maxMonth] = max ? parseYM(max) : [9999, 12];
    const [minYear, minMonth] = min ? parseYM(min) : [0, 1];

    const isDisabled = (year: number, month: number) => {
        const ym = year * 12 + month;
        return ym > maxYear * 12 + maxMonth || ym < minYear * 12 + minMonth;
    };

    const label = new Date(selYear, selMonth - 1).toLocaleDateString('da-DK', { month: 'short', year: 'numeric' });

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (next) setSelectedYear(selYear);
                setOpen(next);
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 justify-start font-normal">
                    {label}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
                {/* Year navigation */}
                <div className="mb-3 flex items-center justify-between">
                    <button
                        onClick={() => setSelectedYear((y) => y - 1)}
                        disabled={isDisabled(selectedYear - 1, 12)}
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">{selectedYear}</span>
                    <button
                        onClick={() => setSelectedYear((y) => y + 1)}
                        disabled={isDisabled(selectedYear + 1, 1)}
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Month grid */}
                <div className="grid grid-cols-3 gap-1">
                    {MONTHS.map((name, i) => {
                        const month = i + 1;
                        const disabled = isDisabled(selectedYear, month);
                        const selected = selectedYear === selYear && month === selMonth;
                        return (
                            <button
                                key={month}
                                disabled={disabled}
                                onClick={() => {
                                    onChange(formatYM(selectedYear, month));
                                    setOpen(false);
                                }}
                                className={cn(
                                    'rounded-md py-1.5 text-xs transition-colors',
                                    selected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                                    disabled && 'pointer-events-none opacity-30',
                                )}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
