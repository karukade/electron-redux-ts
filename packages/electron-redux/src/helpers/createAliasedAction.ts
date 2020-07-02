import { ALIASED } from '../actions/alias';
import aliasRegistry, { AliasedAction } from '../registry/alias';

export type AliasedActionCreator<T extends AliasedAction> = (
  ...args: Parameters<T>
) => {
  type: typeof ALIASED;
  payload?: typeof args;
  meta?: {
    trigger: string;
  };
};

export default function createAliasedAction<T extends AliasedAction>(
  name: string,
  actionCreator: T
): AliasedActionCreator<T> {
  // register
  aliasRegistry.set(name, actionCreator);

  // factory
  return (...args) => ({
    type: ALIASED,
    payload: args,
    meta: {
      trigger: name,
    },
  });
}
