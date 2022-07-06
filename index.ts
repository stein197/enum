/**
 * Base class for all complex enums. Basic usage is:
 * ```ts
 * class Status extends Enum {
 *     public static readonly OK = new Status(200, "Ok");
 *     public static readonly NOT_FOUND = new Status(404, "Not found");
 *     // ...
 * }
 * ```
 */
export default abstract class Enum {

	private static __values: Enum[];

	private __name: string | null = null;

	/**
	 * Unique name of the entry.
	 */
	public get name(): string {
		return this.__name ?? (this.__name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0]);
	}

	/**
	 * Returns an enum entry by its name.
	 * @param name Name of searched entry.
	 * @returns Entry or null if not found.
	 */
	public static from<T extends Enum>(this: Constructor<T>, name: string): T | null {
		return this.values().find(item => item.name === name) ?? null;
	}

	/**
	 * Returns all entries that the current enum have. Does not return other static fields.
	 * @returns All entries of the current enum in order they declared.
	 */
	public static values<T extends Enum>(this: Constructor<T>): T[] {
		return (this.__values ?? (this.__values = Object.values(this).filter(item => item instanceof this))) as T[];
	}
}

type Constructor<T extends Enum> = typeof Enum & {
	new (...args: any[]): T;
}
