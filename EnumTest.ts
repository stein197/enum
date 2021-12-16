import should from "should";
import mocha from "mocha";
import Enum from "./Enum";

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

	mocha.describe("Enum.prototype.id", () => {
		mocha.it("Always increases", () => should(Enum1.Item2.id).be.equal(1));
	
		mocha.it("Negative one throws an error", () => {
			should(() => {
				class Stub extends Enum {
					public static readonly First = new Stub(-1);
				}
			}).throw(/0/);
		});
	
		mocha.it("Less than or equal to highest one throws an error", () => {
			should(() => {
				class Stub extends Enum {
					public static readonly First = new Stub();
					public static readonly Second = new Stub();
					public static readonly Third = new Stub(1);
				}
			}).throw();
			should(() => {
				class Stub extends Enum {
					public static readonly First = new Stub();
					public static readonly Second = new Stub();
					public static readonly Third = new Stub(0);
				}
			}).throw();
		});
	
		mocha.it("Increases after manual setting", () => {
			class Stub extends Enum {
				public static readonly First = new Stub();
				public static readonly Second = new Stub(12);
				public static readonly Third = new Stub();
			}
			should(Stub.Third.id).be.equal(13);
		});
	
		mocha.it("Id always starts from 0", () => {
			should(Enum1.Item1.id).be.equal(0);
			should(Enum2.Item3.id).be.equal(0);
		});
	});


	mocha.describe("Enum.constructor()", () => {

		mocha.it("Enum.constructor() can be overriden", () => {
			class Stub extends Enum {
				static Item = new Stub("Ok");
				constructor(public readonly code: string, id?: number) {
					super(id);
				}
			}
			should(Stub.Item.code).be.eql("Ok");
		});

		mocha.it("Overriden Enum.constructor() does not affect id creation", () => {
			class Stub extends Enum {
				static Item1 = new Stub("Ok");
				static Item2 = new Stub("Ok2");
				static Item3 = new Stub("Ok3", 5);
				static Item4 = new Stub("Ok4");
				constructor(public readonly code: string, id?: number) {
					super(id);
				}
			}
			should(Stub.Item1.id).be.eql(0);
			should(Stub.Item2.id).be.eql(1);
			should(Stub.Item3.id).be.eql(5);
			should(Stub.Item4.id).be.eql(6);
		});
	});

	mocha.describe("Enum.values<T>()", () => {
		mocha.it("At empty enum returns empty array", () => should(EmptyEnum.values()).be.empty());
		mocha.it("Returns all entries in order they declared", () => should(Enum1.values()).be.eql([Enum1.Item1, Enum1.Item2]));
		mocha.it("Returns only enum entries without any other static fields", () => should(EnumWithMembers.values()).be.eql([EnumWithMembers.First]));
	});

	mocha.describe("Enum.from<T>(id)", () => {
		mocha.it("Enum.from(0) returns the first entry", () => should(Enum1.from(0)).be.equal(Enum1.Item1));
		mocha.it("Enum.from(<id>) with existing id returns entry", () => should(Enum1.from(1)).be.equal(Enum1.Item2));
		mocha.it("Enum.from(<id>) with non-existent id returns null", () => should(Enum1.from(Number.MAX_VALUE)).be.null());
		mocha.it("Enum.from(<id>) with negative id returns null", () => should(Enum1.from(-1)).be.null());
	});

	mocha.describe("Enum.from<T>(name)", () => {
		mocha.it("Enum.from(<name>) with existing name returns entry", () => should(Enum1.from("Item1")).be.eql(Enum1.Item1));
		mocha.it("Enum.from(<name>) with non-existent name returns null", () => should(Enum1.from("Not existing")).be.null());
		mocha.it("Enum.from(\"\") returns null", () => should(Enum1.from("")).be.null());
	});
});
