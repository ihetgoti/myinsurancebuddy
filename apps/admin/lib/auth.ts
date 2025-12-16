import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@myinsurancebuddy/db";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log('[AUTH] authorize called with email:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('[AUTH] Missing credentials');
                    throw new Error("Invalid credentials");
                }

                try {
                    console.log('[AUTH] Looking up user...');
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });
                    console.log('[AUTH] User found:', user ? user.email : 'NOT FOUND');

                    if (!user || !user.isActive) {
                        console.log('[AUTH] User not found or inactive');
                        throw new Error("Invalid credentials");
                    }

                    // Only allow ADMIN and SUPER_ADMIN roles
                    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                        console.log('[AUTH] Insufficient role:', user.role);
                        throw new Error("Insufficient permissions");
                    }

                    console.log('[AUTH] Comparing password...');
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    );
                    console.log('[AUTH] Password valid:', isPasswordValid);

                    if (!isPasswordValid) {
                        console.log('[AUTH] Invalid password');
                        throw new Error("Invalid credentials");
                    }

                    console.log('[AUTH] Success! Returning user');
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('[AUTH] Error:', error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
