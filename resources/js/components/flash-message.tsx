import { Alert, AlertDescription } from '@/components/ui/alert';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Renders the `success` flash message that controllers set on redirect.
 */
export default function FlashMessage() {
    const { flash } = usePage<SharedData>().props;
    const success = flash?.success;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!success) {
            setVisible(false);

            return;
        }

        setVisible(true);
        const timeout = setTimeout(() => setVisible(false), 4000);

        return () => clearTimeout(timeout);
    }, [success]);

    if (!success || !visible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 top-4 z-50 mx-auto w-fit max-w-[90vw] px-4">
            <Alert className="bg-background shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription>{success}</AlertDescription>
            </Alert>
        </div>
    );
}
