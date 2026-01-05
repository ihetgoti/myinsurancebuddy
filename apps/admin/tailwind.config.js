const sharedConfig = require('@myinsurancebuddy/app-config/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
    ...sharedConfig,
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        ...sharedConfig.theme,
        extend: {
            ...sharedConfig.theme?.extend,
        },
    },
    plugins: [
        ...sharedConfig.plugins || [],
        require('@tailwindcss/typography'),
    ],
};
