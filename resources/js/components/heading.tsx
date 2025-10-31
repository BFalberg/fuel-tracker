export default function Heading({ level = 1, title, description }: { level?: 1 | 2 | 3 | 4 | 5 | 6; title: string; description?: string }) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <>
            <div className="space-y-0.5">
                <Tag className="text-2xl font-semibold tracking-tight">{title}</Tag>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
        </>
    );
}
