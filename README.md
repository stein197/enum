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

// Every enum entry that is going to be created will have inner unique numeric id and name properties
class Status extends Enum {
	public static readonly OK = new Status(200, "Ok");
	public static readonly NOT_FOUND = new Status(404, "Not found");
	public static readonly INTERNAL_SERVER_ERROR = new Status(500, "Internal server error", 500); // Manually set entry id

	// Constructor can be omitted. In such a case only items with numberic ids will be created
	public constructor(public readonly code: number, public readonly message: string, id?: number) {
		super(id);
	}

	// Since it's a regular class, methods can be used as well
	public getName(): string {
		return this.name;
	}
}

// Unique properties
Status.OK.id; // 0
Status.NOT_FOUND.name; // "NOT_FOUND"
Status.INTERNAL_SERVER_ERROR.id; // 500

// Custom properties and methods
Status.OK.message; // "Ok"
Status.OK.getName(); // "OK"

// Retrieving arbitrary data
Status.values(); // [Status.OK, Status.NOT_FOUND, Status.INTERNAL_SERVER_ERROR]
Status.from(0); // By id: Status.OK
Status.from("NOT_FOUND"); // By name: Status.NOT_FOUND
Status.from("NONEXISTENT"); // null
```

## NPM scripts
 - `clean` Cleans compiled files
 - `build`, `build:dev` Builds the project
 - `test` Runs all unit tests
