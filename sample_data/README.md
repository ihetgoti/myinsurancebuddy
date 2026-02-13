# Sample Data for Bulk Page Generation

Use these JSON files as templates to create your own data for bulk page generation.

## How to Use

1. Copy the sample JSON for your insurance type
2. Add more state/city entries to the array
3. Upload via Templates page → Generate Pages

## Field Naming Convention

All fields use **snake_case** (lowercase with underscores):
- `state_name` not `stateName`
- `avg_premium` not `avgPremium`
- `state_code` not `stateCode`

## Common Fields (All Templates)

| Field | Description | Example |
|-------|-------------|---------|
| `state_name` | Full state name | "California" |
| `state_code` | 2-letter state code | "CA" |
| `state_slug` | URL-friendly state name | "california" |
| `city_name` | City name (for city pages) | "Los Angeles" |
| `city_slug` | URL-friendly city name | "los-angeles" |
| `avg_premium` | Average insurance cost | "$1,500/year" |
| `top_insurer` | Market leader | "State Farm" |
| `last_updated` | Data date | "2024-01-15" |

## Template-Specific Fields

See individual sample files for template-specific fields like:
- Auto: `min_coverage`, `uninsured_rate`, `coverage_breakdown`
- Home: `avg_home_value`, `disaster_risk`, `flood_zone`
- Health: `medicare_enrollment`, `uninsured_rate`

## URL Structure

Pages will be created at:
- State: `/{insurance-type}-insurance/{state}`
- City: `/{insurance-type}-insurance/{state}/{city}`

Examples:
- `/auto-insurance/california`
- `/home-insurance/california/los-angeles`
