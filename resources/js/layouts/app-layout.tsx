import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
        <div className="fixed -z-10">
            <svg width="359" height="470" viewBox="0 0 359 470" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_4_1777)">
                    <ellipse cx="7.5" cy="118" rx="257.5" ry="258" fill="#34D399" fill-opacity="0.1" />
                </g>
                <defs>
                    <filter
                        id="filter0_f_4_1777"
                        x="-344"
                        y="-234"
                        width="703"
                        height="704"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="47" result="effect1_foregroundBlur_4_1777" />
                    </filter>
                </defs>
            </svg>
        </div>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </>
);
