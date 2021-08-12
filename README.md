# Complex enum implementation for TypeScript
TypeScript provides a very simple and primitive implementation of enumerations. All you can do with native implementation is to declare numeric or string enum values. But sometimes there is a need of more complex enumerations - that have properties or even methods. This package provides such an implementation that exists in Java and PHP.

## Installation
```
npm install @stein197/ts-enum
```

## Usage
The package provides only one simple class that all complex enums must extend from - `Enum`. Assume that there is an enum `Status` which represents XHR statuses. It could be written as follows in native TypeScript enums:
```ts
enum Status {
	UNSENT,
	OPENED,
	HEADERS_RECEIVED,
	LOADING,
	DONE
}
```

Let's say that we need to display status on a page so people could see it. We could create second enum for such a purpose:
```ts
enum StatusLabel {
	UNSENT = "Request is unsent",
	OPENED = "Request is opened"
	// ...
}
```

And it grows and grows. Instead, use complex enumerations like this:
```ts
import Enum from "@stein197/ts-enum";

class Status extends Enum<{label: string, code: number}> {
	public static readonly UNSENT = new Status({label: "Request is insent", code: 0});
	public static readonly OPENED = new Status({label: "Request is opened", code: 1});
	// ...
}
```

That's it! Later yuou can retrieve neccessary data and even name from entries:
```ts
Status.UNSENT.properties.label; // "Request is unsent"
Status.UNSENT.name; // "UNSENT"
```

If you need to get all available constants, call `values()` on an enum class which will return an array of entries in order they declared:
```ts
Status.values(); // [Status.UNSENT, Status.OPENED, ...]
```

In case if you need to retrieve enum entry by it's name or properties, call `from()` on an enum class:
```ts
Status.from("DONE"); // Status.DONE
Status.from({label: "done", status: 4}); // Status.DONE
Status.from("NONEXISTENT"); // null
```
