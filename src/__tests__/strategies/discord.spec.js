const { discordVerifyFunction } = require("../../strategies/discord");
const DiscordUser = require("../../database/schemas/DiscordUser");

jest.mock("../../database/schemas/DiscordUser");

let accessToken;
let refreshToken;
let profile;
let done;

beforeEach(() => {
  accessToken = "123";
  refreshToken = "456";
  profile = { id: "2313213424" };
  done = jest.fn((x) => x);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Discord Verify Function", () => {
  it("should find existing user and return it", async () => {
    const mockedUser = {
      id: "id_123",
      discordId: profile.id,
      createdAt: new Date(),
    };
    DiscordUser.findOne.mockResolvedValueOnce(mockedUser);
    await discordVerifyFunction(accessToken, refreshToken, profile, done);
    expect(DiscordUser.findOne).toHaveBeenCalledWith({ discordId: profile.id });
    expect(done).toHaveBeenCalledWith(null, mockedUser);
  });

  it("should create a new user and return it when no existing user is found", async () => {
    const newProfile = { id: "1234" };
    const newUser = { id: 1, discordId: "1234", createdAt: new Date() };
    DiscordUser.create.mockResolvedValueOnce(newUser);
    DiscordUser.findOne.mockResolvedValueOnce(undefined);
    await discordVerifyFunction(accessToken, refreshToken, newProfile, done);
    expect(DiscordUser.findOne).toHaveBeenCalledWith({
      discordId: newProfile.id,
    });
    expect(DiscordUser.create).toHaveBeenCalledWith({
      discordId: newProfile.id,
    });
    expect(done).toHaveBeenCalledWith(null, newUser);
  });

  it("should call done with error when findOne throws an error", async () => {
    const error = new Error("Test error");
    DiscordUser.findOne.mockRejectedValueOnce(error);
    await discordVerifyFunction(accessToken, refreshToken, profile, done);
    expect(done).toHaveBeenCalledWith(error, null);
  });
});
