/**
 * Joins all arguments with a space
 * To, for example, combine multiple style names
 *
 * @returns {string}
 */
export function merge() {
	return [...arguments].join(" ");
}