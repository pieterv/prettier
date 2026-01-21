#### Fix parentheses preservation for `keyof` in array and indexed access types (#XXXX by @marcoww)

<!-- prettier-ignore -->
```jsx
// Input
type T = (keyof Foo)[];
type T2 = (keyof typeof obj)[];
type T3 = (keyof Foo)['bar'];

// Prettier stable
type T = keyof Foo[];
type T2 = keyof typeof obj[];
type T3 = keyof Foo['bar'];

// Prettier main
type T = (keyof Foo)[];
type T2 = (keyof typeof obj)[];
type T3 = (keyof Foo)['bar'];
```
