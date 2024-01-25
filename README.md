# SLA Evaluator

This project calculates arbitrary availabilities and outages of compound IT systems.
Compound systems can be consisit out of an collection of

- serial (dependent) systems, and
- and parallel (independent) systems.

Default availabilities for most AWS services has been collected out of the [AWS SLA
collection](https://aws.amazon.com/legal/service-level-agreements) as presets.

## Functions

chain(availabilitiy, ...)
  Calculates the availability of a collection of dependent systems.

chaining(number, availabiliie)
  Calculates the availability of a series of identical dependent systems.

parallel(availability, ...)
  Calculates the availability of a collection of independent systems.

parallelism(number, availability)
  Calculates the availability of a series of identical independent systems.

## Code Example

    import {headline, showAvailability, showCompare, chain, parallel} from './availability';

    headline('My compound system');

    showAvailability('System explanation', 
        chain(0.991, 0.995,
            parallel(0.9999, 0.9992)
        )
    );

    ... more compound systems ...

    showComparision(false);

## Execution

No build step is required. Create your model like shown in the exampole above.

    npx ts-node <myfile.ts>

There is an example, execute `run.cmd`.