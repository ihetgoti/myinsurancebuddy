import { Button } from '@myinsurancebuddy/ui';

export default function UITestPage() {
    return (
        <div className="p-10 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Shared UI Button Test</h1>
                <p className="text-gray-600 mb-4">
                    This page verifies that the Shared UI library (@myinsurancebuddy/ui) is correctly linked and styled.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Variants</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Sizes</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium (Default)</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">Icon</Button>
                </div>
            </div>
        </div>
    );
}
