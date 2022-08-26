import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {label: 'Correo', type:'email', placeholder: 'tucorreo@correo.com'},
        password: {label: 'Contraseña', type:'password', placeholder: 'Contraseña'},
      },
      async authorize(credentials){

        console.log(credentials)

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password );

      }
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    })

  ],

  //Callbacks
  jwt:{

  },

  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  //Duraccion de Session
  session: {
    maxAge: 86400, // 1Dia   2592000 //30 dias
    strategy: 'jwt',
    updateAge: 3600 //1Hora
  },

  callbacks: {

    async jwt({token, account, user}){

      if(account){
        token.accessToken = account.access_token;

        switch(account.type){

          case 'credentials':
            token.user = user;
            break;

          case 'oauth':
            token.user = await dbUsers.OAUthToDbUser(user?.email || '', user?.name || '');
            break;
        }

      }

      return token;
    },

    async session({session, token, user}){

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }

  }

});