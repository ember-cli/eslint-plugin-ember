import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

interface Args {
  label: string;
}

export default class Counter extends Component<{ Args: Args }> {
  @tracked count = 0;

  increment = () => {
    this.count++;
  };

  <template>
    <button type="button" {{on "click" this.increment}}>
      {{@label}}: {{this.count}}
    </button>
  </template>
}
