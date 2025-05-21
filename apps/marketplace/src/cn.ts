// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Build className strings with clsx’s nice API,
 * then send the result through tailwind-merge so
 * later Tailwind utilities win (e.g. `p-4` vs `px-2`).
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
