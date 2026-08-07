export function formatPrice(amount: number): string {
  return `${amount.toFixed(amount % 1 === 0 ? 0 : 2)} ر.س`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
