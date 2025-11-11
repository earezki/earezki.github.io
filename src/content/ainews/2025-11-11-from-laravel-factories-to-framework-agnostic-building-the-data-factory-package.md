---
title: "Building the Data Factory Package: Framework-Agnostic Test Data Generation"
pubDate: 2025-11-11
description: "A framework-agnostic PHP package, Data Factory, streamlines test data generation, replacing repetitive arrays with Laravel-like factories."
categories: ["AI News", "PHP", "Testing"]
---

## Building the Data Factory Package

[2-sentence hook. Name the event, person, or system + one hard fact.]  
Francisco Barrento created Data Factory, a framework-agnostic PHP package, to eliminate repetitive test data arrays. Laravel developers use factories like `$deployment = Deployment::factory()->make()`; now, non-Laravel projects can too.

### Why This Matters  
The ideal of test data generation is clean, reusable code that adapts to API changes. The reality for framework-agnostic PHP packages is brittle, repetitive array construction. Updating dozens of test arrays when a data structure changes violates DRY principles and increases maintenance overhead, as seen in SDKs like Laravel Ortto.

### Key Insights  
- "Multiply this by dozens of tests, and you've got a maintenance problem." – Francisco Barrento, 2025  
- "States over manual overrides for test data consistency": DeploymentFactory defines `succeeded()` and `failed()` states to avoid hardcoded values.  
- "Temporal used by Stripe, Coinbase" → Not applicable here; Data Factory is used by Laravel Cloud SDK for server test data.

### Working Example  
```php
// DeploymentFactory.php
use FBarrento\DataFactory\Factory;
class DeploymentFactory extends Factory
{
    protected string $dataObject = Deployment::class;
    protected function definition(): array
    {
        return [
            'id' => $this->fake->uuid(),
            'status' => 'pending',
            'branch_name' => 'main',
            'commit_hash' => $this->fake->sha1(),
        ];
    }
}
```

```php
// Deployment.php
use FBarrento\DataFactory\Concerns\HasDataFactory;
readonly class Deployment
{
    use HasDataFactory;
    public function __construct(
        public string $id,
        public string $status,
        public string $branch_name,
        public string $commit_hash
    ) {}
    public static function newFactory(): DeploymentFactory
    {
        return new DeploymentFactory();
    }
}
```

### Practical Applications  
- **Use Case**: Laravel Cloud SDK uses Data Factory to generate server test data with states like `provisioning()` and `large()`.  
- **Pitfall**: Hardcoding test data values (e.g., `['status' => 'failed']`) instead of using factory states leads to inconsistent test suites.

**Reference:** https://dev.to/fbarrento/from-laravel-factories-to-framework-agnostic-building-the-data-factory-package-4pib  
---