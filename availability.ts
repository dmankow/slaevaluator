#!/bin/node ts-node

/***
 * Execute with:
 *   npx ts-node <filename.ts>
 */

// Show debuggin messages
const DEBUG = false;

// Accepts availabilities in the ranges [0,1] and [50,100].
const LAZY_AVAILABILITY = true;

/******************************************************************************
 * Look-up-table (LUT) of available service names.
 * In all calculation functions either an distinct availability value or a 
 * servicename (defining a preconfigured availability) can be used.
 * Arbitrary new services can be added with function 'addService'.  
 */

type TServiceItem = { 
    name: string;               // Name of service
    availability: number        // Availability of service
};

/**
 * LUT of predefined services and their availability-
 */
const services: TServiceItem[] = [
    { name: 'EC2', availability: 0.995 },
    { name: 'EBS', availability: 0.999 },
    { name: 'EBS.sc1', availability: 0.999 * 0.998 },
    { name: 'EBS.st1', availability: 0.999 * 0.998 },
    { name: 'EBS.gp2', availability: 0.999 * 0.998 },
    { name: 'EBS.gp3', availability: 0.999 * 0.998 },
    { name: 'EBS.io1', availability: 0.999 * 0.998 },
    { name: 'EBS.io2', availability: 0.999 * 0.99999 },
    { name: 'ELB', availability: 0.999 }, //Single AZ
    { name: 'ELB.MultiAZ', availability: 0.9999 },
    { name: 'EFS', availability: 0.9999 },
    { name: 'EFS.IA', availability: 0.9999 },
    { name: 'EFS.OneZone', availability: 0.999 },
    { name: 'FSx', availability: 0.999 },
    { name: 'FSx.MultiAZ', availability: 0.9999 },
    { name: 'Kinesis', availability: 0.999 },
    { name: 'Kinesis.Firehose', availability: 0.999 },
    { name: 'Kinesis.DataStreams', availability: 0.999 },
    { name: 'Kinesis.VideoStreams', availability: 0.999 },
    { name: 'Prometheous', availability: 0.999 },
    { name: 'Redshift', availability: 0.995 },
    { name: 'Route53', availability: 1 },
    { name: 'Route53.Endpoint.MultiAZ', availability: 0.9999 },
    { name: 'Route53.Endpoint', availability: 0.995 },
    { name: 'TrafficMirroring', availability: 0.999 },
    { name: 'AppSync', availability: 0.9995 },
    { name: 'ClientVPN', availability: 0.999 },
    { name: 'CloudMap', availability: 0.9995 },
    { name: 'CloudHSM', availability: 0.995 },
    { name: 'CloudHSM.MultiAZ', availability: 0.9995 },
    { name: 'DirectConnect', availability: 0.95 },
    { name: 'DirectConnect.MultiSite', availability: 0.999 },
    { name: 'DirectConnect.MultiSiteRedundant', availability: 0.9999 },
    { name: 'KMS', availability: 0.99999 },
    { name: 'Glue', availability: 0.999 },
    { name: 'MSK', availability: 0.999 },
    { name: 'MQ', availability: 0.999 },
    { name: 'IGW', availability: 0.999 }, // No SLA, from Transit-Gateway
    { name: 'IGW.MultiAZ', availability: 0.9999 }, // No SLA, from Transit-Gateway
    { name: 'RDS', availability: 0.999 },
    { name: 'RDS.SingleAZ', availability: 0.999 },
    { name: 'RDS.MultiAZ', availability: 0.9999 },
    { name: 'RDS-Proxy', availability: 0.9999 },
    { name: 'Transit-GW', availability: 0.999 },
    { name: 'Transit-GW.MultiAZ', availability: 0.9999 },
    { name: 'Storage-GW', availability: 0.999 },
    { name: 'DataSync', availability: 0.999 },
    { name: 'API-GW', availability: 0.9995 },
    { name: 'Lambda', availability: 0.9995 },
    { name: 'StepFunctions', availability: 0.999 },
    { name: 'Athena', availability: 0.999 },
    { name: 'CloudFront', availability: 0.999 },
    { name: 'Cognito', availability: 0.999 },
    { name: 'NAT-GW', availability: 0.999 },
    { name: 'Sagemaker.Batch', availability: 0.999 },
    { name: 'Sagemaker.Inference', availability: 0.9995 },
    { name: 'DocumentDB', availability: 0.999 },
    { name: 'CloudSearch', availability: 0.995 }, // No SLA, taken from EC2
    { name: 'CloudSearch.MultiAZ', availability: 0.999 },
    { name: 'DynamoDB', availability: 0.9999 },
    { name: 'DynamoDB.GlobalTable', availability: 0.99999 },
    { name: 'Keyspaces', availability: 0.9999 },
    { name: 'MemoryDB', availability: 0.995 },
    { name: 'MemoryDB.MultiAZ', availability: 0.9999 },
    { name: 'Neptune', availability: 0.995 },
    { name: 'Neptune.MultiAZ', availability: 0.9999 },
    { name: 'QLDB', availability: 0.999 },
    { name: 'Timestream', availability: 0.9999 },
    { name: 'Elasticache', availability: 0.995 },
    { name: 'Elasticache.MultiAZ', availability: 0.9999 },
    { name: 'Elasticache.Serverless', availability: 0.9999 },
    { name: 'Elasticache.CrossAZ', availability: 0.999 },
    { name: 'EMR', availability: 0.999 },
    { name: 'EMR.Serverless', availability: 0.999 },
    { name: 'EMR.onEKS', availability: 0.999 },
    { name: 'ECR', availability: 0.999 },
    { name: 'EKS', availability: 0.9995 },
    { name: 'EKS.Pod', availability: 0.995 },
    { name: 'EKS.MultiAZPod', availability: 0.9999 },
    { name: 'ECS.Task', availability: 0.995 },
    { name: 'ECS.MultiAZTask', availability: 0.9999 },
    { name: 'Eventbridge', availability: 0.9999 },
    { name: 'SQS', availability: 0.999 },
    { name: 'SNS', availability: 0.999 },
    { name: 'EKS.Pod', availability: 0.995 },
    { name: 'S3', availability: 0.999 },
    { name: 'S3.Express', availability: 0.999 },
    { name: 'S3.Glacier', availability: 0.999 },
    { name: 'S3.GlacierInstantRetrival', availability: 0.99 },
    { name: 'S3.IAOneZone', availability: 0.99 },
    { name: 'S3.IA', availability: 0.99 },
    { name: 'S3.IntelligentTiring', availability: 0.99 },
    { name: 'S3.Item', availability: 0.999 * 0.99999999999 },
];

/**
 * Type definition for an availability value in the range [0,1] or a predefined 
 * servicename.
 * If option LAZY_AVAILABILITY is set to 'True', accepts availability values in
 * the range [50,100] as well.
 */
export type AvailabilityOrServiceType = number|string;

/**
 * Returns the normalized availability in the range [0,1] of either a predefined
 * servicename or an availability in the range [0,1] and [50,100].
 * The functions applys a range check.
 * @param availabilityOrService - Name of service or availability value
 * @returns - Normalized availability in the range [0,1]
 */
export function getAvailability(availabilityOrService:AvailabilityOrServiceType): number {
    let availability: number;
    if (typeof availabilityOrService === 'number') {
        availability = availabilityOrService;
    } else {
        const service = services.find((item) => item.name === availabilityOrService);
        if (!service) throw new Error(`Service not found: ${availabilityOrService}`);
        availability = service.availability;
    }
    if ((LAZY_AVAILABILITY) && (availability >= 50) && (availability <= 100)) {
        availability /= 100;
    }
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Invalid number range for availability ${availabilityOrService}. Expected range is [0..1].`);
    }
    return availability
}

/**
 * Adds a new service into the LUT of services with its availability.
 * It transforms availability into [0,1] range, if so, and pushes into LUT.
 * Applies a range check on the availability value.
 * @param name - Name of service
 * @param availability - Availability in the range [0,1] or [50,100]
 */
export function addService(name: string, availability: number) {
    services.push({ name, availability: getAvailability(availability) });
}

/************************************************************************
 * Calculation functions
 * All calculation functions like chain, chaining, parallel and parallelism
 * can be stacked like:
 * 
 * const availability = chain(
 *     parallel(
 *         chaining(...)
 *     ),
 *     parallelism(...),
 *     ...
 * );
 */


/**
 * Calculates the compound availability of dependent services.
 * Accepts servicenames or distinct availability values.
 * An arbitrary number of servicenames or availabilities can be provided.
 * @param availabilitiesOrServices - List of availabilites or servicenames
 * @returns - Compound availability
 */
export function chain(...availabilitiesOrServices: AvailabilityOrServiceType[]):number {
    let availability = 1;
    availabilitiesOrServices.forEach((value) => {
        const serviceAvailability = getAvailability(value);
        if (DEBUG) console.log({availability: serviceAvailability, device: value })
        availability *= serviceAvailability;
    });
    if (DEBUG) console.log({availability, chain: availabilitiesOrServices});
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return availability;
}

/**
 * Calculates the compound availablity of dependent servies with each the same
 * availability.
 * Accepts servicenames or distinct availability values.
 * Only one servicename or availability can be provided.
 * @param chaining - Number of dependent services 
 * @param availabilityOrService - Availability or servicename
 * @returns - Compound availability
 */
export function chaining( chaining: number, availabilityOrService: AvailabilityOrServiceType):number {
    const serviceAvailability = getAvailability(availabilityOrService);
    const availability = Math.pow(serviceAvailability, chaining);
    if (DEBUG) console.log({ availability: serviceAvailability, device: availabilityOrService });
    return availability;
}

/**
 * Calculates the compound availability of independent services (parallelization).
 * Accepts servicenames or distinct availability values.
 * An arbitrary number of servicenames or availabilities can be provided.
 * @param availabilitiesOrServices - List of availabilities or servicenames
 * @returns - Compound availability
 */
export function parallel(...availabilitiesOrServices: AvailabilityOrServiceType[]):number {
    let unavailability = 1;
    availabilitiesOrServices.forEach((value) => {
        const serviceAvailability = getAvailability(value)
        if (DEBUG) console.log({availability: serviceAvailability, device: value })
        unavailability *= (1-serviceAvailability);
    });
    const availability = 1-unavailability;
    if (DEBUG) console.log({ availability, parallel: availabilitiesOrServices })
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return availability;
};

/**
 * Calculates the compound availability of independent services (parallelization) 
 * with each the same availability.
 * Accepts servicenames or distinct availability values.
 * Only one servicename or availability can be provided.
 * @param parallelism 
 * @param availabilityOrService 
 * @returns 
 */
export function parallelism(parallelism: number, availabilityOrService: AvailabilityOrServiceType) {
    const availability = getAvailability(availabilityOrService);
    if (DEBUG) console.log({availability: availability, device: availabilityOrService });
    const unavailability = Math.pow((1-availability), Math.round(parallelism));
    if (DEBUG) console.log({ availability: 1-unavailability, parallelism });
    if ((unavailability < 0) || (unavailability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return 1-unavailability;
}

/*****************************************************************************
 * Reporting functions
 * Every call of 'showAvailability' pushes the outcome of the service and its
 * availability on this stack. With 'showComparision' a comparison report is
 * been displayed and the stack is cleared. 
 */

/**
 * Type of an model stack item. 
 */
type TModelStackItem = {
    id: number;
    modelStackId: number;
    name: string;
    availability: number;
}

/**
 * Stack of model items.
 */
var modelStack: TModelStackItem[] = [];
var bestOfModelStack: TModelStackItem[] = [];
var bestEverModelStack: TModelStackItem[] = [];
var modelStackCounter: number = 1;

function printModel(model: TModelStackItem):void {

    // Calculating outage per year (time span of unavailability)
    // This is SecondsPerYer * (1-availability). Because of numerical precision, the formula has 
    // been reordered.
    const secondsPerYear = (365.2425 * 24 * 60 * 60);
    const outageSecondsPerYear =  secondsPerYear - (secondsPerYear * model.availability); 

    // Human eye friendly display of outage time span
    let overflowSeconds = outageSecondsPerYear;
    const outageDays = Math.floor(outageSecondsPerYear / (60.0 * 60 * 24));
    if (outageDays > 0) overflowSeconds %= (outageDays * 24.0 * 60 * 60); 
    const outageHours = Math.floor(overflowSeconds / (60.0 * 60));
    if (outageHours>24) throw new Error('Assertion: Overflow in calculation of Hours');
    if (outageHours > 0) overflowSeconds %= outageHours * 60.0 * 60;
    const outageMins = Math.floor(overflowSeconds / 60.0);
    if (outageHours>60) throw new Error('Assertion: Overflow in calculation of Mins');
    if (outageMins > 0) overflowSeconds %= outageMins * 60.0;
    const outageSecs = Math.round(overflowSeconds*10)/10;
    if (outageSecs>60) throw new Error('Assertion: Overflow in calculation of Secs');

    // Show report
    console.log(" ");
    console.log(`Model ${model.modelStackId}.${model.id}: ${model.name}`);
    console.log(`  Availability: ${String(Math.round(model.availability * 100 * 1000000) / 1000000)} %`)
    console.log(`  Outage      : ${String(Math.round(outageSecondsPerYear*10)/10)} s/year`);
    console.log('  Outage      : '+
        ((outageDays > 0) ? `${outageDays} days, ` : '') +
        ((outageHours > 0) ? `${outageHours} hours, ` : '') +
        ((outageMins > 0) ? `${outageMins} mins, ` : '') +
        `${outageSecs} secs / year`);
}

/**
 * Shows a short report of the availability and it's outage time (d:h:m:s) of a compound service model
 * on the console. 
 * Pushes the report on the model stack. A comparison report of all pushed reports can be displayed
 * with 'showComparision'.  
 * @param name - Name of the compound service model 
 * @param availabilityOrService - Compound availability of the service model 
 * @returns - Availability
 */
export function showAvailability(name: string, availabilityOrService: AvailabilityOrServiceType):number {
    const model : TModelStackItem = {
        id: modelStack.length + 1,
        modelStackId: modelStackCounter,
        name,
        availability: getAvailability(availabilityOrService)
    };

    printModel(model);

    // Push model on model stack
    modelStack.push(model);

    return model.availability;
}

/**
 * Draws a line with 8-times a characters resolution on the command line. The line will be 
 * padded on the right with spaces up to 'maxLength' characters.
 * Returs always a string with 'maxLength' characters.
 * Uses some strange Unicode characters to increase "resolution" of presentation.
 * @param length - length of line in characters. Range [0, maxLength]
 * @param maxLength - Total length of line.
 * @returns - String[maxLength]
 */
function getUnicodeLine(length: number, maxLength: number):string {
    const characterMap = [' ', '\u258F', '\u258E', '\u258D', '\u258C', '\u258B', '\u258A', '\u2589', '\u2588' ];
    const divlen = Math.floor(length * 8) / 8;
    const modlen = Math.max(0, Math.min((Math.floor((length - divlen) * 8) / 8 ), 7));
    return '\u2588'.repeat(divlen) + characterMap[modlen] + ' '.repeat(Math.max(0,maxLength - divlen) + 1); 
}

/**
 *  Shows a simple line with character resolution using ASCII characters.
 * @param length - length of line in characters. Range [0, maxLength]
 * @param maxLength - Total length of line.
 * @returns - String[maxLength]
 */
function getAsciiLine(length: number, maxLength: number) {
    return (length >= 1) 
        ? '='.repeat(length) + ' '.repeat(1 + maxLength - length) 
        : '-' + ' '.repeat(maxLength);
}

/* Comparison report and headline sizing */
const maxTextWidth = 30;
const maxBandWidth = 60;
const maxLineWidth = maxTextWidth + maxBandWidth + 4 + 12;

function printComparisonItems(models:TModelStackItem[], min: number, max: number): void {
    models.forEach((model) => {
        // Length of line representing availability
        const bandWidth = Math.floor(((model.availability-0.9995*min) / (max-0.9995*min)) * (maxBandWidth));

        // Create a shortend caption line by removing, replacing and shorten well known words. 
        const caption = (String(model.modelStackId)+'.'+String(model.id)+': '+model.name)
            .replace(/[#:,]/g, '')
            .replace(/\(.*\)|\[.*\]/g, '')
            .replace(/with|in(stance|)|and|or|function|vpc|route53/ig, '')
            .replace(/multi.{0,1}az/ig,'M-AZ')
            .replace(/single.{0,1}az/ig,'S-AZ')
            .replace(/cross.{0,1}az/ig,'crsAZ')
            .replace(/multi.{0,1}region/ig,'M-Rg')
            .replace(/single.{0,1}region/ig,'S-Rg')
            .replace(/cross.{0,1}region/ig,'crsRg')
            .replace(/traffic/ig,'trf.')
            .replace(/api.{0,1}(gw|gateway)/ig,'API')
            .replace(/gateway/ig,'GW')
            .replace(/endpoint[s|]/ig,'ep.')
            .replace(/dynamodb/ig, 'DynDB')
            .replace(/cloudfront/ig,'CDN')
            .replace(/lambda/ig, '\u03bb')
            .replace(/regions|region/ig, 'Rgn')
            .replace(/ ebs[\.-]/ig,' ')
            .replace(/ +/g, ' ');

        // Press the caption text into maxTextWidth characters
        const text = caption
            .slice(0, Math.min(maxTextWidth, caption.length))
            .trim();

        // Calculates padding for caption text
        const textPadding = Math.max(0, maxTextWidth - text.length);

        // Compose the print line
        console.log(
            // Caption
            text + ((textPadding > 1) 
                ? '.'.repeat(textPadding) 
                : ((textPadding === 1) ? ' ' :'') ) + '  ' +
            // Availability line (unicode art band)
            getUnicodeLine(bandWidth, maxBandWidth) + '  ' +
            // Availability percentage (number)
            String(Math.floor(model.availability * 1000000) / 10000) + ' %'
        );
    });
}

/**
 * Shows a statistical comparison report about all pushed models.
 * Any call of 'showAvailability' pushes one result of a compound service model
 * calculation on the model stack. This compares the results and displays the
 * relative outcome.
 * @param sort - Enables sorting by availability of the models. Defaults to false.
 * @returns - Number of model with the highest availability.
 */
export function showComparison(sort : boolean = false):TModelStackItem|undefined {
    let maxModel: TModelStackItem|undefined = undefined;
    let min: number = 1;
    let max: number = 0;
    let maxTextLength = 0;

    // Find min and max availability and the best model.
    modelStack.forEach((model) => {
        if (model.availability < min) min = model.availability;
        if (model.availability > max) {
            max = model.availability;
            maxModel = model;
        }
        if (model.name.length > maxTextLength) maxTextLength = model.name.length;
    });

    // SOrt models by availability, if enabled.
    if (sort) {
        modelStack.sort((a, b) => {
            return a.availability - b.availability;
        });
    }

    // Print the report
    console.log('\nComparison:\n');
    printComparisonItems(modelStack, min, max);

    // Empty model stack.
    modelStack = [];
    modelStackCounter++;

    // Push the best model of this comparison on the "Best-Of" model stack.
    if (maxModel) {
        bestOfModelStack.push(maxModel);
    }

    // Push the best model of this comparison on the "Best-Ever" model, if it is 
    // Top-5
    if (maxModel) {
        let found : boolean = false;
        if (bestEverModelStack.length < 5) {
            bestEverModelStack.push(maxModel)
        } else {
            bestEverModelStack.forEach((model) => {
                if (maxModel && !found && (maxModel.availability > model.availability)) {
                    bestEverModelStack.push(maxModel);
                    found = true;
                }
            });
        }
    }

    // Return the best model
    return maxModel;
}

export function showBestEverComparison():TModelStackItem|undefined {
    let min: number;
    let max: number;
    let bestModel: TModelStackItem|undefined = undefined;
    if (bestEverModelStack.length > 0) {
        bestEverModelStack.sort((a, b) => {
            return b.availability - a.availability;
        });
        max = bestEverModelStack[0].availability;
        min = bestEverModelStack[bestEverModelStack.length-1].availability;
        bestModel = bestEverModelStack[0];
        bestEverModelStack.slice(0, Math.min(5, bestEverModelStack.length));
        console.log('\nTop-5 of all models:\n');
        printComparisonItems(bestEverModelStack, min, max);
    }

    if (bestOfModelStack.length > 0) { 
        /*
        bestOfModelStack.sort((a, b) => {
            return b.availability - a.availability;
        });
        */
        min = 1;
        max = 0;
        bestOfModelStack.forEach((model) => {
            if (model.availability < min) min = model.availability;
            if (model.availability > max) max = model.availability;
        });
        bestOfModelStack.slice(0, Math.min(5, bestOfModelStack.length));
        console.log('\nBest model of every serie of models:\n');
        printComparisonItems(bestOfModelStack, min, max);
    }

    if (bestModel) {
        console.log('\nBest availability archived:');
        printModel(bestModel);
        return bestEverModelStack[0];
    } else return undefined;
    
}

/**
 * Draws a headline rounded in a unicode box
 * @param text - text in the box
 */
export function headline(text: string) {
    modelStack = [];
    const cutText = String(modelStackCounter)+') ' + text.slice(0, Math.min(text.length, maxLineWidth - 4));
    const leftPadding = Math.max(1, Math.floor((maxLineWidth-cutText.length-1)/2));
    const rightPadding = Math.max(1, maxLineWidth - leftPadding - cutText.length - 2);
    console.log('\n\n' + '\u250C' + '\u2500'.repeat(maxLineWidth - 2) + '\u2510');
    console.log('\u2502' + ' '.repeat(leftPadding) + cutText + ' '.repeat(rightPadding) + '\u2502');
    console.log('\u2514' + '\u2500'.repeat(maxLineWidth - 2) + '\u2518');
}

/**
 * Compares a calculated compound availability against an expected availability.
 * Returns true, if calculated availabiltiy is better than expected, in the range
 * of expected precision (1/pow(10, precisison)).
 * Expects availability in the range of [0,1].
 * @param expected - Expected availability
 * @param precision - Precsision in post comma digits
 * @param calculated - Calculated availability
 * @returns 
 */
export function checkAvailability(expected: number, precision: number, calculated: number): boolean {
    const precisionFactor = Math.pow(10, precision);
    const roundCalculated = Math.floor(precisionFactor * calculated) / precisionFactor;
    if (DEBUG) console.log({ precisionFactor, calculated, abs: Math.abs(expected - roundCalculated), threshold: 1/(10*precisionFactor) });
    return (calculated - expected) > -(1 / (10*precisionFactor))
}

/**
 * Assertion text for float numbers. As comparisions of float numbers resulting of differenct
 * calculations can never even by perfect precsision, we compare float numbers by defining a 
 * precision on powers of ten. Variations less the 1/pow(10,precision) will be accepted.
 * Expects availability in the range of [0,1].
 * @param expected - Expected float value
 * @param precision - Precsision in post-comma digits of the comparision 
 * @param calculated - Calculated float value
 */
export function assertNumber(expected: number, precision: number, calculated: number) {
    const precisionFactor = Math.pow(10, precision);
    const roundCalculated = Math.floor(precisionFactor * calculated) / precisionFactor;
    if (Math.abs(expected - roundCalculated) > 1 / (10*precisionFactor)) {
        if (DEBUG) console.log({ precisionFactor, calculated, abs: Math.abs(expected - roundCalculated), threshold: 1/(10*precisionFactor) });
        throw new Error(`Assertion: Calculation error. Expected: ${expected}, found: ${roundCalculated}`);
    }
}
