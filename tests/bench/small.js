import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CounterComponent extends Component {
  @service router;

  @tracked count = 0;

  @action
  increment() {
    this.count++;
  }

  get isPositive() {
    return this.count > 0;
  }
}
