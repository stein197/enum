import should from "should";
import mocha from "mocha";
import Enum from "./Enum";

class Status extends Enum {
	public static readonly Ok = new Status();
	public static readonly NotFound = new Status();
}

class State extends Enum {
	public static readonly Playing = new State();
}

class Empty extends Enum {}

class EnumWithMembers extends Enum {
	public static readonly test: string = 'test';
	public static readonly First = new EnumWithMembers();
}

mocha.describe("Enum<T>", () => {
	mocha.it("Field \"name\" is always accessible", () => {
		should(Status.NotFound.name).be.equal("NotFound");
	});

	mocha.it("Field \"id\" always increases", () => {
		should(Status.Ok.id).be.equal(0);
		should(Status.NotFound.id).be.equal(1);
	});

	mocha.it("Negative id throws an error", () => {
		should(() => {
			class Stub extends Enum {
				public static readonly First = new Stub(-1);
			}
		}).throw(/0/);
	});

	mocha.it("Id less or equal than highest throws error", () => {
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

	mocha.it("Id increases after manual setting", () => {
		class Stub extends Enum {
			public static readonly First = new Stub();
			public static readonly Second = new Stub(12);
			public static readonly Third = new Stub();
		}
		should(Stub.Third.id).be.equal(13);
	});

	mocha.it("Id always starts from 0", () => {
		should(Status.Ok.id).be.equal(0);
		should(State.Playing.id).be.equal(0);
	});

	mocha.it("Enum.values() at empty enum returns empty array", () => {
		should(Empty.values()).be.empty();
	});

	mocha.it("Enum.values() returns all entries", () => {
		should(Status.values()).be.eql([Status.Ok, Status.NotFound]);
	});

	mocha.it("Enum.values() returns only enum entries without any other static fields", () => {
		should(EnumWithMembers.values()).be.eql([EnumWithMembers.First]);
	});

	mocha.it("Enum.from(id) with existing id returns entry", () => {
		should(Status.from(0)).be.equal(Status.Ok);
	});

	mocha.it("Enum.from(id) with not existing id returns null", () => {
		should(Status.from(Number.MAX_VALUE)).not.be.ok();
	});

	mocha.it("Enum.from(id) with negative id returns null", () => {
		should(Status.from(-1)).not.be.ok();
	});

	mocha.it("Enum.from(name) with existing name returns entry", () => {
		should(Status.from("Ok")).be.eql(Status.Ok);
	});

	mocha.it("Enum.from(name) with not existing name returns null", () => {
		should(Status.from("Not Existing")).not.be.ok();
	});

	mocha.it("Enum.from(name) with empty string returns null", () => {
		should(Status.from("")).not.be.ok();
	});

	mocha.it.skip("Enum.constructor() can be overriden");
	mocha.it.skip("Overriden Enum.constructor() does not affect id creation");
	mocha.it.skip("Iterating through an empty enum does nothing");
	mocha.it.skip("Iterating through returns enum entries");
	mocha.it.skip("Iterating through does not include other static members than entries");
});
