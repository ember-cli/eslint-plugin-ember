## v5.0.1 (2017-11-20)

#### :rocket: Enhancement
* [#144](https://github.com/ember-cli/eslint-plugin-ember/pull/144) Add destructuring support to `new-modules-import` rule. ([@clcuevas](https://github.com/clcuevas))
* [#151](https://github.com/ember-cli/eslint-plugin-ember/pull/151) Allow recognition of controller injection. ([@rmachielse](https://github.com/rmachielse))

#### :bug: Bug Fix
* [#184](https://github.com/ember-cli/eslint-plugin-ember/pull/184) Prevent error when destructured path is not in known globals.. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#178](https://github.com/ember-cli/eslint-plugin-ember/pull/178) Add Release instructions. ([@Turbo87](https://github.com/Turbo87))
* [#167](https://github.com/ember-cli/eslint-plugin-ember/pull/167) Added Yarn Install. ([@Alonski](https://github.com/Alonski))
* [#177](https://github.com/ember-cli/eslint-plugin-ember/pull/177) Add CHANGELOG. ([@Turbo87](https://github.com/Turbo87))
* [#176](https://github.com/ember-cli/eslint-plugin-ember/pull/176) Add myself to contributors. ([@jbandura](https://github.com/jbandura))

#### Committers: 6
- Alon Bukai ([Alonski](https://github.com/Alonski))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Robert Jackson ([rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
-
## v5.0.0 (2017-11-20)

* 📦 - Change `recommended` rule set to match `eslint` pattern of only including rules that prevent errors (and specifically excluding stylistic rules).
  * ❌  - Remove `alias-model-in-controller` from `ember/recommended` rule set.
  * ❌  - Remove `avoid-leaking-state-in-components` from `ember/recommended` rule set.
  * ❌  - Remove `named-functions-in-promises` from `ember/recommended` rule set.
  * ❌  - Remove `no-empty-attrs` from `ember/recommended` rule set.
  * ❌  - Remove `no-observers` from `ember/recommended` rule set.
  * ❌  - Remove `use-ember-get-and-set` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-components` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-controllers` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-models` from `ember/recommended` rule set.
  * ❌  - Remove `order-in-routes` from `ember/recommended` rule set.
  * ✅  - Add `avoid-leaking-state-in-ember-objects` to `ember/recommended` rule set.
  * ✅  - Add `new-module-imports` to `ember/recommended` rule set.
  * ✅  - Add `no-attrs-in-components` to `ember/recommended` rule set.
  * ✅  - Add `no-duplicate-dependent-keys` from `ember/recommended` rule set.
  * ✅  - Add `no-global-jquery` to `ember/recommended` rule set.
  * ✅  - Add `no-old-shims` to `ember/recommended` rule set.
  * ✅  - Add `require-super-in-init` to `ember/recommended` rule set.

#### :boom: Breaking Change
* [#173](https://github.com/ember-cli/eslint-plugin-ember/pull/173) Disable `order-in-*` rules by default. ([@Turbo87](https://github.com/Turbo87))
* [#174](https://github.com/ember-cli/eslint-plugin-ember/pull/174) Disable and deprecate `avoid-leaking-state-in-components` rule. ([@Turbo87](https://github.com/Turbo87))
* [#146](https://github.com/ember-cli/eslint-plugin-ember/pull/146) Update configs and recommendations. ([@michalsnik](https://github.com/michalsnik))

#### :rocket: Enhancement
* [#144](https://github.com/ember-cli/eslint-plugin-ember/pull/144) Add destructuring support to `new-modules-import` rule. ([@clcuevas](https://github.com/clcuevas))
* [#151](https://github.com/ember-cli/eslint-plugin-ember/pull/151) Allow recognition of controller injection. ([@rmachielse](https://github.com/rmachielse))

#### :memo: Documentation
* [#178](https://github.com/ember-cli/eslint-plugin-ember/pull/178) Add Release instructions. ([@Turbo87](https://github.com/Turbo87))
* [#167](https://github.com/ember-cli/eslint-plugin-ember/pull/167) Added Yarn Install. ([@Alonski](https://github.com/Alonski))
* [#177](https://github.com/ember-cli/eslint-plugin-ember/pull/177) Add CHANGELOG. ([@Turbo87](https://github.com/Turbo87))
* [#176](https://github.com/ember-cli/eslint-plugin-ember/pull/176) Add myself to contributors. ([@jbandura](https://github.com/jbandura))

#### Committers: 9
- Alon Bukai ([Alonski](https://github.com/Alonski))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.6.2 (2017-11-15)

#### :rocket: Enhancement
* [#173](https://github.com/ember-cli/eslint-plugin-ember/pull/173) Disable `order-in-*` rules by default. ([@Turbo87](https://github.com/Turbo87))
* [#155](https://github.com/ember-cli/eslint-plugin-ember/pull/155) ember-get-and-set Add option `ignoreThisExpressions`. ([@JoelWAnna](https://github.com/JoelWAnna))
* [#174](https://github.com/ember-cli/eslint-plugin-ember/pull/174) Disable and deprecate `avoid-leaking-state-in-components` rule. ([@Turbo87](https://github.com/Turbo87))
* [#146](https://github.com/ember-cli/eslint-plugin-ember/pull/146) Update configs and recommendations. ([@michalsnik](https://github.com/michalsnik))

#### :bug: Bug Fix
* [#169](https://github.com/ember-cli/eslint-plugin-ember/pull/169) Closes [#150](https://github.com/ember-cli/eslint-plugin-ember/issues/150) issue with 'init' property. ([@eskab](https://github.com/eskab))
* [#168](https://github.com/ember-cli/eslint-plugin-ember/pull/168) Fix lint rule crash when variable is used as routename. ([@cspanring](https://github.com/cspanring))
* [#152](https://github.com/ember-cli/eslint-plugin-ember/pull/152) Detect models based on their files' path. ([@rmachielse](https://github.com/rmachielse))

#### :memo: Documentation
* [#175](https://github.com/ember-cli/eslint-plugin-ember/pull/175) Add deprecations to README. ([@Turbo87](https://github.com/Turbo87))
* [#166](https://github.com/ember-cli/eslint-plugin-ember/pull/166) add missing "plugins" and reorder. ([@kellyselden](https://github.com/kellyselden))

#### :house: Internal
* [#171](https://github.com/ember-cli/eslint-plugin-ember/pull/171) Fix failing tests on windows due to path separators. ([@PrzemoRevolve](https://github.com/PrzemoRevolve))

#### Committers: 9
- Christian Spanring ([cspanring](https://github.com/cspanring))
- Kelly Selden ([kellyselden](https://github.com/kellyselden))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Przemysław Nowak ([PrzemoRevolve](https://github.com/PrzemoRevolve))
- Richard Machielse ([rmachielse](https://github.com/rmachielse))
- Szymon Kabelis ([eskab](https://github.com/eskab))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [JoelWAnna](https://github.com/JoelWAnna)
- [shegupta](https://github.com/shegupta)


## v4.6.1 (2017-11-06)

#### :bug: Bug Fix
* [#160](https://github.com/ember-cli/eslint-plugin-ember/pull/160) ignore tagged templates for avoid-leaking-state-in-ember-objects rule. ([@amk221](https://github.com/amk221))

#### Committers: 1
- Andrew Kirwin ([amk221](https://github.com/amk221))


## v4.6.0 (2017-11-03)

#### :rocket: Enhancement
* [#137](https://github.com/ember-cli/eslint-plugin-ember/pull/137) Enforce component lifecycle hook order. ([@rwwagner90](https://github.com/rwwagner90))

#### :memo: Documentation
* [#154](https://github.com/ember-cli/eslint-plugin-ember/pull/154) Add myself to contributors, use https for GitHub links. ([@rwwagner90](https://github.com/rwwagner90))
* [#153](https://github.com/ember-cli/eslint-plugin-ember/pull/153) minor typo in readme. ([@zkrzyzanowski](https://github.com/zkrzyzanowski))

#### Committers: 3
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Zach Krzyzanowski ([zkrzyzanowski](https://github.com/zkrzyzanowski))
- [shegupta](https://github.com/shegupta)


## v4.5.0 (2017-09-02)

#### :rocket: Enhancement
* [#121](https://github.com/ember-cli/eslint-plugin-ember/pull/121) Add rule to disallow `this.$` to prepare apps to remove jQuery. ([@cibernox](https://github.com/cibernox))

#### Committers: 1
- Miguel Camba ([cibernox](https://github.com/cibernox))


## v4.4.0 (2017-09-02)

#### :rocket: Enhancement
* [#124](https://github.com/ember-cli/eslint-plugin-ember/pull/124) Order beforeModel and afterModel around model. ([@rwwagner90](https://github.com/rwwagner90))
* [#108](https://github.com/ember-cli/eslint-plugin-ember/pull/108) Add additional position for empty methods. ([@t-sauer](https://github.com/t-sauer))

#### :bug: Bug Fix
* [#132](https://github.com/ember-cli/eslint-plugin-ember/pull/132) Don't report on Ember method calls in use-ember-get-and-set. ([@sudowork](https://github.com/sudowork))

#### :house: Internal
* [#133](https://github.com/ember-cli/eslint-plugin-ember/pull/133) Add recommended rules snapshot test. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 4
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Thomas Sauer ([t-sauer](https://github.com/t-sauer))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.3.0 (2017-08-15)

#### :rocket: Enhancement
* [#104](https://github.com/ember-cli/eslint-plugin-ember/pull/104) New rule: no-duplicate-dependent-keys. ([@jbandura](https://github.com/jbandura))
* [#122](https://github.com/ember-cli/eslint-plugin-ember/pull/122) Add new "call-super-in-init" rule. ([@kevinkucharczyk](https://github.com/kevinkucharczyk))

#### :bug: Bug Fix
* [#107](https://github.com/ember-cli/eslint-plugin-ember/pull/107) Don't suggest nested property brace expansion. ([@Kerrick](https://github.com/Kerrick))

#### :memo: Documentation
* [#125](https://github.com/ember-cli/eslint-plugin-ember/pull/125) named-functions-in-promises example without .bind(). ([@caseywatts](https://github.com/caseywatts))
* [#120](https://github.com/ember-cli/eslint-plugin-ember/pull/120) Fix broken links in readme. ([@dustinspecker](https://github.com/dustinspecker))

#### :house: Internal
* [#118](https://github.com/ember-cli/eslint-plugin-ember/pull/118) Update "ember-rfc176-data" to v0.2.7. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 6
- Casey Watts ([caseywatts](https://github.com/caseywatts))
- Dustin Specker ([dustinspecker](https://github.com/dustinspecker))
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Kerrick Long ([Kerrick](https://github.com/Kerrick))
- Kevin Kucharczyk ([kevinkucharczyk](https://github.com/kevinkucharczyk))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.2.0 (2017-08-03)

#### :rocket: Enhancement
* [#115](https://github.com/ember-cli/eslint-plugin-ember/pull/115) Add `fix` for `use-ember-get-and-set`. ([@sudowork](https://github.com/sudowork))
* [#116](https://github.com/ember-cli/eslint-plugin-ember/pull/116) Add "new-module-imports" rule. ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#117](https://github.com/ember-cli/eslint-plugin-ember/pull/117) CI: Publish tags to npm automatically. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v4.1.3 (2017-08-01)

#### :bug: Bug Fix
* [#114](https://github.com/ember-cli/eslint-plugin-ember/pull/114) Fix "no-global-jquery". ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v4.1.1 (2017-08-01)

#### :rocket: Enhancement
* [#103](https://github.com/ember-cli/eslint-plugin-ember/pull/103) New rule: no-global-jquery. ([@jbandura](https://github.com/jbandura))
* [#100](https://github.com/ember-cli/eslint-plugin-ember/pull/100) New rule: no-attrs (Closes [#52](https://github.com/ember-cli/eslint-plugin-ember/issues/52)). ([@jbandura](https://github.com/jbandura))
* [#99](https://github.com/ember-cli/eslint-plugin-ember/pull/99) Adding new rule: no-attrs-snapshot. ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#111](https://github.com/ember-cli/eslint-plugin-ember/pull/111) Add solution for service ordering when new module imports used. ([@jbandura](https://github.com/jbandura))
* [#98](https://github.com/ember-cli/eslint-plugin-ember/pull/98) Detecting computed properties with MemberExpressions. ([@jbandura](https://github.com/jbandura))

#### :memo: Documentation
* [#101](https://github.com/ember-cli/eslint-plugin-ember/pull/101) netguru -> ember-cli. ([@rwwagner90](https://github.com/rwwagner90))
* [#92](https://github.com/ember-cli/eslint-plugin-ember/pull/92) Update README & introduce auto generated table with rules. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 4
- Jacek Bandura ([jbandura](https://github.com/jbandura))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Robert Wagner ([rwwagner90](https://github.com/rwwagner90))
- Steve Calvert ([scalvert](https://github.com/scalvert))


## v3.6.2 (2017-07-13)

#### :bug: Bug Fix
* [#93](https://github.com/ember-cli/eslint-plugin-ember/pull/93) Make sure negative values are treated as properties. ([@jbandura](https://github.com/jbandura))

#### Committers: 1
- Jacek Bandura ([jbandura](https://github.com/jbandura))


## v3.6.1 (2017-07-11)

#### :bug: Bug Fix
* [#94](https://github.com/ember-cli/eslint-plugin-ember/pull/94) Fix method of detecting whether route segment present. ([@jbandura](https://github.com/jbandura))

#### Committers: 1
- Jacek Bandura ([jbandura](https://github.com/jbandura))


## v3.6.0 (2017-07-10)

#### :rocket: Enhancement
* [#90](https://github.com/ember-cli/eslint-plugin-ember/pull/90) Add new "no-old-shims" rule. ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#91](https://github.com/ember-cli/eslint-plugin-ember/pull/91) Switch test runner from Mocha/Chai to Jest. ([@Turbo87](https://github.com/Turbo87))
* [#89](https://github.com/ember-cli/eslint-plugin-ember/pull/89) Update "yarn.lock" file. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v3.5.0 (2017-06-26)

#### :rocket: Enhancement
* [#80](https://github.com/ember-cli/eslint-plugin-ember/pull/80) alias-model-in-controller: allow nested properties. ([@buschtoens](https://github.com/buschtoens))
* [#77](https://github.com/ember-cli/eslint-plugin-ember/pull/77) Add no-capital-letters-in-routes to base. ([@scottkidder](https://github.com/scottkidder))

#### Committers: 2
- Jan Buschtöns ([buschtoens](https://github.com/buschtoens))
- Scott Kidder ([scottkidder](https://github.com/scottkidder))


## v3.4.1 (2017-05-30)

#### :bug: Bug Fix
* [#74](https://github.com/ember-cli/eslint-plugin-ember/pull/74) Revert "Make it available on emberobserver.com". ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v3.4.0 (2017-05-27)

#### :rocket: Enhancement
* [#70](https://github.com/ember-cli/eslint-plugin-ember/pull/70) New rule: no-capital-letters-in-routes. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.3.0 (2017-05-24)

#### :rocket: Enhancement
* [#64](https://github.com/ember-cli/eslint-plugin-ember/pull/64) Allow concise ArrowFunctionExpression (named-functions-in-promises). ([@sudowork](https://github.com/sudowork))
* [#66](https://github.com/ember-cli/eslint-plugin-ember/pull/66) Support tagged templates expressions. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#43](https://github.com/ember-cli/eslint-plugin-ember/pull/43) Sync groups between desc and javascript snippet. ([@bartocc](https://github.com/bartocc))
* [#65](https://github.com/ember-cli/eslint-plugin-ember/pull/65) Don't use this.attrs in docs. ([@sudowork](https://github.com/sudowork))

#### Committers: 3
- Julien Palmas ([bartocc](https://github.com/bartocc))
- Kevin Gao ([sudowork](https://github.com/sudowork))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.2.0 (2017-05-23)

#### :rocket: Enhancement
* [#60](https://github.com/ember-cli/eslint-plugin-ember/pull/60) `alias-model-in-controller` should support `readOnly` and `reads`. ([@michalsnik](https://github.com/michalsnik))
* [#46](https://github.com/ember-cli/eslint-plugin-ember/pull/46) Fix typo in documentation: rename 'no-side-effect' to 'no-side-effects'. ([@RusPosevkin](https://github.com/RusPosevkin))

#### :memo: Documentation
* [#50](https://github.com/ember-cli/eslint-plugin-ember/pull/50) Add syntax highlighting to Readme. ([@ryanponce](https://github.com/ryanponce))
* [#49](https://github.com/ember-cli/eslint-plugin-ember/pull/49) Update docs. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#54](https://github.com/ember-cli/eslint-plugin-ember/pull/54) Update rules to new ESLint rule format. ([@SaladFork](https://github.com/SaladFork))

#### Committers: 4
- Elad Shahar ([SaladFork](https://github.com/SaladFork))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Ruslan Posevkin ([RusPosevkin](https://github.com/RusPosevkin))
- Ryan Ponce ([ryanponce](https://github.com/ryanponce))


## v3.1.2 (2017-03-24)

#### :rocket: Enhancement
* [#44](https://github.com/ember-cli/eslint-plugin-ember/pull/44) Update no-on-calls-in-components rule. ([@clcuevas](https://github.com/clcuevas))

#### :memo: Documentation
* [#40](https://github.com/ember-cli/eslint-plugin-ember/pull/40) Fix configuration key. ([@bdmac](https://github.com/bdmac))

#### Committers: 2
- Brian McManus ([bdmac](https://github.com/bdmac))
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))


## v3.1.1 (2017-03-16)

#### :rocket: Enhancement
* [#39](https://github.com/ember-cli/eslint-plugin-ember/pull/39) Update no-empty-attrs rule. ([@clcuevas](https://github.com/clcuevas))

#### Committers: 1
- Claudia Cuevas ([clcuevas](https://github.com/clcuevas))


## v3.1.0 (2017-03-16)

#### :rocket: Enhancement
* [#37](https://github.com/ember-cli/eslint-plugin-ember/pull/37) 27 / Detect module types based on their files' path. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v3.0.2 (2017-03-08)

#### :rocket: Enhancement
* [#38](https://github.com/ember-cli/eslint-plugin-ember/pull/38) Add functions to route order. ([@netes](https://github.com/netes))

#### :memo: Documentation
* [#35](https://github.com/ember-cli/eslint-plugin-ember/pull/35) Typo in docs / closure-actions.md. ([@nfc036](https://github.com/nfc036))
* [#36](https://github.com/ember-cli/eslint-plugin-ember/pull/36) Remove remaining references to "query-params-on-top" rule. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Kamil Ejsymont ([netes](https://github.com/netes))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [nfc036](https://github.com/nfc036)


## v3.0.0 (2017-02-20)

#### :rocket: Enhancement
* [#34](https://github.com/ember-cli/eslint-plugin-ember/pull/34) Improve order in controllers and documentation. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#33](https://github.com/ember-cli/eslint-plugin-ember/pull/33) Add eslint and use ES6. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.2 (2017-02-15)

#### :rocket: Enhancement
* [#31](https://github.com/ember-cli/eslint-plugin-ember/pull/31) Treat conditional expressions as custom properties. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.1 (2017-02-15)

#### :bug: Bug Fix
* [#30](https://github.com/ember-cli/eslint-plugin-ember/pull/30) Check only model's properties against `no-empty-attrs` rule. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 1
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.2.0 (2017-02-14)

#### :rocket: Enhancement
* [#23](https://github.com/ember-cli/eslint-plugin-ember/pull/23) Improved error messages for `order-in` rules. ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v2.1.1 (2017-02-07)

#### :bug: Bug Fix
* [#16](https://github.com/ember-cli/eslint-plugin-ember/pull/16) Fix named-functions-in-promises rule. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#22](https://github.com/ember-cli/eslint-plugin-ember/pull/22) name correction. ([@bcardarella](https://github.com/bcardarella))

#### Committers: 2
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))


## v2.1.0 (2017-02-05)

#### :rocket: Enhancement
* [#15](https://github.com/ember-cli/eslint-plugin-ember/pull/15) Report correct positions for "order-in-*" rules. ([@Turbo87](https://github.com/Turbo87))

#### :memo: Documentation
* [#20](https://github.com/ember-cli/eslint-plugin-ember/pull/20) Update README and contributors. ([@michalsnik](https://github.com/michalsnik))
* [#12](https://github.com/ember-cli/eslint-plugin-ember/pull/12) doc: Adjust `no-side-effects` name and link. ([@Turbo87](https://github.com/Turbo87))
* [#7](https://github.com/ember-cli/eslint-plugin-ember/pull/7) README: Remove `ember-cli-eslint` requirement. ([@bardzusny](https://github.com/bardzusny))

#### :house: Internal
* [#19](https://github.com/ember-cli/eslint-plugin-ember/pull/19) Describe, launch tests under all supported Node.js versions. ([@bardzusny](https://github.com/bardzusny))
* [#9](https://github.com/ember-cli/eslint-plugin-ember/pull/9) Disable nyan reporter in CI. ([@alexlafroscia](https://github.com/alexlafroscia))
* [#8](https://github.com/ember-cli/eslint-plugin-ember/pull/8) Match yeoman generator structure. ([@alexlafroscia](https://github.com/alexlafroscia))
* [#4](https://github.com/ember-cli/eslint-plugin-ember/pull/4) Chore / Update plugin environment. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 4
- Adrian ([bardzusny](https://github.com/bardzusny))
- Alex LaFroscia ([alexlafroscia](https://github.com/alexlafroscia))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))


## v2.0.1 (2017-01-16)

#### :bug: Bug Fix
* [#3](https://github.com/ember-cli/eslint-plugin-ember/pull/3) Fix error in 'use-brace-expansion' rule. ([@dwickern](https://github.com/dwickern))

#### Committers: 1
- Derek Wickern ([dwickern](https://github.com/dwickern))


## v2.0.0 (2016-12-30)

#### :rocket: Enhancement
* [#1](https://github.com/ember-cli/eslint-plugin-ember/pull/1) Add base configurations. ([@michalsnik](https://github.com/michalsnik))
* [#34](https://github.com/ember-cli/eslint-plugin-ember/pull/34) Improve order in controllers and documentation. ([@michalsnik](https://github.com/michalsnik))
* [#37](https://github.com/ember-cli/eslint-plugin-ember/pull/37) 27 / Detect module types based on their files' path. ([@michalsnik](https://github.com/michalsnik))
* [#31](https://github.com/ember-cli/eslint-plugin-ember/pull/31) Treat conditional expressions as custom properties. ([@michalsnik](https://github.com/michalsnik))
* [#23](https://github.com/ember-cli/eslint-plugin-ember/pull/23) Improved error messages for `order-in` rules. ([@Turbo87](https://github.com/Turbo87))
* [#15](https://github.com/ember-cli/eslint-plugin-ember/pull/15) Report correct positions for "order-in-*" rules. ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* False positive for `no-empty-attrs`. ([@bdmac](https://github.com/bdmac))
* order-in-controllers vs query-params-on-top. ([@michalsnik](https://github.com/michalsnik))
* [#16](https://github.com/ember-cli/eslint-plugin-ember/pull/16) Fix named-functions-in-promises rule. ([@michalsnik](https://github.com/michalsnik))

#### :memo: Documentation
* [#35](https://github.com/ember-cli/eslint-plugin-ember/pull/35) Typo in docs / closure-actions.md. ([@nfc036](https://github.com/nfc036))
* [#22](https://github.com/ember-cli/eslint-plugin-ember/pull/22) name correction. ([@bcardarella](https://github.com/bcardarella))
* [#20](https://github.com/ember-cli/eslint-plugin-ember/pull/20) Update README and contributors. ([@michalsnik](https://github.com/michalsnik))

#### :house: Internal
* [#33](https://github.com/ember-cli/eslint-plugin-ember/pull/33) Add eslint and use ES6. ([@michalsnik](https://github.com/michalsnik))
* [#19](https://github.com/ember-cli/eslint-plugin-ember/pull/19) Describe, launch tests under all supported Node.js versions. ([@bardzusny](https://github.com/bardzusny))
* [#4](https://github.com/ember-cli/eslint-plugin-ember/pull/4) Chore / Update plugin environment. ([@michalsnik](https://github.com/michalsnik))

#### Committers: 9
- Adrian ([bardzusny](https://github.com/bardzusny))
- Brian Cardarella ([bcardarella](https://github.com/bcardarella))
- Brian McManus ([bdmac](https://github.com/bdmac))
- Craig Bilner ([craigbilner](https://github.com/craigbilner))
- Kamil Ejsymont ([netes](https://github.com/netes))
- Marcin Horoszko ([cinkonaap](https://github.com/cinkonaap))
- Michał Sajnóg ([michalsnik](https://github.com/michalsnik))
- Tobias Bieniek ([Turbo87](https://github.com/Turbo87))
- [nfc036](https://github.com/nfc036)
