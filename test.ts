import should from "should";
import mocha from "mocha";
import Enum from ".";

class Enum1 extends Enum {
	public static readonly Item1 = new Enum1();
	public static readonly Item2 = new Enum1();
}

class Enum2 extends Enum {
	public static readonly Item3 = new Enum2();
}

class EmptyEnum extends Enum {}

class EnumWithMembers extends Enum {
	public static readonly string = 'string';
	public static readonly First = new EnumWithMembers();
}

mocha.describe("Enum", () => {
	mocha.it("Enum.prototype.name is always accessible", () => should(Enum1.Item2.name).be.equal("Item2"));

	mocha.describe("Enum.values<T>()", () => {
		mocha.it("At empty enum returns empty array", () => should(EmptyEnum.values()).be.empty());
		mocha.it("Returns all entries in order they declared", () => should(Enum1.values()).be.eql([Enum1.Item1, Enum1.Item2]));
		mocha.it("Returns only enum entries without any other static fields", () => should(EnumWithMembers.values()).be.eql([EnumWithMembers.First]));
	});

	mocha.describe("Enum.from<T>(name)", () => {
		mocha.it("Enum.from(<name>) with existing name returns entry", () => should(Enum1.from("Item1")).be.eql(Enum1.Item1));
		mocha.it("Enum.from(<name>) with non-existent name returns null", () => should(Enum1.from("Not existing")).be.null());
		mocha.it("Enum.from(\"\") returns null", () => should(Enum1.from("")).be.null());
	});
});
