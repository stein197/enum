# Complex enum implementation for JavaScript & TypeScript

## Installation
```
npm install @stein197/enum
```

## Motivation
TypeScript provides a very simple and primitive implementation of enumerations. All you can do with native implementation is to declare numeric or string enum values. But sometimes there is a need of more complex enumerations - that have properties or even methods. This package provides such an implementation that exists in Java and PHP.

## Usage
The package provides only one simple class `Enum` that all complex enums must extend from. Assume that there is an enum `Status` which represents HTTP statuses. Status can have status code and a message. In TypeScript it could be reached by creating two distinct enums. Instead, use complex enumerations like this:
```ts
import Enum from "@stein197/enum";

// Every enum entry that is going to be created will have inner unique numeric id
class Status extends Enum<{code: number; message: string}> {
	public static readonly OK = new Status({code: 200, message: "Ok"});
	public static readonly NOT_FOUND = new Status({code: 404, message: "Not found"});
	public static readonly INTERNAL_SERVER_ERROR = new Status({code: 500, message: "Internal server error"}, 500); // Manually set entry id
	// ...
	// Since it's a regular class, methods can be used as well
	public getLabel(): string {
		return this.properties.label;
	}
}

// Properties usage
Status.OK.properties.message; // "Ok"
Status.NOT_FOUND.name; // "NOT_FOUND"
Status.NOT_FOUND.id; // 2
Status.INTERNAL_SERVER_ERROR.id; // 500

// Returning of all the entries
Status.values<Status>(); // [Status.OK, Status.NOT_FOUND, Status.INTERNAL_SERVER_ERROR]

// Retrieving entries by data
Status.from<Status>(0); // By id: Status.OK
Status.from<Status>("NOT_FOUND"); // By name: Status.NOT_FOUND
Status.from<Status>({code: 500}); // By properties: Status.INTERNAL_SERVER_ERROR
Status.from<Status>("NONEXISTENT"); // null
```

## NPM scripts
 - `clean` Cleans compiled files
 - `build`, `build:dev` Builds the project
 - `test` Runs all unit tests
