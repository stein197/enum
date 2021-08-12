export default class Enum<T extends {[key: string]: any}> {

	protected constructor(public readonly properties: T) {}
}
