'use client';

import { useState } from 'react';
import { Calculator, Car, Home, Heart, Stethoscope, DollarSign, ChevronRight, Share2, RefreshCw, Shield, Dog, Briefcase } from 'lucide-react';

type InsuranceType = 'car' | 'home' | 'life' | 'health' | 'pet' | 'business';

interface QuoteResult {
    low: number;
    mid: number;
    high: number;
    factors: string[];
    type: InsuranceType;
}

const insuranceOptions: { type: InsuranceType; label: string; icon: any; color: string }[] = [
    { type: 'car', label: 'Auto Insurance', icon: Car, color: 'blue' },
    { type: 'home', label: 'Home Insurance', icon: Home, color: 'green' },
    { type: 'life', label: 'Life Insurance', icon: Heart, color: 'red' },
    { type: 'health', label: 'Health Insurance', icon: Stethoscope, color: 'purple' },
    { type: 'pet', label: 'Pet Insurance', icon: Dog, color: 'orange' },
    { type: 'business', label: 'Business Insurance', icon: Briefcase, color: 'slate' },
];

export default function MultiInsuranceCalculator() {
    const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
    const [step, setStep] = useState(0); // 0 = type selection
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [result, setResult] = useState<QuoteResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetCalculator = () => {
        setSelectedType(null);
        setStep(0);
        setFormData({});
        setResult(null);
    };

    const selectType = (type: InsuranceType) => {
        setSelectedType(type);
        setStep(1);
        setFormData({});
    };

    const calculateQuote = () => {
        setIsCalculating(true);
        setTimeout(() => {
            let low = 0, mid = 0, high = 0;
            const factors: string[] = [];

            switch (selectedType) {
                case 'car': {
                    const age = parseInt(formData.age) || 30;
                    const vehicleValue = parseInt(formData.vehicleValue) || 25000;
                    mid = 120;
                    if (age < 25) { mid *= 1.5; factors.push('Young driver surcharge'); }
                    else if (age >= 25 && age <= 35) { mid *= 0.95; factors.push('Prime age discount'); }
                    if (formData.record === 'clean') { mid *= 0.9; factors.push('Clean driving discount'); }
                    else if (formData.record === 'accident') { mid *= 1.4; factors.push('Accident surcharge'); }
                    low = Math.round(mid * 0.6);
                    high = Math.round(mid * 1.3 + vehicleValue * 0.002);
                    mid = Math.round(mid);
                    break;
                }
                case 'home': {
                    const homeValue = parseInt(formData.homeValue) || 300000;
                    const homeAge = parseInt(formData.homeAge) || 20;
                    mid = homeValue * 0.003 / 12;
                    if (homeAge > 30) { mid *= 1.2; factors.push('Older home surcharge'); }
                    if (formData.security === 'yes') { mid *= 0.9; factors.push('Security system discount'); }
                    if (formData.claims === 'none') { mid *= 0.85; factors.push('Claims-free discount'); }
                    low = Math.round(mid * 0.7);
                    high = Math.round(mid * 1.4);
                    mid = Math.round(mid);
                    break;
                }
                case 'life': {
                    const age = parseInt(formData.age) || 35;
                    const coverage = parseInt(formData.coverage) || 500000;
                    mid = (coverage / 1000) * (age < 30 ? 0.5 : age < 40 ? 0.8 : age < 50 ? 1.2 : 2.0);
                    if (formData.smoker === 'no') { mid *= 0.6; factors.push('Non-smoker discount'); }
                    else { factors.push('Smoker surcharge applied'); }
                    if (formData.health === 'excellent') { mid *= 0.8; factors.push('Excellent health discount'); }
                    low = Math.round(mid * 0.7);
                    high = Math.round(mid * 1.5);
                    mid = Math.round(mid);
                    break;
                }
                case 'health': {
                    const age = parseInt(formData.age) || 35;
                    mid = age < 30 ? 350 : age < 40 ? 450 : age < 50 ? 550 : 700;
                    if (formData.plan === 'bronze') { mid *= 0.7; factors.push('Bronze plan (higher deductible)'); }
                    else if (formData.plan === 'gold') { mid *= 1.3; factors.push('Gold plan (lower deductible)'); }
                    if (formData.family === 'yes') { mid *= 2.5; factors.push('Family coverage'); }
                    low = Math.round(mid * 0.8);
                    high = Math.round(mid * 1.3);
                    mid = Math.round(mid);
                    break;
                }
                case 'pet': {
                    const petAge = parseInt(formData.petAge) || 3;
                    mid = petAge < 2 ? 30 : petAge < 5 ? 40 : petAge < 8 ? 55 : 75;
                    if (formData.petType === 'dog') { mid *= 1.2; factors.push('Dog (higher avg. claims)'); }
                    if (formData.breed === 'purebred') { mid *= 1.3; factors.push('Purebred surcharge'); }
                    if (formData.wellness === 'yes') { mid *= 1.4; factors.push('Wellness coverage included'); }
                    low = Math.round(mid * 0.7);
                    high = Math.round(mid * 1.5);
                    mid = Math.round(mid);
                    break;
                }
                case 'business': {
                    const revenue = parseInt(formData.revenue) || 500000;
                    const employees = parseInt(formData.employees) || 5;
                    mid = (revenue / 100000) * 50 + employees * 30;
                    if (formData.industry === 'low') { mid *= 0.8; factors.push('Low-risk industry discount'); }
                    else if (formData.industry === 'high') { mid *= 1.5; factors.push('High-risk industry surcharge'); }
                    low = Math.round(mid * 0.6);
                    high = Math.round(mid * 1.4);
                    mid = Math.round(mid);
                    break;
                }
            }

            setResult({ low, mid, high, factors, type: selectedType! });
            setIsCalculating(false);
            setStep(3);
        }, 1200);
    };

    const shareResult = () => {
        if (result) {
            const typeLabel = insuranceOptions.find(o => o.type === result.type)?.label || 'Insurance';
            const text = `My estimated ${typeLabel} is $${result.mid}/month! Try the free calculator at MyInsuranceBuddies.com`;
            if (navigator.share) {
                navigator.share({ title: 'My Insurance Estimate', text, url: window.location.href });
            } else {
                navigator.clipboard.writeText(text + ' ' + window.location.href);
                alert('Copied to clipboard!');
            }
        }
    };

    // Type Selection
    if (step === 0) {
        return (
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Choose Insurance Type</h2>
                <p className="text-center text-slate-500 mb-8">Select the type of insurance you want to estimate</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {insuranceOptions.map(option => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.type}
                                onClick={() => selectType(option.type)}
                                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-full bg-${option.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-7 h-7 text-${option.color}-600`} />
                                </div>
                                <span className="font-semibold text-slate-900">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Form fields based on type
    const renderFormFields = () => {
        switch (selectedType) {
            case 'car':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Age</label>
                            <input type="number" value={formData.age || ''} onChange={e => updateField('age', e.target.value)} placeholder="28" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Value ($)</label>
                            <input type="number" value={formData.vehicleValue || ''} onChange={e => updateField('vehicleValue', e.target.value)} placeholder="25000" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Driving Record</label>
                            <select value={formData.record || 'clean'} onChange={e => updateField('record', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="clean">Clean</option>
                                <option value="ticket">Minor violation</option>
                                <option value="accident">At-fault accident</option>
                            </select>
                        </div>
                    </div>
                );
            case 'home':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Home Value ($)</label>
                            <input type="number" value={formData.homeValue || ''} onChange={e => updateField('homeValue', e.target.value)} placeholder="300000" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Home Age (years)</label>
                            <input type="number" value={formData.homeAge || ''} onChange={e => updateField('homeAge', e.target.value)} placeholder="15" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Security System?</label>
                            <select value={formData.security || 'no'} onChange={e => updateField('security', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Claims in last 5 years?</label>
                            <select value={formData.claims || 'none'} onChange={e => updateField('claims', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="none">None</option>
                                <option value="one">1 claim</option>
                                <option value="multiple">2+ claims</option>
                            </select>
                        </div>
                    </div>
                );
            case 'life':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Age</label>
                            <input type="number" value={formData.age || ''} onChange={e => updateField('age', e.target.value)} placeholder="35" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Coverage Amount ($)</label>
                            <input type="number" value={formData.coverage || ''} onChange={e => updateField('coverage', e.target.value)} placeholder="500000" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tobacco use?</label>
                            <select value={formData.smoker || 'no'} onChange={e => updateField('smoker', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="no">Non-smoker</option>
                                <option value="yes">Smoker</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">General Health</label>
                            <select value={formData.health || 'good'} onChange={e => updateField('health', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                            </select>
                        </div>
                    </div>
                );
            case 'health':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Age</label>
                            <input type="number" value={formData.age || ''} onChange={e => updateField('age', e.target.value)} placeholder="35" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plan Type</label>
                            <select value={formData.plan || 'silver'} onChange={e => updateField('plan', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="bronze">Bronze (High deductible)</option>
                                <option value="silver">Silver (Balanced)</option>
                                <option value="gold">Gold (Low deductible)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Family Coverage?</label>
                            <select value={formData.family || 'no'} onChange={e => updateField('family', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="no">Individual</option>
                                <option value="yes">Family</option>
                            </select>
                        </div>
                    </div>
                );
            case 'pet':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pet Type</label>
                            <select value={formData.petType || 'dog'} onChange={e => updateField('petType', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pet Age (years)</label>
                            <input type="number" value={formData.petAge || ''} onChange={e => updateField('petAge', e.target.value)} placeholder="3" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
                            <select value={formData.breed || 'mixed'} onChange={e => updateField('breed', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="mixed">Mixed breed</option>
                                <option value="purebred">Purebred</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Include wellness coverage?</label>
                            <select value={formData.wellness || 'no'} onChange={e => updateField('wellness', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="no">Accident/Illness only</option>
                                <option value="yes">Include wellness</option>
                            </select>
                        </div>
                    </div>
                );
            case 'business':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue ($)</label>
                            <input type="number" value={formData.revenue || ''} onChange={e => updateField('revenue', e.target.value)} placeholder="500000" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Employees</label>
                            <input type="number" value={formData.employees || ''} onChange={e => updateField('employees', e.target.value)} placeholder="5" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Industry Risk</label>
                            <select value={formData.industry || 'medium'} onChange={e => updateField('industry', e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                                <option value="low">Low (Office, retail)</option>
                                <option value="medium">Medium (Food, services)</option>
                                <option value="high">High (Construction, manufacturing)</option>
                            </select>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Form Step
    if (step === 1 || step === 2) {
        const currentOption = insuranceOptions.find(o => o.type === selectedType);
        const Icon = currentOption?.icon || Shield;

        return (
            <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{currentOption?.label}</h2>
                        <p className="text-sm text-slate-500">Enter your details</p>
                    </div>
                </div>

                {renderFormFields()}

                <div className="mt-6 flex gap-3">
                    <button onClick={resetCalculator} className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">
                        Back
                    </button>
                    <button onClick={calculateQuote} disabled={isCalculating} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                        {isCalculating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Calculating...</> : <><Calculator className="w-5 h-5" /> Get Estimate</>}
                    </button>
                </div>
            </div>
        );
    }

    // Results
    if (step === 3 && result) {
        const currentOption = insuranceOptions.find(o => o.type === result.type);

        return (
            <div className="max-w-lg mx-auto space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
                    <h2 className="text-xl font-bold mb-6">Your {currentOption?.label} Estimate</h2>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                            <p className="text-xs text-blue-200 uppercase mb-1">Basic</p>
                            <p className="text-2xl font-bold">${result.low}</p>
                            <p className="text-xs text-blue-200">/month</p>
                        </div>
                        <div className="text-center p-4 bg-white/20 rounded-lg ring-2 ring-white/50">
                            <p className="text-xs text-blue-200 uppercase mb-1">Standard</p>
                            <p className="text-3xl font-bold">${result.mid}</p>
                            <p className="text-xs text-blue-200">/month</p>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                            <p className="text-xs text-blue-200 uppercase mb-1">Premium</p>
                            <p className="text-2xl font-bold">${result.high}</p>
                            <p className="text-xs text-blue-200">/month</p>
                        </div>
                    </div>

                    {result.factors.length > 0 && (
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-sm font-medium mb-2">Factors:</p>
                            <ul className="text-sm text-blue-100 space-y-1">
                                {result.factors.map((f, i) => <li key={i}>• {f}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button onClick={shareResult} className="flex-1 flex items-center justify-center gap-2 border border-slate-300 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50">
                        <Share2 className="w-5 h-5" /> Share
                    </button>
                    <button onClick={resetCalculator} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                        <RefreshCw className="w-5 h-5" /> Try Another
                    </button>
                </div>

                <p className="text-xs text-slate-400 text-center">
                    * Estimates only. Actual rates vary. Get quotes from multiple insurers.
                </p>
            </div>
        );
    }

    return null;
}
