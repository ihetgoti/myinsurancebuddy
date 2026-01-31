import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import CalculatorClient from './CalculatorClient';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Car Insurance Calculator 2024 | Estimate Your Rates | InsuranceBuddies',
    description: 'Use our free car insurance calculator to estimate your monthly premiums. Compare rates based on age, driving record, coverage level, and more.',
};

export default async function CarInsuranceCalculatorPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />
            <CalculatorClient />
            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
