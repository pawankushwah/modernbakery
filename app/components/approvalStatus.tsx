"use client";

const statusStyles: Record<string, { text: string; bg: string }> = {
    "PENDING": { text: '#0B65C3', bg: '#E6F0FF' }, 
    "APPROVE": { text: '#92400E', bg: '#FFF7ED' }, 
    "REJECT": { text: '#027A48', bg: '#ECFDF3' },
};

export default function ApprovalStatus({ status }: { status: number | string }) {
    const style = statusStyles[String(status)] || { text: '#374151', bg: '#F3F4F6' };
    const inline = { color: style.text, backgroundColor: style.bg } as React.CSSProperties;

    return (
        <span style={inline} className={`text-sm font-medium p-1 px-4 rounded-xl text-[12px]`}>
            {status}
        </span>
    );
}
