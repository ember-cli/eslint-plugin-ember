import { fortyTwoFromGTS } from './bar.gts';
import { fortyTwoFromTS } from './baz.ts';

export const fortyTwoLocal = '42';

const helloWorldFromTS = fortyTwoFromTS[0] === '4' ? 'hello' : 'world';
const helloWorldFromGTS = fortyTwoFromGTS[0] === '4' ? 'hello' : 'world';
const helloWorld = fortyTwoLocal[0] === '4' ? 'hello' : 'world';
//
<template>
  {{helloWorldFromGTS}}
  {{helloWorldFromTS}}
  {{helloWorld}}
</template>
