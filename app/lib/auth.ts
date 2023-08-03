import { prisma } from './prisma';
import { path } from 'ramda';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';


interface UserProfile {
  id: number;
  name: string;
  image: string;
  role: string;
  email: string;
}
interface Account {
  provider: string;
}

interface User {
  user: UserProfile;
  account: Account;
  id: string;
  role: string;
}



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
        return { role: profile.role ?? 'participant', ...profile };
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
    signIn: async (user: User) => {
      if (user && user.account.provider === 'credentials') {
        return user;
      }
      if (user.account.provider === 'github') {
        const flattenedUser = path(['user'], user);
        const existingAccount = await prisma.user.findUnique({
          where: {
            email: flattenedUser.email,
          },
          include: {
            role: true,
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

          return newUser;
        } else {
          user.id = existingAccount.id;
          user.role = existingAccount.role;

          return true;
        }
      }
    },
    jwt: async ({ token, user, account, trigger, session }) => {
      if (user) {
        if (account?.provider === 'credentials') {
          return {
            ...token,
            id: user.id,
            role: user.role.name,
          };
        }
        if (account?.provider === 'github') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { role: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role.name;
          }
        }
      }

      if (trigger === 'update') {
        return {
          ...token,
          ...session.user,
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};
