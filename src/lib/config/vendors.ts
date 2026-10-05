export const KNOWN_VENDORS = ["soroush", "rubika"] as const;

export type Vendor = (typeof KNOWN_VENDORS)[number];

export function isVendor(value: string): value is Vendor {
  return (KNOWN_VENDORS as readonly string[]).includes(value);
}

export function toVendors(values: readonly string[]): Vendor[] {
  return values.filter(isVendor);
}

export const VENDOR_LABELS: Record<Vendor, string> = {
  soroush: "سروش",
  rubika: "روبیکا",
};
