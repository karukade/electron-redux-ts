import { ActionCreator } from 'redux';

export type AliasedAction = ActionCreator<{ type: string; payload?: any }>;
const aliases: { [name: string]: AliasedAction } = {};

export default {
  get: (key: string): AliasedAction => aliases[key],

  set: (key: string, value: AliasedAction): void => {
    aliases[key] = value;
  },
};
