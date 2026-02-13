import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Additional middleware logic can go here
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow seeding endpoint without auth
                if (req.nextUrl.pathname === '/api/templates/seed') return true;

                // Allow free models endpoint (used by auto-generate page)
                if (req.nextUrl.pathname === '/api/free-models') return true;

                // Allow external API endpoints (use API key auth instead)
                if (req.nextUrl.pathname.startsWith('/api/external/')) return true;

                // Only allow ADMIN and SUPER_ADMIN roles
                if (!token) return false;
                return token.role === "ADMIN" || token.role === "SUPER_ADMIN";
            },
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/:path*",
    ],
};
