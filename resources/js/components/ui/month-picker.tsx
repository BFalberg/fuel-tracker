import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MonthPickerProps {
    value: string;
    onChange: (value: string) => void;
    max?: string;
    min?: string;
    label?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseYM(ym: string): [number, number] {
    const [y, m] = ym.split('-').map(Number);
    return [y, m];
}

function formatYM(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Opens as a bottom sheet rather than a popover: an edge-anchored popover puts
 * the month grid wherever the trigger happens to sit, while a sheet always
 * lands in thumb reach with room for 44px cells.
 */
export function MonthPicker({ value, onChange, max, min, label = 'Select month' }: MonthPickerProps) {
    const [selectedYear, setSelectedYear] = useState(() => parseYM(value)[0]);
    const [open, setOpen] = useState(false);

    const [selYear, selMonth] = parseYM(value);
    const [maxYear, maxMonth] = max ? parseYM(max) : [9999, 12];
    const [minYear, minMonth] = min ? parseYM(min) : [0, 1];

    const isDisabled = (year: number, month: number) => {
        const ym = year * 12 + month;
        return ym > maxYear * 12 + maxMonth || ym < minYear * 12 + minMonth;
    };

    const triggerLabel = new Date(selYear, selMonth - 1).toLocaleDateString('da-DK', { month: 'short', year: 'numeric' });

    return (
        <Drawer
            open={open}
            onOpenChange={(next) => {
                if (next) {
                    setSelectedYear(selYear);
                }
                setOpen(next);
            }}
        >
            <Button variant="outline" className="flex-1 justify-start font-normal" onClick={() => setOpen(true)}>
                {triggerLabel}
            </Button>
            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="text-muted-foreground text-sm font-normal">{label}</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    {/* Year navigation */}
                    <div className="mb-3 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedYear((y) => y - 1)}
                            disabled={isDisabled(selectedYear - 1, 12)}
                            aria-label="Previous year"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <span className="text-base font-medium">{selectedYear}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedYear((y) => y + 1)}
                            disabled={isDisabled(selectedYear + 1, 1)}
                            aria-label="Next year"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-2">
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
                                        'min-h-12 rounded-md text-sm transition-colors',
                                        selected ? 'bg-accent text-accent-foreground font-medium' : 'bg-input active:bg-accent/20',
                                        disabled && 'pointer-events-none opacity-30',
                                    )}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
