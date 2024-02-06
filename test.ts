import { 
  chain,
  chaining, 
  parallel,
  parallelism,
  assertNumber
} from './availability'; 

console.log('Running tests...');

assertNumber(0.9985, 4, chain(0.999, 0.9995));
assertNumber(chain(0.9993, 0.9993, 0.9993), 4, chaining(3, 0.9993));
assertNumber(0.9999995, 7, parallel(0.999, 0.9995));
assertNumber(0.9994, 4, chain(0.9995, 0.9999));
assertNumber(0.99999964, 8, parallel(0.9994, 0.9994));
assertNumber(0.99999964, 8, parallelism(2, 0.9994));

console.log('All tests passed');
