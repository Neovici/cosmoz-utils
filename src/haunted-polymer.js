import {
	BaseScheduler, render
} from 'haunted';

class Scheduler extends BaseScheduler {
	constructor(renderer, host, commitCallback) {
		super(renderer, host);
		this._commit = commitCallback;
	}

	commit(result) {
		this._commit(result);
	}
}

/**
 * Creates a mixin that mixes a haunted hook with a polymer component.
 *
 * @param {String} outputPath The property where the result of the hook will be stored (deprecated)
 * @param {Function} hook A haunted hook
 * @returns {Function} The mixin
 */
export const hauntedPolymer = (outputPath, hook) => base => {
	const hasOutputPath = hook !== undefined,
		_hook = hasOutputPath ? hook : outputPath;

	// TODO: drop outputPath support after all usages are fixed.
	if (hasOutputPath) {
		// eslint-disable-next-line no-console
		console.warn('Haunted Polymer: use of outputPath is deprecated. Instead have the hook return an object with the keys being property names to update.');
	}

	return class extends base {
		constructor() {
			super();

			this._scheduler = new Scheduler( // whenever the state is updated
				() => _hook(this), // run the hook with the element as input
				this, // using the element as state host
				result => hasOutputPath ? this.set(outputPath, result) : this.setProperties(result) // and update the output path with the results
			);
		}

		connectedCallback() {
			super.connectedCallback();
			this._scheduler.update();
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this._scheduler.teardown();
		}

		_propertiesChanged(currentProps, changedProps, oldProps) {
			super._propertiesChanged(currentProps, changedProps, oldProps);

			// skip haunted state update if the only thing that has changed is the hook output path
			if (hasOutputPath && Object.keys(changedProps).length === 1 && changedProps[outputPath] != null) {
				return;
			}

			// update haunted state only if a polymer prop has changed
			if (this._onlyHauntedPropertiesChanged(changedProps)) {
				return;
			}

			// trigger a haunted update loop
			// do it in the next animation frame, so the current loop finishes processing first
			cancelAnimationFrame(this._hauntedUpdateFrameHandle);
			this._hauntedUpdateFrameHandle = requestAnimationFrame(() => this._scheduler.update());
		}

		_onlyHauntedPropertiesChanged(changedProps) {
			const props = this.constructor.__properties;

			if (Object.keys(changedProps)
				.map(prop => prop.split('.')[0])
				// props updated by haunted are not listed or have the `haunted` flag
				.every(prop => props[prop] == null || props[prop].haunted)) {
				return true;
			}

			return false;
		}

		renderLitTo(part, outlet) {
			// render in the next animation frame to allow the haunted scheduler to finish processing the current state update
			// otherwise hooks might be updated twice
			cancelAnimationFrame(outlet.__renderAF);
			outlet.__renderAF = requestAnimationFrame(() => render(typeof part === 'function' ? part() : part, outlet));
		}
	};
};
