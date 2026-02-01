import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK_URI,
			profileFields: ["id", "displayName", "emails"],
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				cb(null, profile);
			} catch (error) {
				cb(error, null);
			}
		}
	)
);
