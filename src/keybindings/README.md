# Keybindings

We use `activity` symbols to decouple the key combo from the key combo handler. Components define various activities and the app decides which keys trigger which activities.

Obligatory ASCII Venn diagram:

    [ app         {          ] component }
    [ key combo   { activity ]   handler }

## Example usage

```ts
// The component exports some activity symbols.
export const twist = Symbol('twist');

// The component defines handlers for each activity
useActivity({ activity: twist, callback: () => null, element: () => host }, []);
```

```ts
// The app defines the keybindings for each activity
const bindings: readonly KeyBinding[] = [
	[
		{ key: 'f', ctrlKey: true },
		[twist],
		{ title: 'ctrl + f', description: 'Do the twist!' },
	],
] as const;

const DemoKeybindings = () => {
	const register = useKeybindings(bindings);

	return html`<cosmoz-keybinding-provider .value=${register}>
		...
	</cosmoz-keybinding-provider>`;
};
```
