import ComponentBase from './component-stub';

export default class ComponentWithArgs extends ComponentBase<{
  Args: {
    /** @deprecated use newArg instead */
    oldArg: string;
    /** @deprecated */
    oldArgNoReason: string;
    newArg: string;
  };
}> {}
