// Insurance Niche Templates
export { default as AutoInsuranceTemplate } from './AutoInsuranceTemplate';
export { default as HomeInsuranceTemplate } from './HomeInsuranceTemplate';
export { default as HealthInsuranceTemplate } from './HealthInsuranceTemplate';
export { default as LifeInsuranceTemplate } from './LifeInsuranceTemplate';
export { default as MotorcycleInsuranceTemplate } from './MotorcycleInsuranceTemplate';
export { default as PetInsuranceTemplate } from './PetInsuranceTemplate';
export { default as BusinessInsuranceTemplate } from './BusinessInsuranceTemplate';
export { default as RentersInsuranceTemplate } from './RentersInsuranceTemplate';
export { default as UmbrellaInsuranceTemplate } from './UmbrellaInsuranceTemplate';

// Shared components for template building
export * from './shared';

// Template loader function for dynamic selection
export async function getTemplateByType(slug: string): Promise<React.ComponentType<any> | null> {
  const normalizedSlug = slug.toLowerCase().replace(/-?insurance$/, '');
  
  switch (normalizedSlug) {
    case 'auto':
      return (await import('./AutoInsuranceTemplate')).default;
    case 'home':
    case 'homeowners':
      return (await import('./HomeInsuranceTemplate')).default;
    case 'health':
      return (await import('./HealthInsuranceTemplate')).default;
    case 'life':
      return (await import('./LifeInsuranceTemplate')).default;
    case 'motorcycle':
      return (await import('./MotorcycleInsuranceTemplate')).default;
    case 'pet':
      return (await import('./PetInsuranceTemplate')).default;
    case 'business':
    case 'commercial':
      return (await import('./BusinessInsuranceTemplate')).default;
    case 'renters':
      return (await import('./RentersInsuranceTemplate')).default;
    case 'umbrella':
      return (await import('./UmbrellaInsuranceTemplate')).default;
    default:
      return null;
  }
}

// List all available template keys
export const AVAILABLE_TEMPLATES = [
  'auto', 'home', 'homeowners', 'health', 'life', 
  'motorcycle', 'pet', 'business', 'commercial', 
  'renters', 'umbrella'
];
