export default abstract class Enum<T extends {[key: string]: any}> {

	private _name: string;
	private static _values: Enum<{}>[];

	public get name(): string {
		if (!this._name)
			this._name = Object.entries(this.constructor).filter(entry => entry[1] === this)[0][0];
		return this._name;
	}

	public static get values(): Enum<{}>[] {
		if (!this._values) {
			const entries: [string, Enum<{}>][] = Object.entries(this);
			this._values = new Array(entries.length);
			for (const i in entries)
				this._values[i] = entries[i][1];
		}
		return this._values;
	}

	protected constructor(public readonly properties: T) {}

	public static readonly from = <T>(data: string | T): Enum<{}> => typeof data === "string" ? (this as any)[data] : this.values.filter(entry => this.objectsAreEqual(data, entry.properties))[0];

	private static objectsAreEqual<T>(obj1: T, obj2: T): boolean {
		for (const [key] of Object.entries(obj1))
			if ((obj1 as any)[key] !== (obj2 as any)[key])
				return false;
		return true;
	}
}
