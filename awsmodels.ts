import { 
    chain,
    chaining, 
    parallel,
    parallelism,
    showAvailability,
    showComparison,
    showBestEverComparison,
    headline,
    assertNumber
} from './availability'; 

const DEBUG = false;

headline("Singletons");

assertNumber(0.9985, 4, chain(0.999, 0.9995));
assertNumber(chain(0.9993, 0.9993, 0.9993), 4, chaining(3, 0.9993));
assertNumber(0.9999995, 7, parallel(0.999, 0.9995));
assertNumber(0.9994, 4, chain(0.9995, 0.9999));
assertNumber(0.99999964, 8, parallel(0.9994, 0.9994));
assertNumber(0.99999964, 8, parallelism(2, 0.9994));

// Note: Outage is calculated with average length of year (365.2425 days)
if (DEBUG) {
    showAvailability('99.5%', 0.995);
    showAvailability('99.9%', 0.999);
    showAvailability('99.99%', 0.9999);
    showAvailability('99.999%', 0.99999);
}

showAvailability('EC2',
    chain('EC2')
);

showAvailability('IGW',
    chain('IGW')
);

showAvailability('Route53, IGW, ELB (MultiAZ)',
    chain('Route53', 'IGW.MultiAZ', 'ELB.MultiAZ')
);

showComparison();

headline('Public Webserver with EC2')

showAvailability('IGW, EC2 with EBS.gp2, Single-AZ',
    chain('IGW', 'EC2', 'EBS.gp2', 'Route53')
);

showAvailability('IGW, EC2 with EBS.io2, Single-AZ',
    chain('IGW', 'EC2', 'EBS.io2', 'Route53')
);

showAvailability('IGW, EC2 with EBS.gp2, EFS, Single-AZ',
    chain('IGW', 'EC2', 'EBS.gp2', 'EFS', 'Route53')
);

showAvailability('ELB, 2x EC2 with EBS.gp3, 2 AZ (Multi-AZ)', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53',
        parallelism(2, 
            chain('EC2', 'EBS.gp3')       
        )
    )
);

showAvailability('ELB, 2x EC2 with EBS.io2, 2 AZ (Multi-AZ)', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53',
        parallelism(2, 
            chain('EC2', 'EBS.io2')       
        )
    )
);

showAvailability('ELB, 3x EC2 with EBS.gp3, 3 AZ (Multi-AZ)', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53',
        parallelism(3, 
            chain('EC2', 'EBS.gp3')       
        )
    )
);

showComparison();

headline('Public Webserver with RDS');

showAvailability('EC2, RDS, 1 AZ',
    chain('IGW', 'EC2', 'EBS.gp2', 'RDS.SingleAZ', 'EBS.gp3', 'Route53')
);

showAvailability('ELB, 2x EC2, RDS, 2 AZ', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53',
        parallel(
            chain('EC2', 'EBS.gp3'),
            chain('EC2', 'EBS.gp3')       
        ),
        chain('RDS.MultiAZ', 'EBS.io2')
    )
);

showAvailability('ELB, 3x EC2, RDS, 2 AZ', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53', 
        parallel(
            chain('EC2', 'EBS.gp3'),
            chain('EC2', 'EBS.gp3'),
            chain('EC2', 'EBS.gp3') 
        ),
        chain('RDS.MultiAZ', 'EBS.io2')
    )
);

showAvailability('ELB, 10x EC2 instance, RDS, 2 AZ', 
    chain('IGW.MultiAZ', 'ELB.MultiAZ', 'Route53', 
        parallelism(10, 
            chain('EC2', 'EBS.gp3') 
        ),
        chain('RDS.MultiAZ', 'EBS.io2')
    )
);

showAvailability('ELB, 2x2 EC2 instance, RDS (Cross-Region replication), 2 AZ, 2 Regions', 
    chain('Route53',
        parallelism(2, 
            chain('IGW.MultiAZ', 'ELB.MultiAZ',
                parallelism(2, 
                    chain('EC2', 'EBS.gp3')
                ),
                chain('RDS.MultiAZ', 'EBS.io2')
            )
        ),
        'RDS.MultiAZ' // Cross-Region replication
    )
);

showComparison();

headline('Serverless website');

showAvailability('CDN, S3 (static hosting)',
    chain('CloudFront','S3.Item', 'Route53')
);

showAvailability('API-GW with Lambda Function (Lambda server side hosting)',
    chain('API-GW', 'Lambda', 'Route53')
);

showAvailability('Cloudfront, S3 (static hosting), API-Gateway with Lambda',
    chain('CloudFront', 'S3.Item', 'API-GW', 'Route53', 'Lambda')
);

showAvailability('Cloudfront, S3 (staic hosting), API-Gateway, Lambda, DynamoDB',
    chain('CloudFront', 'S3.Item', 'API-GW', 'Route53', 'Lambda', 'DynamoDB')
);

showAvailability('Cloudfront, S3 (staic hosting), API-Gateway, Lambda, DynamoDB, 2 Regions',
    chain('Route53',
        parallelism(2,
            chain('CloudFront', 'S3.Item', 'API-GW', 'Lambda', 'DynamoDB.GlobalTable')
        )
    )
)

showComparison();

headline('3-tier application with 2 tiers EC2 and RDS');

showAvailability('1 AZ',
  chain('IGW', 'Route53', 
        'EC2', 'EBS.gp2',
        'EC2', 'EBS.gp2',
        'RDS.SingleAZ'
  )
);

showAvailability('2 AZ zoned traffic',
  chain('IGW', 'Route53',
        'ELB.MultiAZ',
        parallelism(2, chain('EC2', 'EBS.gp2', 'EC2', 'EBS.gp2')),
        'RDS.MultiAZ'
  )
);

showAvailability('2 AZ cross AZ traffic',
  chain('IGW', 'Route53',
        'ELB.MultiAZ',
        parallelism(2, chain('EC2', 'EBS.gp2')),
        'ELB.MultiAZ',
        parallelism(2, chain('EC2', 'EBS.gp2')),
        'RDS.MultiAZ'
  )
);

showAvailability('3 AZ cross AZ traffic',
    chain('IGW', 'Route53',
        'ELB.MultiAZ',
        parallelism(3, chain('EC2', 'EBS.gp2')),
        'ELB.MultiAZ',
        parallelism(3, chain('EC2', 'EBS.gp2')),
        'RDS.MultiAZ'
  )
);

showComparison();

headline('3-tier application with 2 tiers EC2, SQS workers and DynamoDB');

showAvailability('LB, 2xEC2, SQS, 2x EC2, DynamoDB, 2 AZ (Multi-AZ)',
    chain(
        'Route53', 
        chain('IGW', 'ELB.MultiAZ', 
            parallelism(2,
                chain('EC2', 'EBS.gp2')
            ), 
        ),
        chain('SQS',
            parallelism(2,
                chain('EC2', 'EBS.gp2')
            )
        ),
        'DynamoDB'
    )
);

showAvailability('LB, 2xEC2, SQS, 2x EC2, DynamoDB, 2 AZ, 2 Regions',
    chain(
        'Route53',
        parallelism(2,
            chain(
                'IGW',
                'ELB.MultiAZ', 
                parallelism(2,
                    chain(
                        'EC2',
                        'EBS.gp2'
                    )
                ),
                chain(
                    'SQS',
                    parallelism(2,
                        chain(
                            'EC2',
                            'EBS.gp2'
                        )
                    )
                ),
                'DynamoDB'
            )
        ),
        'DynamoDB'  // Cross-Region replication
    )
);


showComparison();

headline('Comparison between all models');

showBestEverComparison();
