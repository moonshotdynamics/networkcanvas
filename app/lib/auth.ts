import { prisma } from './prisma';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
        profile(profile) {
        return { role: profile.role ?? "participant", ...profile }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: any) => {
        const res = await fetch(`${process.env.BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn(user: any, profile: any) {
      console.log(profile, "PROFILE");
      const flattenedUser = user.user;
      const existingAccount = await prisma.user.findUnique({
        where: {
          email: flattenedUser.email,
        },
      });

      if (!existingAccount) {
        let participantRole = await prisma.role.findFirst({
          where: { name: 'participant' },
        });

        if (!participantRole) {
          participantRole = await prisma.role.create({
            data: {
              name: 'participant',
            },
          });
        }

        const newUser = await prisma.user.create({
          data: {
            email: flattenedUser.email,
            name: flattenedUser.name,
            roleId: participantRole.id,
          },
        });

        return {
          ...user,
          role: newUser.roleId,
        };
      } else {
        return {
          ...existingAccount,
        };
      }
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role.name,
        };
      }
      return token;
    },
  },
};
