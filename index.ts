export default abstract class Enum<T extends {[key: string]: any}> {

	private static __values: Enum<{}>[];
	private static __nextId: number = 0;

	private __name: Nullable<string> = null;

	public get name(): string {
		return this.__name || (this.__name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0]);
	}

	protected constructor(public readonly properties: T, public readonly id?: number) {
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

	public static values<T extends Enum<{}>>(): T[] {
		if (!this.__values) {
			const entries: [string, Enum<{}>][] = Object.entries(this).filter(entry => entry[1] instanceof this);
			this.__values = new Array(entries.length);
			for (const i in entries)
				this.__values[i] = entries[i][1];
		}
		return this.__values as T[];
	}

	public static from<T extends Enum<{}>>(id: number): Nullable<T>;

	public static from<T extends Enum<{}>>(name: string): Nullable<T>;

	public static from<T extends Enum<{}>>(properties: Partial<T["properties"]>): Nullable<T>;

	public static from<T extends Enum<{}>>(data: number | string | Partial<T["properties"]>): Nullable<T> {
		const values = this.values<T>();
		if (typeof data === "number") {
			return values.find(entry => entry.id === data);
		} else if (typeof data === "string") {
			return values.find(entry => entry.name === data);
		} else {
			const matched = values.filter(entry => Object.entries(data).every(property => property[0] in entry.properties));
			return matched.length === 1 ? matched[0] : null;
		}
	}
}

type Nullable<T> = T | null | undefined;