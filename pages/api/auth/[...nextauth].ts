import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {adminEmails} from '../../../src/constants';

const GOOGLE_AUTHORIZATION_URL =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code',
    });

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
    try {
        const queryParams = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        };
        // @ts-ignore
        const url =
            'https://oauth2.googleapis.com/token?' +
            new URLSearchParams(queryParams as Record<string, string>);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        // console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export default NextAuth({
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET, //openssl rand -base64 32
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: GOOGLE_AUTHORIZATION_URL,
        }),
    ],
    callbacks: {
        async redirect({url, baseUrl}) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        async signIn({user, account, profile, email, credentials}) {
            if (account.provider === 'google') {
                return adminEmails.includes(profile?.email ?? '');
            }
            return false;
        },
        async session({session, user, token}) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            // @ts-ignore
            session['user'] = token.user;
            session['userRole'] = token.userRole;

            return session;
        },
        async jwt({token, user, account}) {
            token.userRole = 'unauthorised'; // default
            if (token) {
                if (token.user) {
                    if (adminEmails.includes((token as any).user.email)) {
                        token.userRole = 'admin'; // if admin logins
                    }
                }
            }
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    accessTokenExpires:
                        Date.now() + (account as any).expires_at * 1000,
                    refreshToken: account.refresh_token,
                    user,
                };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token as any).accessTokenExpires) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
    },
});
