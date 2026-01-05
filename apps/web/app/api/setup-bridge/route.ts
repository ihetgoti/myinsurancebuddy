import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const templateName = 'Bridge Page (Lead Gen)';

        const existing = await prisma.template.findFirst({
            where: { name: templateName }
        });

        if (existing) {
            return NextResponse.json({ message: 'Template already exists', id: existing.id });
        }

        // Bridge Page HTML with CSS to hide global header/footer (until schema update takes effect)
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page_title}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Force hide global header and footer for Bridge Page */
        header, footer, nav { display: none !important; }
        
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .animate-progress {
            animation: progress 3s ease-out forwards;
        }
        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">

    <!-- Loading State -->
    <div id="loading" class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div class="mb-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
        <h2 class="text-2xl font-bold mb-2">Checking Coverage in <span class="text-blue-600">{{location}}</span></h2>
        <p class="text-gray-500 mb-8">Analyzing local rates and provider availability...</p>
        
        <div class="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div class="h-full bg-blue-600 rounded-full animate-progress"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 font-medium">
            <span>Verifying</span>
            <span>Checking</span>
            <span>Finalizing</span>
        </div>
    </div>

    <!-- Success State (Hidden initially) -->
    <div id="success" class="hidden w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center fade-in border-t-8 border-green-500 relative">
        <div class="absolute -top-12 left-1/2 transform -translate-x-1/2">
             <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-green-100 shadow-sm">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="mt-8">
            <h2 class="text-3xl font-bold mb-2">Matches Found!</h2>
            <p class="text-gray-600 mb-8 text-lg">We found providers in <strong>{{city_name}}</strong> offering coverage.</p>
            
            <div class="bg-blue-50 rounded-xl p-4 mb-8 text-left border border-blue-100 space-y-2">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <span class="text-sm font-medium text-gray-700">Verified Local Agents</span>
                </div>
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <span class="text-sm font-medium text-gray-700">Online Discount Eligible</span>
                </div>
                 <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <span class="text-sm font-medium text-gray-700">No Commitments</span>
                </div>
            </div>

            <a href="{{primary_offer_link}}" class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all text-xl mb-4 text-center no-underline">
                {{primary_offer_cta}} →
            </a>
            <p class="text-xs text-slate-400">Fast, secure, and free.</p>
        </div>
    </div>

    <!-- Script to simulate loading -->
    <script>
        setTimeout(() => {
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');
            
            // Fade out loading
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                loading.style.display = 'none';
                success.classList.remove('hidden');
            }, 300);
            
        }, 2200);
    </script>
</body>
</html>
        `;

        const template = await prisma.template.create({
            data: {
                id: 'bridge-page-v1',
                name: templateName,
                slug: 'bridge-page-lead-gen',
                htmlContent,
                showAffiliates: false,
                description: 'High-conversion bridge page for paid traffic (Facebook/Google Ads).',
                version: 1,
            }
        });

        return NextResponse.json({ message: 'Bridge Template created', id: template.id });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
