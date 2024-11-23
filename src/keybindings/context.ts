import { createContext } from '@pionjs/pion';
import { noop } from '../function';
import { RegisterFn } from './types';

export const Keybindings = createContext<RegisterFn>(() => noop);

customElements.define('cosmoz-keybinding-provider', Keybindings.Provider);
