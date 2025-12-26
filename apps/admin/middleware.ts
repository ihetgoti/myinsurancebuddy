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
