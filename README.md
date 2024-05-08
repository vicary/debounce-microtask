# DebounceMicrotask

Debounce a function using microtasks instead of timers.

## Usage

```typescript
import { debounceMicrotask } from "@vicary/debounce-microtask";

const debounced = debounceMicrotask((text: string) => {
  console.log("debounced", text);
});

debounced("a");
debounced("b");
debounced("c");

await Promise.resolve();

// Prints "debounced a"
```

### Options

#### debounceLimit

Throws when the specified limit is reached before the function is run, this is a
safety measure preventing recursive debounces. You may disable it with
`Infinity`.

Defaults to 1000.

```typescript
import { debounceMicrotask } from "@vicary/debounce-microtask";

const debounced = debounceMicrotask(
  (text: string) => {
    console.log("debounced", text);
  },
  { debounceLimit: 1 },
);

debounced("a");

debounced("b"); // Throws
```

### updateArguments

Updates the calling arguments to the latest invocation.

Defaults to `false`.

```typescript
import { debounceMicrotask } from "@vicary/debounce-microtask";

const debounced = debounceMicrotask(
  (text: string) => {
    console.log("debounced", text);
  },
  { updateArguments: true },
);

debounced("a");
debounced("b");
debounced("c");

await Promise.resolve();

// Prints "debounced c"
```
