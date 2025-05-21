export function canonicalEmail(raw: string): string {
	const [local, domain] = raw.trim().toLowerCase().split("@");
	return `${local}@${domain.normalize("NFC")}`;
}
