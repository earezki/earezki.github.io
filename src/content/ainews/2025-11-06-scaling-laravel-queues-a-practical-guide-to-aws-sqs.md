---
title: "Scaling Laravel Queues: A Practical Guide to AWS SQS"
pubDate: 2025-11-06
description: "A comprehensive guide to transitioning Laravel applications from default queue systems to AWS SQS for high availability, scalability, and reliability in handling thousands of jobs per hour."
categories: ["AI News", "laravel", "aws", "devops", "software", "development"]
---

## Scaling Laravel Queues: A Practical Guide to AWS SQS

When Laravel applications transition from MVP to production systems handling thousands of jobs per hour, default queue systems like Redis or databases become bottlenecks. This guide explains how to integrate **AWS SQS (Simple Queue Service)** for high availability, elastic scaling, and robust job processing.

### Why SQS Over Redis or Database Queues?

SQS outperforms Redis or database queues in critical areas:

- **Durability**:  
  - *Redis/Database*: Risk of data loss if the server crashes.  
  - *SQS*: Messages are replicated across multiple availability zones, ensuring durability.  
- **Elasticity**:  
  - *Redis/Database*: Scaling requires manually provisioning larger hosts.  
  - *SQS*: Automatically scales to handle millions of messages per second.  
- **Visibility Timeout Control**:  
  - *Redis/Database*: Limited and sometimes buggy control over job visibility.  
  - *SQS*: Robust visibility timeout settings to prevent duplicate job processing.  

### Setting Up AWS IAM and SQS

Before configuring Laravel, set up AWS infrastructure:

1. **Create an SQS Queue**:  
   - Use a **Standard Queue** (for high throughput).  
   - Example name: `production-default-queue`.  

2. **IAM User Permissions**:  
   - Create a dedicated IAM user with **least privilege**.  
   - Required permissions:  
     ```plaintext
     sqs:SendMessage
     sqs:ReceiveMessage
     sqs:DeleteMessage
     sqs:GetQueueAttributes
     ```  

3. **Credentials**:  
   - Retrieve the **Access Key ID** and **Secret Access Key** for the IAM user.  

### Laravel Configuration

Update Laravel’s environment and configuration files to use SQS:

#### `.env` File Changes
```text
QUEUE_CONNECTION=sqs
AWS_ACCESS_KEY_ID="your_iam_access_key"
AWS_SECRET_ACCESS_KEY="your_iam_secret_key"
AWS_DEFAULT_REGION="ap-southeast-2"
AWS_QUEUE="https://sqs.ap-southeast-2.amazonaws.com/123456789012/production-default-queue"
AWS_QUEUE_PREFIX="${AWS_QUEUE}/"
```

#### `config/queue.php` Configuration
```php
'sqs' => [
    'driver' => 'sqs',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'prefix' => env('AWS_QUEUE_PREFIX', 'https://sqs.us-east-1.amazonaws.com/'),
    'queue' => env('AWS_QUEUE', 'default'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
],
```

### Tuning Workers and Visibility Timeouts

Proper configuration ensures optimal performance and reliability:

1. **SQS Visibility Timeout**:  
   - Set to match the **maximum job runtime** (e.g., 300 seconds for 5-minute jobs).  
   - Prevents message reprocessing during worker failures.  

2. **Worker Timeout (Supervisor/Horizon)**:  
   - Match or slightly exceed the SQS timeout.  
   - Example Supervisor config:  
     ```ini
     [program:laravel-worker]
     process_name=%(program_name)s_%(process_num)02d
     command=php /var/www/html/artisan queue:work sqs --daemon --tries=3 --timeout=300
     numprocs=5
     ```

3. **Worker Scaling**:  
   - Start with 5 worker processes and scale based on load.  
   - Use **Horizon** for advanced monitoring and scaling.  

### Conclusion

Migrating to AWS SQS provides **durable, infinitely scalable** message handling, offloading retry logic and message management to AWS. This is critical for modern Laravel deployments on AWS, ensuring reliability under burst traffic.  

For further reference: [Scaling Laravel Queues with AWS SQS](https://dev.to/sopnonill87/scaling-laravel-queues-a-battle-tested-guide-to-aws-sqs-3ihi)

---

## Working Example (Code-Related)

### `.env` Configuration Example
```text
QUEUE_CONNECTION=sqs
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_DEFAULT_REGION=ap-southeast-2
AWS_QUEUE=https://sqs.ap-southeast-2.amazonaws.com/123456789012/production-default-queue
AWS_QUEUE_PREFIX=${AWS_QUEUE}/
```

---

## Recommendations (Code-Related)

- **Use Least Privilege IAM Policies**: Restrict SQS permissions to only required actions (`SendMessage`, `ReceiveMessage`, etc.).  
- **Match Visibility Timeouts**: Ensure SQS visibility timeout aligns with worker timeout to avoid message loss or duplication.  
- **Monitor Worker Performance**: Use **Horizon** for real-time metrics and auto-scaling.  
- **Avoid Hardcoding Secrets**: Store AWS credentials in environment variables or secret management systems (e.g., AWS Secrets Manager).  
- **Test with Real Workloads**: Simulate burst traffic to validate SQS and worker configurations.  
- **Handle Dead Letters**: Configure a **dead-letter queue** for failed messages to prevent infinite retries.