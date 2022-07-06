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

class Status extends Enum {

	public static readonly Ok = new Status(200, "Ok");
	public static readonly NotFound = new Status(404, "Not found");
	public static readonly InternalServerError = new Status(500, "Internal server error");

	public constructor(public readonly code: number, public readonly message: string) {}

	// Since it's a regular class, methods can be used as well
	public getMessage(): string {
		return this.message;
	}
}

// Unique properties
Status.NotFound.name; // "NOT_FOUND"

// Custom properties and methods
Status.Ok.message; // "Ok"
Status.Ok.getMessage(); // "Ok"

// Retrieving arbitrary data
Status.values(); // [Status.Ok, Status.NotFound, Status.InternalServerError]
Status.from("NotFound"); // By name: Status.NotFound
Status.from("Nonexistent"); // null
```

## NPM scripts
 - `clean` Cleans compiled files
 - `build`, `build:dev` Builds the project
 - `test` Runs all unit tests
