import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

// import { auth } from "$lib/server/services/auth.ts";

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      return `Hello, ${input.name}!`;
    },
  }),
  // getGreetingLog: defineAction({
  //   handler: async (_input, context) => {
  //     const isAuth = await auth.api.getSession({
  //       headers: context.request.headers,
  //     });
  //
  //     if (!isAuth) {
  //       throw new ActionError({
  //         code: "UNAUTHORIZED",
  //         message: "User must be logged in.",
  //       });
  //     }
  //
  //     return `Hello, ${isAuth.user.name}!`;
  //   },
  // }),
};
