export default function CarrierLogos() {
    const carriers = [
        { name: 'Progressive', color: '#0077C8' },
        { name: 'Allstate', color: '#0033A0' },
        { name: 'Liberty Mutual', color: '#F7B500' },
        { name: 'USAA', color: '#003366' },
        { name: 'The General', color: '#E31837' },
        { name: 'Bristol West', color: '#00457C' },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
            {carriers.map((carrier) => (
                <div
                    key={carrier.name}
                    className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20"
                >
                    <span className="text-white font-semibold text-sm">{carrier.name}</span>
                </div>
            ))}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white/70 text-sm">+120 more</span>
            </div>
        </div>
    );
}

