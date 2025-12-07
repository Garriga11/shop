// lib/auth.ts or components/auth.ts

/**
 * NextAuth Configuration with Session Timeout
 * 
 * Session Timeout Settings:
 * - maxAge: How long a session is valid (30 minutes default)
 * - updateAge: How often to refresh the session on activity (5 minutes)
 * 
 * How it works:
 * 1. User logs in → Session created with 30-minute expiry
 * 2. User is active → Session refreshes every 5 minutes (sliding window)
 * 3. User inactive for 30 minutes → Session expires, redirect to login
 * 
 * To customize timeout:
 * - For shorter timeout (15 min): maxAge: 15 * 60
 * - For longer timeout (2 hours): maxAge: 2 * 60 * 60
 * - For full day: maxAge: 24 * 60 * 60
 */

import type {AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma"; 

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            roleId: true,
            role: {
              select: {
                name: true,
              }
            }
          },
        });

        if (!user) {
          console.error("User not found");
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.error("Invalid password");
          return null;
        }

        console.log("🔍 Auth Debug - User found:", {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
          roleName: user.role?.name
        });

        return {
          id: user.id,
          name: user.name ?? "User",
          email: user.email,
          role: user.role?.name || 'USER', // Use actual role name from Role table
          roleId: user.roleId, // Keep roleId for compatibility
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = (user as any).role || 'USER'; // Use actual role name from Role table
        token.roleId = (user as any).roleId; // Store roleId separately for compatibility
        
        // Set initial timestamp when token is created
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
        
        console.log("🔍 JWT Debug - Token created:", {
          email: token.email,
          role: token.role,
          roleId: token.roleId,
          issuedAt: new Date((token.iat as number) * 1000).toISOString()
        });
      }
      
      // Check if token has expired (optional - NextAuth handles this automatically)
      // But we can add custom logic here if needed
      
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        (session.user as any).roleId = token.roleId as string; // Add roleId to session
        
        console.log("🔍 Session Debug - Session created:", {
          email: session.user.email,
          role: session.user.role,
          roleId: (session.user as any).roleId
        });
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    // Session timeout configuration
    maxAge: 30 * 60, // 30 minutes (in seconds)
    // Alternative options:
    // maxAge: 60 * 60, // 1 hour
    // maxAge: 8 * 60 * 60, // 8 hours (work day)
    // maxAge: 24 * 60 * 60, // 24 hours
    
    // Update session age on every request (sliding window)
    updateAge: 5 * 60, // Update session every 5 minutes of activity
  },

  pages: {
    signIn: "/login",
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 60, // JWT token expires after 30 minutes
  },
};