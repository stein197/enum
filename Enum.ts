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

	private static __nextId: number = 0;
	private static __values: Enum[];

	/** Unique entry id. Each instantiated entry has an id greater than previous by 1 */
	public readonly id: number;
	private __name: string | null = null;

	/**
	 * Unique name of the entry.
	 */
	public get name(): string {
		return this.__name ?? (this.__name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0]);
	}

	/**
	 * Creates a new enum constant.
	 * @param id Manually selected id for a new entry.
	 * @throws {@link Error} If id is manually set and it is less than 0 or less than the currently highest id across
	 *                       the enum.
	 */
	public constructor(id?: number) {
		const ctor = this.constructor as typeof Enum;
		if (id == void 0) {
			this.id = ctor.__nextId++;
		} else {
			if (id < 0)
				throw new Error(`Id ${id} cannot be less than 0`);
			if (id < ctor.__nextId)
				throw new Error(`Entry "${this.constructor.name}" with id ${id} may exist`);
			this.id = id;
			ctor.__nextId = id + 1;
		}
	}

	/**
	 * Returns an enum entry by its id.
	 * @param id Id of searched entry.
	 * @returns Entry or null if not found.
	 */
	public static from<T extends Enum>(this: Constructor<T>, id: number): T | null;
	
	/**
	 * Returns an enum entry by its name.
	 * @param name Name of searched entry.
	 * @returns Entry or null if not found.
	 */
	public static from<T extends Enum>(this: Constructor<T>, name: string): T | null;

	public static from<T extends Enum>(this: Constructor<T>, data: number | string): T | null {
		return (typeof data === "number" ? this.values().find(item => item.id === data) : this.values().find(item => item.name === data)) ?? null;
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
