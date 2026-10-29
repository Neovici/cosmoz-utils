/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Adapted from packages/lit-html/src/directives/live.ts as in lit/lit#4763
 * (plumelo/lit @ live-custom-equality): renames + published-package import
 * paths only, plus the two exported predicates below. Kept as a local
 * directive until that PR merges upstream.
 */

import { noChange, nothing } from 'lit-html';
import {
	isSingleExpression,
	setCommittedValue,
} from 'lit-html/directive-helpers.js';
import {
	AttributePart,
	Directive,
	DirectiveParameters,
	PartInfo,
	PartType,
	directive,
} from 'lit-html/directive.js';

type ValidPartType = 1 | 3 | 4;
type EqualFn = (value: unknown, elementValue: unknown) => boolean;

const defaults: Record<ValidPartType, EqualFn> = {
	[PartType.PROPERTY]: (value, elementValue) => value === elementValue,
	[PartType.BOOLEAN_ATTRIBUTE]: (value, elementValue) =>
		!!value === elementValue,
	[PartType.ATTRIBUTE]: (value, elementValue) => elementValue === String(value),
};

class LiveEqDirective extends Directive {
	constructor(partInfo: PartInfo) {
		super(partInfo);
		if (
			!(
				partInfo.type === PartType.PROPERTY ||
				partInfo.type === PartType.ATTRIBUTE ||
				partInfo.type === PartType.BOOLEAN_ATTRIBUTE
			)
		) {
			throw new Error(
				'The `liveEq` directive is not allowed on child or event bindings',
			);
		}
		if (!isSingleExpression(partInfo)) {
			throw new Error('`liveEq` bindings can only contain a single expression');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(value: unknown, _equal?: EqualFn) {
		return value;
	}

	override update(
		part: AttributePart & {
			readonly type: ValidPartType;
		},
		[value, equal = defaults[part.type]]: DirectiveParameters<this>,
	) {
		if (value === noChange || value === nothing) {
			return value;
		}

		const { type, name, element } = part;

		// (lit#4763 writes this as a nested ternary; this repo's lint rules
		// forbid nesting — the semantics are identical.)
		let currentValue: unknown;
		if (type === PartType.PROPERTY) {
			currentValue = element[name as keyof typeof element];
		} else if (type === PartType.ATTRIBUTE) {
			currentValue = element.getAttribute(name);
		} else {
			currentValue = element.hasAttribute(name);
		}

		if (equal(value, currentValue)) {
			return noChange;
		}

		// Resets the part's value, causing its dirty-check to fail so that it
		// always sets the value.
		setCommittedValue(part);
		return value;
	}
}

/**
 * `live` with a customizable equality check (the design of lit/lit#4763, kept
 * locally until it merges upstream): the dirty check runs the bound value and
 * the live DOM value through `equal(value, elementValue)` instead of `===`.
 *
 * This exists for cases where the element normalizes the bound value
 * internally, where === never stabilizes: every render rewrites the element's
 * text and resets the caret.
 *
 * ```js
 * .value=${liveEq(value, stringEquals)}
 * ```
 *
 * With `eq` omitted this behaves exactly like `live` (the `defaults` table
 * preserves `live`'s per-part-type coercions).
 */
export const liveEq = directive(LiveEqDirective);

/**
 * The type of the class that powers this directive. Necessary for naming the
 * directive's return type.
 */
export type { LiveEqDirective };

/**
 * Shared equality predicates for `liveEq` (convenience, not part of the
 * lit#4763 design): the two common internal-normalization cases.
 */

/** String coercion equality: `2` and `'2'` are the same, `'2.'` and `2` are not. */
export const stringEquals: EqualFn = (value, elementValue) =>
	String(value) === String(elementValue);

/**
 * Numeric coercion equality with NaN safety: `'2.'` and `2` are the same
 * number, and any two non-numbers (`'-', 'e', undefined`, ...) are equal to
 * each other so partially typed numbers are never blanked out.
 */
export const numericEquals: EqualFn = (value, elementValue) => {
	const blank = (v: unknown) =>
		v === undefined ||
		v === '' ||
		(typeof v === 'number' && Number.isNaN(v)) ||
		(typeof v === 'string' && Number.isNaN(Number(v)));
	if (blank(value) && blank(elementValue)) {
		return true;
	}
	if (blank(value) || blank(elementValue)) {
		return false;
	}
	const x = Number(value);
	const y = Number(elementValue);
	return x === y || (Number.isNaN(x) && Number.isNaN(y));
};
