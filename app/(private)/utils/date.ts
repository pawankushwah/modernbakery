// server date to proper format
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("T")[0].split("-");
    return `${d}-${m}-${y}`;
}