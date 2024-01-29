import { 
    chain,
    chaining, 
    parallel,
    parallelism,
    parallelismWithAllocation,
    showAvailability,
    showComparison,
    showBestEverComparison,
    headline,
    assertNumber,
    addService
} from './availability'; 

// ------------------------- First section ------------------------------
headline('Model definition section');

// Add a custom service for convenience:
addService('CustomService', 0.995);

// See a list of predefined AWS availabilities in the top of file 'availability.ts'
showAvailability('First model',
    parallelism(2, chain(0.9999, 'EC2', 'RDS', 'CustomService'))
);

showAvailability('Second model',
    chain(0.9999, 'EC2', 'RDS', 'CustomService')
);

showComparison();

/* If you need more complex reports, uncomment this
 *
 *

// ------------------------- Second section -----------------------------
headline('Model definition section');

showAvailability('Name', 
    // Put your model definition here
    chain(1)
);

showComparison();

// ----------------------- Comparison section ---------------------------
headline('Comparison between all models');

showBestEverComparison();

*
*
*/
