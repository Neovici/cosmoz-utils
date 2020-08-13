import { directive } from 'lit-html';

export const ref = directive(ref => part => {
	// support both AttributePart and NodePart
	ref.current = part?.committer?.element || part?.startNode?.parentNode;
});
