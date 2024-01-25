#!npx ts-node

/***
 * Execute with:
 *   npx ts-node <filename.ts>
 */

const DEBUG = false;

type TServiceItem = { 
    name: string;
    availability: number
};

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

export function addService(name: string, availability: number) {
    services.push({ name, availability });
}

export function getAvailability(servicename:number|string): number {
    let availability: number;
    if (typeof servicename === 'number') {
        availability = servicename;
    } else {
        const service = services.find((item) => item.name === servicename);
        if (!service) throw new Error(`Service not found: ${servicename}`);
        availability = service.availability;
    }
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Invalid number range for availability ${servicename}. Expected range is [0..1].`);
    }
    return availability
}

export function chain(...availabilities: (number|string)[]):number {
    let availability = 1;
    availabilities.forEach((value) => {
        const deviceAvailability = getAvailability(value);
        if (DEBUG) console.log({availability: deviceAvailability, device: value })
        availability *= deviceAvailability;
    });
    if (DEBUG) console.log({availability, chain: availabilities});
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return availability;
}

export function chaining( chaining: number, availability: (number|string)):number {
    const deviceAvailability = getAvailability(availability);
    const chainAvailability = Math.pow(deviceAvailability, chaining);
    if (DEBUG) console.log({ availability: deviceAvailability, device: availability });
    return chainAvailability;
}

export function parallel(...availabilities: (number|string)[]):number {
    let unavailability = 1;
    availabilities.forEach((value) => {
        const deviceAvailability = getAvailability(value)
        if (DEBUG) console.log({availability: deviceAvailability, device: value })
        unavailability *= (1-deviceAvailability);
    });
    const availability = 1-unavailability;
    if (DEBUG) console.log({ availability, parallel: availabilities })
    if ((availability < 0) || (availability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return availability;
};

export function parallelism(parallelism: number, availability: (number|string)) {
    const deviceAvailability = getAvailability(availability);
    if (DEBUG) console.log({availability: deviceAvailability, device: availability });
    const unavailability = Math.pow((1-deviceAvailability), Math.round(parallelism));
    if (DEBUG) console.log({ availability: 1-unavailability, parallelism });
    if ((unavailability < 0) || (unavailability > 1)) {
        throw new Error(`Assertion: Invalid number range for availability`);
    }
    return 1-unavailability;
}

type TModelStackItem = {
    id: number;
    name: string;
    availability: number;
}

var modelStack: TModelStackItem[] = [];
    
export function showAvailability(name: string, availability: number):number {
    const id = modelStack.length + 1;
    const secondsPerYear = (365.2425 * 24 * 60 * 60);
    const outageSecondsPerYear =  secondsPerYear - (secondsPerYear * availability); // is SecondsPerYer * (1-availability), for numerical precision
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
    console.log(" ");
    console.log(`Model #${id}> ${name}`);
    console.log(`  Availability: ${String(Math.round(availability * 100 * 1000000) / 1000000)} %`)
    console.log(`  Outage      : ${String(Math.round(outageSecondsPerYear*10)/10)} s/year`);
    console.log('  Outage      : '+
        ((outageDays > 0) ? `${outageDays} days, ` : '') +
        ((outageHours > 0) ? `${outageHours} hours, ` : '') +
        ((outageMins > 0) ? `${outageMins} mins, ` : '') +
        `${outageSecs} secs / year`);

    modelStack.push({ id, name, availability });
    return availability;
}

function getUnicodeLine(length: number, maxLength: number) {
    const characterMap = [' ', '\u258F', '\u258E', '\u258D', '\u258C', '\u258B', '\u258A', '\u2589', '\u2588' ];
    const divlen = Math.floor(length * 8) / 8;
    const modlen = Math.max(0, Math.min((Math.floor((length - divlen) * 8) / 8 ), 7));
    return '\u2588'.repeat(divlen) + characterMap[modlen] + ' '.repeat(Math.max(0,maxLength - divlen) + 1); 
}

function getAsciiLine(length: number, maxLength: number) {
    return (length >= 1) 
        ? '='.repeat(length) + ' '.repeat(1 + maxLength - length) 
        : '-' + ' '.repeat(maxLength);
}

const maxTextWidth = 18; 
const maxBandWidth = 50;
const maxLineWidth = maxTextWidth + maxBandWidth + 3 + 12;

export function showComparison(sort : boolean = false):number {
    let min: number = 1;
    let max: number = 0;
    let maxTextLength = 0;
    modelStack.forEach((model) => {
        if (model.availability < min) min = model.availability;
        if (model.availability > max) max = model.availability; 
        if (model.name.length > maxTextLength) maxTextLength = model.name.length;
    });
    if (sort) {
        modelStack.sort((a, b) => {
            return a.availability - b.availability;
        });
    }

    console.log('\nComparison:\n');
    modelStack.forEach((model) => {
        const bandWidth = Math.floor(((model.availability-0.9995*min) / (max-0.9995*min)) * (maxBandWidth));
        const caption = (String(model.id)+'>'+model.name)
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
            .replace(/ ebs[\.-]/ig,' ')
            .replace(/ +/g, ' ');
        const text = caption
            .slice(0, Math.min(maxTextWidth, caption.length))
            .trim();
        const textPadding = Math.max(0, maxTextWidth - text.length);
        console.log(
            text + ((textPadding > 1) 
                ? '.'.repeat(textPadding) 
                : ((textPadding === 1) ? ' ' :'') ) + ': ' +
            getUnicodeLine(bandWidth, maxBandWidth) + '  ' +
            String(Math.floor(model.availability * 100000) / 1000) + ' %'
        );
    });

    modelStack = [];

    return max;
}

export function headline(text: string) {
    modelStack = [];
    const cutText = text.slice(0, Math.min(text.length, maxLineWidth - 4));
    const leftPadding = Math.max(1, Math.floor((maxLineWidth-cutText.length-1)/2));
    const rightPadding = Math.max(1, maxLineWidth - leftPadding - cutText.length - 2);
    console.log('\n\n' + '\u250C' + '\u2500'.repeat(maxLineWidth - 2) + '\u2510');
    console.log('\u2502' + ' '.repeat(leftPadding) + cutText + ' '.repeat(rightPadding) + '\u2502');
    console.log('\u2514' + '\u2500'.repeat(maxLineWidth - 2) + '\u2518');
}

export function assertNumber(expected: number, precision: number, calculated: number) {
    const precisionFactor = Math.pow(10, precision);
    const roundCalculated = Math.floor(precisionFactor * calculated) / precisionFactor;
    if (Math.abs(expected - roundCalculated) > 1 / (10*precisionFactor)) {
        if (DEBUG) console.log({ precisionFactor, calculated, abs: Math.abs(expected - roundCalculated), threshold: 1/(10*precisionFactor) });
        throw new Error(`Assertion: Calculation error. Expected: ${expected}, found: ${roundCalculated}`);
    }
}

