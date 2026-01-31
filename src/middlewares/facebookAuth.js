import passport from "passport";

export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

export const facebookAuthCallback = passport.authenticate("facebook", { session: false });
