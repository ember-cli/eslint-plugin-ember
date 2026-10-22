export default class ComponentBase<S extends { Args?: object } = object> {
  declare args: S['Args'];
}
