import should from "should";
import mocha from "mocha";
import {Enum} from ".";

class Status extends Enum<{code: number; message: string}> {
	public static readonly Ok = new Status({code: 200, message: "OK"});
	public static readonly NotFound = new Status({code: 404, message: "Not found"});
}

class State extends Enum<{}> {
	public static readonly Playing = new State({});
}

class Empty extends Enum<{}> {}

class EnumWithMembers extends Enum<{}> {
	public static readonly test: string = 'test';
	public static readonly First = new EnumWithMembers({});
}

class EnumMultiEntry extends Enum<{n: number; s: string}> {
	public static readonly First = new EnumMultiEntry({n: 1, s: "a"});
	public static readonly Second = new EnumMultiEntry({n: 2, s: "b"});
	public static readonly Third = new EnumMultiEntry({n: 1, s: "ab"});
}

mocha.describe("Enum<T>", () => {
	mocha.it("Field \"name\" is always accessible", () => {
		should(Status.NotFound.name).be.equal("NotFound");
	});

	mocha.it("Field \"id\" always increases", () => {
		should(Status.Ok.id).be.equal(0);
		should(Status.NotFound.id).be.equal(1);
	});

	mocha.it("Negative id throws error", () => {
		should(() => {
			class Stub extends Enum<{}> {
				public static readonly First = new Stub({}, -1);
			}
		}).throw(/0/);
	});

	mocha.it("Id less or equal than highest throws error", () => {
		should(() => {
			class Stub extends Enum<{}> {
				public static readonly First = new Stub({});
				public static readonly Second = new Stub({});
				public static readonly Third = new Stub({}, 1);
			}
		}).throw();
		should(() => {
			class Stub extends Enum<{}> {
				public static readonly First = new Stub({});
				public static readonly Second = new Stub({});
				public static readonly Third = new Stub({}, 0);
			}
		}).throw();
	});

	mocha.it("Id increases after manual setting", () => {
		class Stub extends Enum<{}> {
			public static readonly First = new Stub({});
			public static readonly Second = new Stub({}, 12);
			public static readonly Third = new Stub({});
		}
		should(Stub.Third.id).be.equal(13);
	});

	mocha.it("Id always starts from 0", () => {
		should(Status.Ok.id).be.equal(0);
		should(State.Playing.id).be.equal(0);
	});

	mocha.it("Enum.values<T>() at empty enum returns empty array", () => {
		should(Empty.values<Empty>()).be.empty();
	});

	mocha.it("Enum.values<T>() returns all entries", () => {
		should(Status.values<Status>()).be.eql([Status.Ok, Status.NotFound]);
	});

	mocha.it("Enum.values<T>() returns only enum entries without any other static fields", () => {
		should(EnumWithMembers.values()).be.eql([EnumWithMembers.First]);
	});

	mocha.it("Enum.from<T>(number) with existing id returns entry", () => {
		should(Status.from(0)).be.equal(Status.Ok);
	});

	mocha.it("Enum.from<T>(number) with not existing id returns null", () => {
		should(Status.from(Number.MAX_VALUE)).not.be.ok();
	});

	mocha.it("Enum.from<T>(number) with negative id returns null", () => {
		should(Status.from(-1)).not.be.ok();
	});

	mocha.it("Enum.from<T>(string) with existing name returns entry", () => {
		should(Status.from("Ok")).be.eql(Status.Ok);
	});

	mocha.it("Enum.from<T>(string) with not existing name returns null", () => {
		should(Status.from("Not Existing")).not.be.ok();
	});

	mocha.it("Enum.from<T>(string) with empty string returns null", () => {
		should(Status.from("")).not.be.ok();
	});

	mocha.it("Enum.from<T>({}) with empty object returns null", () => {
		should(Status.from<Status>({})).not.be.ok();
	});

	mocha.it("Enum.from<T>({}) with partial object returns entry if it's only one", () => {
		should(Status.from<Status>({code: 200})).be.eql(Status.Ok);
	});

	mocha.it("Enum.from<T>({}) with partial object returns null if there are more than one entry", () => {
		should(EnumMultiEntry.from<EnumMultiEntry>({n: 1})).not.be.ok();
	});

	mocha.it("Enum.from<T>({}) with not existing object returns null", () => {
		should(Status.from<Status>({code: Number.MAX_VALUE})).not.be.ok();
	});

	mocha.it("Enum.from<T>({}) with redundant object key returns null", () => {
		should(Status.from({code: 200, notExistingKey: "string"})).not.be.ok();
	});
});
