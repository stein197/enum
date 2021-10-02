import * as should from "should";
import * as mocha from "mocha";
import Enum from ".";

mocha.describe("Enum<T>", () => {
	mocha.it("Field \"name\" is always accessible", () => {});
	mocha.it("Field \"id\" always increases", () => {});
	mocha.it("Negative id throws error", () => {});
	mocha.it("Id less than highest throws error", () => {});
	mocha.it("Id increases after manual setting", () => {});
	mocha.it("Id always starts from 0", () => {});
	mocha.it("Enum.values<T>() at empty enum returns empty array", () => {});
	mocha.it("Enum.values<T>() returns all entries", () => {});
	mocha.it("Enum.values<T>() returns only enum entries without any other static fields", () => {});
	mocha.it("Enum.values<T>() does not return entries from parent class", () => {});
	mocha.it("Enum.from<T>(number) with existing id returns entry", () => {});
	mocha.it("Enum.from<T>(number) with not existing id returns null", () => {});
	mocha.it("Enum.from<T>(number) with negative id returns null", () => {});
	mocha.it("Enum.from<T>(string) with existing name returns entry", () => {});
	mocha.it("Enum.from<T>(string) with not existing name returns null", () => {});
	mocha.it("Enum.from<T>(string) with empty string returns null", () => {});
	mocha.it("Enum.from<T>({}) with empty object returns null", () => {});
	mocha.it("Enum.from<T>({}) with partial object returns entry if it's only one", () => {});
	mocha.it("Enum.from<T>({}) with partial object returns null if there are more than one entry", () => {});
	mocha.it("Enum.from<T>({}) with not existing object returns null", () => {});
});
