import { prisma } from './prisma';
import { path } from 'ramda';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  role: {
    id: number,
    name: string
  };
  email: string | null;
}

interface Account {
  provider: string;
}

interface User extends UserProfile {
  user: UserProfile;
  account: Account;
}




export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
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
      credentials: {},
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

        // https://github.com/nextauthjs/next-auth/issues/7638
        if (user.error) {
          throw new Error(user.error);
        } else {
          return user;
        }
      },
    }),
  ],
  callbacks: {
    // @ts-ignore
    signIn: async (user: User) => {
      if (user && user.account.provider === 'credentials') {
        return user;
      }

      if (user && user.account.provider === 'github') {
        const flattenedUser = await path(['user'], user);
        if (flattenedUser.email) {
          const existingAccount = await prisma.user.findUnique({
            where: {
              email: flattenedUser.email,
            },
            include: {
              role: true,
            },
          });

          if (!existingAccount) {
            const newUser = await prisma.user.create({
              data: {
                email: flattenedUser.email,
                name: flattenedUser.name,
                image: flattenedUser.image,
                roleId: 1,
              },
            });

            return newUser;
          } else {
            return existingAccount;
          }
        }
      }
    },
    jwt: async ({ token, user, account, trigger, session }) => {
      if (user) {
        const myUser = user as User;
        if (account?.provider === 'credentials') {
          return {
            ...token,
            id: user.id,
            role: myUser?.role.name,
          };
        }
        if (account?.provider === 'github') {
          if (user?.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              include: { role: true },
            });

            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser?.role.name;
            }
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
