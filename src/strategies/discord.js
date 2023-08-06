const passport = require("passport");
const { Strategy } = require("passport-discord");
const DiscordUser = require("../database/schemas/DiscordUser");

async function discordVerifyFunction(accessToken, refreshToken, profile, done) {
  const { id: discordId } = profile;
  try {
    const discordUser = await DiscordUser.findOne({ discordId });
    if (discordUser) {
      return done(null, discordUser);
    } else {
      const newUser = await DiscordUser.create({ discordId });
      return done(null, newUser);
    }
  } catch (err) {
    return done(err, null);
  }
}

function setupDiscordPassportStrategy() {
  passport.use(
    new Strategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ["identify"],
      },
      discordVerifyFunction
    )
  );
}

module.exports = { setupDiscordPassportStrategy, discordVerifyFunction };
