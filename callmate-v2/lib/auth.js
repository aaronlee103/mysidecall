// Sign-in: Facebook Login (Meta) via Auth.js, JWT sessions — no database.  [NEW — hackathon]
// The owner's legacy ADMIN_PASSWORD cookie still works as a fallback (see lib/viewer.js).
import FacebookProvider from "next-auth/providers/facebook";
import { logLogin } from "@/lib/activity";

export const authOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      authorization: { params: { scope: "public_profile,email" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login" },
  events: {
    async signIn({ profile, account }) {
      await logLogin({ id: `fb:${profile?.id || account?.providerAccountId}`, name: profile?.name || "", method: "facebook" });
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.uid = `fb:${profile.id}`;
        token.name = profile.name || token.name;
        token.picture = profile.picture?.data?.url || token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.uid || null;
      session.user.name = token.name || session.user.name;
      session.user.image = token.picture || session.user.image;
      return session;
    },
  },
};
