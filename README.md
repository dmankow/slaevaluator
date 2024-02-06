# SLA Evaluator

This project helps to find the perfect combination of IT services of
cloud providers, here AWS. This project calculates availabilities and
outages of compound IT services. It allows you to compare the availability
between multiple service models.

Compound services consists out of a combination of

- serial (dependent) systems, and
- parallel (independent) systems.

Default availabilities for most AWS services has been collected out of the
[AWS SLA collection](https://aws.amazon.com/legal/service-level-agreements) for convenience.
Other sets of default system availabilities can easily be added.

## The Concept of Availability

The term [availability](https://en.wikipedia.org/wiki/Availability) is been used in reliability engineering.
It describes the probability of a system to be in the operable state at any random point in time.
Availability can be stated in percent or as a factor in the range [0,1].
High availability systems might be specified as 99.9%, 99.999% or 99.9995%.

In the following we use percent when we display an availability. We use factors
in the range of [0,1] when we calculate with them.

Any additionally stated time span is without effect. Both systems have identical
availabilities: 99.5%/month and 99.5%/year.

## How we can use it

For a comparison of availabilities it is sometimes more practical to compare the
resulting outage time span. We use "outage" instead of "downtime", because there
is in most circumstances no relation to any realistic downtime of a system.

This is, because availabilities stated inside a SLA are usually compromised by
some considerations of business risks as well as marketing.
A reputable service provider will state any availabilities including a safety
coefficient dependent on the number of users, traffic volume, impact and more.

Therefore, all calculations of availabilities can only be rough estimates of
their upper limits.

Don't get afraid when you calculate days instead of minutes of downtime, here.

But if we suppose, that a service provider is using the same safety coefficient
in any of his published SLA's, we are at least allowed to compare different kinds
of services of the same provider.

This is my goal here:

   Finding the perfect configuration of services on AWS.

## Definitions

We define `availability` as the percentage of time in average that a service is
in the functional state at an arbitrary point in time.

The outage time span (per time span) (downtime) is now defined as:
  
    Outage = (1-Availability) * (Time-Span)

In calculations we need the `unavailability` that is defined as:

    Unavailability = 1-Availability

## Modelling a compound system

The theory of calculation compound system availabilities is based on the
"probability theory" forming the concepts of:

- [conditional dependence](https://en.wikipedia.org/wiki/Conditional_dependence) and
- [conditional independence](https://en.wikipedia.org/wiki/Conditional_independence).

Therefore, we can model the availability of almost any compound system by a
combination of dependent and independent systems. All numbers we need are the
distinct availabilities of any incorporated system.

For modelling the compound system it must be portrayed in a tree-like or
better to say, layered structure.
The entry point (or top level) is a collection (list) of dependent or
independent systems.

Any dependent or independent system of any layer can consist of another
collection (list) of dependent or independent systems.

But never mix dependent and independent systems in one collection. You
have to always split them into separate collections.

So, how can we decide, what is dependent or not?

### The "chain"

What is a "dependent system"? An example for a dependent system is a ship’s anchor chain. If only one chain link cracks, the ship is on perish.
The ship relies on every single chain link. On bad takes it all.

If the average availability of a single chain link is 99.99%, the compound
availability of a chain with 100 links is 99.99% powered by 100.
That is 99%, or (quite oversimplified) one of a hundred times we use the chain,
it will break. Let's disembark quickly from that ship.

The compound availability of dependent systems is been calculated by multiplying
the particular system availability. Therefore the ordering of particular systems
dependent on each other is of no importance.

As we already know, exchanging two identical "bad" spare parts (e.g. tyres)
does nothing to the availability of our car. We have to spend money for
exchanging them against better parts (e.g. new tyres).

You may use the calculation function `chain(...availabilities)`, if you have a
number of dependent systems with different availabilities.

You may use calculation function `chaining(count, availability)`, if you have
a number of dependent systems with identical availabilities.

### The "parallel"

An independent systems is now much easier to explain: If there is a couple of
systems, the whole compound system breaks if all systems breaks. If only one
stays in function, the whole system is been considered as available.

Example: If the ship uses two chains for its anchorage, and any chain can hold
the ship in place for it alone, these chains are considered independent.

You may use the calculation function `parallel(...availabilities)`, if you have
a collection of independent systems with different availabilities.

You may use the calculation function `paralellism(count, availability)`, if you
have a number of independent systems with identical availability.

### Considering allocations: Autoscaling group

In IT we have more complex concepts. Consider an autoscaling group of servers,
each identical. On our first approach you might consider them as independent,
because as far there is only one surviving server left, the compound
functionality is considered as available.

But we have to watch the load as well. There might be a minimum number of
servers needed for supporting the functionality under normal operational
conditions. We have to model this autoscaling group as a collection of
independent services, consisting out of collections of dependent servers
in the size of the minimal number of servers needed.

Consider recalling that sentence again modelling your 20 or so autoscaling
groups.

Example: The ship uses four chains, but it needs at least two chains left
for anchorage.
You only have to identify these circumstances. You may use
the calculation function `parallelismWithAllocation(parallelism, allocation, availability)`
in the case when you have independent systems, but a minimum number of
systems need be functional.

## Installation

You need NodeJS version 18.x for this.
Other versions might work well, but are not tested.

- Install NodeJS - package manager like `NVM` or `NVM for Windows` recommended.
- nvm install

There is an example prepared, execute `npx ts-node awsmodels.ts`

## Usage

### Calculation functions

chain(availability, ...)
  Calculates the availability of a collection of dependent systems.

chaining(number, availability)
  Calculates the availability of a series of identical dependent systems.

parallel(availability, ...)
  Calculates the availability of a collection of independent systems.

parallelism(number, availability)
  Calculates the availability of a series of identical independent systems.

parallelismWithAllocation(parallelism, allocation, availability)
  Calculates the availability of a series of identical independent systems,
  when a minimum number of systems needs to be allocated for availability.

### Reporting function

headline(text)
  Prints a headline box including a text line. Increases the section counter.

showAvailability(descritpion, availability)
  Prints a compound service model availability and shows the downtime (outage)
  as total time span in seconds and human readable. Increases the model counter.

showComparison()
  Prints a comparison bar chart between the all service models of the section.
  Models for comparison are pushed through calls to `showAvailability()`.
  A section is between two calls of `headline(...)`.

showBesteverComparison()
  Prints a comparision barchart of all compound service models of all sections.
  Two comparison are shown:
  First shows the top-5 of all models evaluated, independent of the section.
  Second shows the top model of any section.
  This is usually the last call to this library.

### Code Example

    // file models.ts:

    import {headline, showAvailability, showCompare, chain, parallel} from './availability';

    headline('First section of compound systems')

    showAvailability('First system description', 
        chain(0.991, 0.995,
            parallel(0.9999, 0.9992)
        )
    )

    ... more showAvailability(...) here ...

    showComparision()

    headline('Another section')
    showAvailability(...)
    ...
    showComparision()

    headline('Best-Ever-Comparision')
    showBestEverComparison()

## Run your own service model

No build step is required. The only dependency is the Typescript runtime
layer in package `ts-node`.

Start with the example set of models in file `awsmodels.ts`. Execute `npm run demo`.

Create your models like shown in the example above. There is a template
file in `models.ts`. Use this file for your compound service models. Run:

    npm run model

Alternatively you can run any model file with `npx ts-node <myfile.ts>`.
