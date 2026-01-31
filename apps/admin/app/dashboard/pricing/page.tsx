'use client';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api';
import { DollarSign, TrendingDown, AlertCircle, Eye } from 'lucide-react';

interface CallOffer {
    id: string;
    name: string;
    campaignId: string;
    insuranceTypeId: string | null;
    insuranceType: { id: string; name: string; slug: string } | null;
    stateIds: string[];
    isActive: boolean;
    priority: number;
    // Pricing fields
    displayPrice: number | null;
    displayPriceLabel: string;
    displayPricePeriod: string;
    regularPrice: number | null;
    savingsAmount: number | null;
    savingsPercentage: number | null;
    priceDisclaimer: string;
    promoHeadline: string | null;
    promoSubheadline: string | null;
    urgencyText: string | null;
    ctaText: string;
    ctaSubtext: string | null;
    promoStartDate: string | null;
    promoEndDate: string | null;
}

interface State {
    id: string;
    name: string;
    code: string;
}

export default function PricingManagerPage() {
    const [offers, setOffers] = useState<CallOffer[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState<CallOffer | null>(null);
    const [saving, setSaving] = useState(false);
    const [previewPrice, setPreviewPrice] = useState<number | null>(null);

    // Form state for pricing
    const [formData, setFormData] = useState({
        displayPrice: '',
        displayPriceLabel: 'Starting from',
        displayPricePeriod: '/month',
        regularPrice: '',
        priceDisclaimer: '*Rates vary based on profile',
        promoHeadline: '',
        promoSubheadline: '',
        urgencyText: '',
        ctaText: 'Get Your Free Quote',
        ctaSubtext: 'Takes 2 minutes • No obligation',
        promoStartDate: '',
        promoEndDate: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersRes, statesRes] = await Promise.all([
                fetch(getApiUrl('/api/call-offers')),
                fetch(getApiUrl('/api/states?limit=100')),
            ]);

            const offersData = await offersRes.json();
            const statesData = await statesRes.json();

            setOffers(Array.isArray(offersData) ? offersData : []);
            setStates(Array.isArray(statesData.states) ? statesData.states : (Array.isArray(statesData) ? statesData : []));
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (offer: CallOffer) => {
        setEditingOffer(offer);
        setFormData({
            displayPrice: offer.displayPrice?.toString() || '',
            displayPriceLabel: offer.displayPriceLabel || 'Starting from',
            displayPricePeriod: offer.displayPricePeriod || '/month',
            regularPrice: offer.regularPrice?.toString() || '',
            priceDisclaimer: offer.priceDisclaimer || '*Rates vary based on profile',
            promoHeadline: offer.promoHeadline || '',
            promoSubheadline: offer.promoSubheadline || '',
            urgencyText: offer.urgencyText || '',
            ctaText: offer.ctaText || 'Get Your Free Quote',
            ctaSubtext: offer.ctaSubtext || '',
            promoStartDate: offer.promoStartDate ? new Date(offer.promoStartDate).toISOString().split('T')[0] : '',
            promoEndDate: offer.promoEndDate ? new Date(offer.promoEndDate).toISOString().split('T')[0] : '',
        });
        setPreviewPrice(offer.displayPrice);
        setShowModal(true);
    };

    const calculateSavings = (display: number, regular: number) => {
        if (!display || !regular || regular <= display) return null;
        const amount = regular - display;
        const percentage = Math.round((amount / regular) * 100);
        return { amount, percentage };
    };

    const handleSave = async () => {
        if (!editingOffer) return;

        const displayPrice = parseFloat(formData.displayPrice);
        if (isNaN(displayPrice) || displayPrice <= 0) {
            alert('Please enter a valid display price');
            return;
        }

        const regularPrice = formData.regularPrice ? parseFloat(formData.regularPrice) : null;
        const savings = regularPrice ? calculateSavings(displayPrice, regularPrice) : null;

        setSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/call-offers/${editingOffer.id}`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayPrice,
                    displayPriceLabel: formData.displayPriceLabel,
                    displayPricePeriod: formData.displayPricePeriod,
                    regularPrice,
                    savingsAmount: savings?.amount || null,
                    savingsPercentage: savings?.percentage || null,
                    priceDisclaimer: formData.priceDisclaimer,
                    promoHeadline: formData.promoHeadline || null,
                    promoSubheadline: formData.promoSubheadline || null,
                    urgencyText: formData.urgencyText || null,
                    ctaText: formData.ctaText,
                    ctaSubtext: formData.ctaSubtext || null,
                    promoStartDate: formData.promoStartDate || null,
                    promoEndDate: formData.promoEndDate || null,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (price: number | null) => {
        if (price === null || price === undefined) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStateNames = (stateIds: string[]) => {
        if (!stateIds || stateIds.length === 0) return 'All states';
        return stateIds.map(id => states.find(s => s.id === id)?.code || id).join(', ');
    };

    const handlePriceChange = (value: string) => {
        setFormData(prev => ({ ...prev, displayPrice: value }));
        const num = parseFloat(value);
        setPreviewPrice(isNaN(num) ? null : num);
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-green-600" />
                            Pricing Manager
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage promotional pricing and messaging for insurance offers
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-green-900 mb-2">💡 How Dynamic Pricing Works</h3>
                    <div className="space-y-2 text-sm text-green-700">
                        <p>
                            <strong>Display Price:</strong> The attractive price shown on pages (e.g., &ldquo;Starting from $59&rdquo;)
                        </p>
                        <p>
                            <strong>Regular Price:</strong> Original price for comparison (shows savings like &ldquo;Save $91&rdquo;)
                        </p>
                        <p>
                            <strong>Promotional Messaging:</strong> Customize headlines, subheadlines, and urgency text to boost conversions
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                            💰 Lower display prices with clear savings messaging typically result in 40-60% more form fills
                        </p>
                    </div>
                </div>

                {/* Pricing Preview Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">Live Preview Example</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                            <div className="text-xs text-blue-200 mb-1">Starting from</div>
                            <div className="text-4xl font-bold">$59<span className="text-lg font-normal">/month</span></div>
                            <div className="text-sm text-blue-200 mt-1 line-through">$150</div>
                            <div className="text-green-300 text-sm font-medium mt-1">Save $91 (60% off)</div>
                        </div>
                        <div className="md:col-span-2 bg-white/10 backdrop-blur rounded-lg p-4">
                            <div className="text-lg font-bold mb-1">Limited Time: Save up to 60%</div>
                            <div className="text-sm text-blue-100 mb-3">
                                Drivers in California are qualifying for rates as low as $59/month
                            </div>
                            <button className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition">
                                Get Your Free Quote
                            </button>
                            <div className="text-xs text-blue-200 mt-2">Takes 2 minutes • No obligation</div>
                        </div>
                    </div>
                </div>

                {/* Offers Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : offers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No call offers yet. Create offers in the Call Offers section first.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Display Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Savings</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${offer.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {offer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{offer.name}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {offer.insuranceType?.name || 'All Types'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {offer.displayPrice ? (
                                                <div>
                                                    <span className="text-green-600 font-bold">
                                                        {formatPrice(offer.displayPrice)}
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-1">{offer.displayPricePeriod}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {offer.savingsAmount ? (
                                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                                    <TrendingDown className="w-4 h-4" />
                                                    <span>Save {formatPrice(offer.savingsAmount)}</span>
                                                    <span className="text-xs">({offer.savingsPercentage}%)</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {offer.promoHeadline ? (
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEditModal(offer)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Edit Pricing
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit Pricing Modal */}
            {showModal && editingOffer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 p-6">
                        <h2 className="text-xl font-bold mb-1">Edit Pricing</h2>
                        <p className="text-gray-500 text-sm mb-4">{editingOffer.name}</p>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Live Preview */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white mb-4">
                                <div className="text-xs text-blue-200 mb-1">{formData.displayPriceLabel}</div>
                                <div className="text-3xl font-bold">
                                    {previewPrice ? formatPrice(previewPrice) : '$0'}
                                    <span className="text-base font-normal">{formData.displayPricePeriod}</span>
                                </div>
                                {formData.regularPrice && parseFloat(formData.regularPrice) > (previewPrice || 0) && (
                                    <div className="text-sm text-blue-200 mt-1 line-through">
                                        {formatPrice(parseFloat(formData.regularPrice))}
                                    </div>
                                )}
                                {(() => {
                                    const savings = formData.regularPrice && previewPrice
                                        ? calculateSavings(previewPrice, parseFloat(formData.regularPrice))
                                        : null;
                                    return savings ? (
                                        <div className="text-green-300 text-sm font-medium mt-1">
                                            Save {formatPrice(savings.amount)} ({savings.percentage}% off)
                                        </div>
                                    ) : null;
                                })()}
                            </div>

                            {/* Price Settings */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Display Price <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={formData.displayPrice}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                            placeholder="59"
                                            className="w-full pl-7 pr-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price Label</label>
                                    <select
                                        value={formData.displayPriceLabel}
                                        onChange={(e) => setFormData({ ...formData, displayPriceLabel: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="Starting from">Starting from</option>
                                        <option value="As low as">As low as</option>
                                        <option value="Only">Only</option>
                                        <option value="From">From</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Period</label>
                                    <select
                                        value={formData.displayPricePeriod}
                                        onChange={(e) => setFormData({ ...formData, displayPricePeriod: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="/month">/month</option>
                                        <option value="/year">/year</option>
                                        <option value="">(no period)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Regular Price (for comparison)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={formData.regularPrice}
                                            onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                                            placeholder="150"
                                            className="w-full pl-7 pr-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Shows strikethrough price and calculates savings
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price Disclaimer</label>
                                    <input
                                        type="text"
                                        value={formData.priceDisclaimer}
                                        onChange={(e) => setFormData({ ...formData, priceDisclaimer: e.target.value })}
                                        placeholder="*Rates vary based on profile"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Promotional Messaging */}
                            <div className="border-t pt-4">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-600" />
                                    Promotional Messaging
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Promo Headline</label>
                                        <input
                                            type="text"
                                            value={formData.promoHeadline}
                                            onChange={(e) => setFormData({ ...formData, promoHeadline: e.target.value })}
                                            placeholder="Limited Time: Save up to 60%"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Promo Subheadline</label>
                                        <input
                                            type="text"
                                            value={formData.promoSubheadline}
                                            onChange={(e) => setFormData({ ...formData, promoSubheadline: e.target.value })}
                                            placeholder="Drivers are qualifying for rates as low as $59/month"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Urgency Text</label>
                                            <input
                                                type="text"
                                                value={formData.urgencyText}
                                                onChange={(e) => setFormData({ ...formData, urgencyText: e.target.value })}
                                                placeholder="Offer ends soon"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">CTA Text</label>
                                            <input
                                                type="text"
                                                value={formData.ctaText}
                                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                                placeholder="Get Your Free Quote"
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">CTA Subtext</label>
                                        <input
                                            type="text"
                                            value={formData.ctaSubtext}
                                            onChange={(e) => setFormData({ ...formData, ctaSubtext: e.target.value })}
                                            placeholder="Takes 2 minutes • No obligation"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="border-t pt-4">
                                <h3 className="font-medium text-gray-900 mb-3">Promotion Schedule (Optional)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.promoStartDate}
                                            onChange={(e) => setFormData({ ...formData, promoStartDate: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.promoEndDate}
                                            onChange={(e) => setFormData({ ...formData, promoEndDate: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Pricing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
