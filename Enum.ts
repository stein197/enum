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
	private static __nextId: number = 0;
	private static __length: number;

	/** Unique entry id. Each instantiated entry has an id greater than previous by 1 */
	public readonly id: number;
	private __name: string | null = null;

	/**
	 * Unique name of the entry.
	 */
	public get name(): string {
		return this.__name || (this.__name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0]);
	}

	/**
	 * Creates a new enum constant.
	 * @param id Manually selected id for a new entry.
	 * @throws {@link Error} If id is manually set and it is less than 0 or less than the currently highest id across
	 *                       the enum.
	 */
	protected constructor(id?: number) {
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
	 * Returns all entries that the current enum have. Does not return other static fields.
	 * @returns All entries of the current enum in order they declared.
	 */
	public static values(): Enum[] {
		if (!this.__values) {
			const entries: [string, Enum][] = Object.entries(this).filter(entry => entry[1] instanceof this);
			this.__values = new Array(entries.length);
			for (const i in entries)
				this.__values[i] = entries[i][1];
		}
		return this.__values;
	}

	/**
	 * Returns an enum entry by its id.
	 * @param id Id of searched entry.
	 * @returns Entry or null if not found.
	 */
	public static from(id: number): Enum | null;
	
	/**
	 * Returns an enum entry by its name.
	 * @param name Name of searched entry.
	 * @returns Entry or null if not found.
	 */
	public static from(name: string): Enum | null;

	public static from(data: number | string): Enum | null {
		return (typeof data === "number" ? this.values().find(entry => entry.id === data) : this.values().find(entry => entry.name === data)) ?? null;
	}

	/**
	 * Returns total amount of the entries that the current enum has.
	 * @returns Amount of the entries.
	 */
	public static getLength(): number {
		return this.__length ?? (this.__length = this.values().length);
	}

	/**
	 * Calls the the enum is used in foreach loops
	 */
	public static *[Symbol.iterator](): Generator<Enum> {
		for (const item of this.values())
			yield item;
	}
}
