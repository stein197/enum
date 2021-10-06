/**
 * Base class for all complex enums. Basically it's a replacement for primitive TypeScript enums with support of
 * properties, methods and other features. Basic usage is:
 * ```ts
 * class Status extends Enum<{code: number; message: string}> {
 *     public static readonly OK = new Status({code: 200, message: "Ok"});
 *     public static readonly NOT_FOUND = new Status({code: 404, message: "Not found"});
 *     // ...
 * }
 * ```
 * @paramType T - Map of properties that the current enumeration can have.
 */
export default abstract class Enum<T extends {[key: string]: any}> {

	private static __values: Enum<{}>[];
	private static __nextId: number = 0;

	/** Unique entry id. Each instantiated entry has an id greater by previous by 1 */
	public readonly id: number;
	private __name: Nullable<string> = null;

	/**
	 * Unique name of the entry. Equals to entry name.
	 */
	public get name(): string {
		return this.__name || (this.__name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0]);
	}

	/**
	 * Create new enum "constant".
	 * @param properties Properties that current entry will have.
	 * @param id Manually selected id for a new entry.
	 * @throws {@link Error} If id is manually set and it is less than 0 or the currently highest id across the enum.
	 */
	protected constructor(public readonly properties: T, id?: number) {
		const ctor = this.constructor as typeof Enum;
		if (id == undefined) {
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
	 * Return all entries that current enumeration have. It is worth specifying the type.
	 * @returns All entries of clling enumeration in order they declared.
	 */
	public static values<T extends Enum<{}>>(): T[] {
		if (!this.__values) {
			const entries: [string, Enum<{}>][] = Object.entries(this).filter(entry => entry[1] instanceof this);
			this.__values = new Array(entries.length);
			for (const i in entries)
				this.__values[i] = entries[i][1];
		}
		return this.__values as T[];
	}

	/**
	 * Returns enum entry by its id.
	 * @param id Id of searched entry.
	 * @returns Entry or undefined if not found.
	 */
	public static from<T extends Enum<{}>>(id: number): Nullable<T>;
	
	/**
	 * Returns enum entry by its name.
	 * @param name Name of searched entry.
	 * @returns Entry or undefined if not found.
	 */
	public static from<T extends Enum<{}>>(name: string): Nullable<T>;
	
	/**
	 * Returns enum entry by properties.
	 * @param properties Properties of searched entry. Properties does not have to match the signature exactly. For
	 *                   example if enum has three fields in properties and one of them is unique (like id) then an
	 *                   object with only this key can be passed. The same if there are two uniue keys and so on.
	 * @returns Entry or undefined if not found or if more than one entries match passed properties.
	 */
	public static from<T extends Enum<{}>>(properties: Partial<T["properties"]>): Nullable<T>;

	public static from<T extends Enum<{}>>(data: number | string | Partial<T["properties"]>): Nullable<T> {
		const values = this.values<T>();
		if (typeof data === "number") {
			return values.find(entry => entry.id === data);
		} else if (typeof data === "string") {
			return values.find(entry => entry.name === data);
		} else {
			const matched = values.filter(entry => Object.entries(data).every(property => property[0] in entry.properties && (entry.properties as any)[property[0]] === property[1]));
			return matched.length === 1 ? matched[0] : null;
		}
	}
}

type Nullable<T> = T | null | undefined;
