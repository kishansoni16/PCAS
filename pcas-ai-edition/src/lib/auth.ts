import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@jiit.ac.in" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }
        
        // Mock authentication to unblock UI dev before DB is pushed
        if (credentials.email === 'student@jiit.ac.in') {
          return { id: '1', name: 'Kishan Soni', email: 'student@jiit.ac.in', role: 'STUDENT' };
        }
        if (credentials.email === 'admin@jiit.ac.in') {
          return { id: '2', name: 'Ms. Kashish Mahajan', email: 'admin@jiit.ac.in', role: 'ADMIN' };
        }
        if (credentials.email === 'recruiter@jiit.ac.in') {
          return { id: '3', name: 'HR Manager', email: 'recruiter@jiit.ac.in', role: 'RECRUITER' };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user || user.passwordHash !== credentials.password || user.role.toLowerCase() !== credentials.role.toLowerCase()) {
            return null;
          }
          
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error("Auth DB error:", error);
          // If DB is not available, we return null, unless they use mock
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/'
  }
};
