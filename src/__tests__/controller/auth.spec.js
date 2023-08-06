const { authRegisterController } = require("../../controllers/auth");
const User = require("../../database/schemas/User");
const { hashPassword } = require("../../utils/helpers");

jest.mock("../../utils/helpers", () => ({
  hashPassword: jest.fn(() => "hash password"),
}));

jest.mock("../../database/schemas/User");

const request = {
  body: {
    email: "fake_email",
    password: "fake_password",
  },
};

const response = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};

describe("authRegisterController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 400 when user already exists", async () => {
    User.findOne.mockResolvedValueOnce(true);
    await authRegisterController(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status).toHaveBeenCalledTimes(1);
  });

  it("should return an error message when user already exists", async () => {
    User.findOne.mockResolvedValueOnce(true);
    await authRegisterController(request, response);
    expect(response.send).toHaveBeenCalledWith({
      msg: "User already exists!",
    });
    expect(response.send).toHaveBeenCalledTimes(1);
  });

  it("should create new user when user does not exist", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({
      id: 1,
      email: "email",
      password: "password",
    });
    await authRegisterController(request, response);
    expect(hashPassword).toHaveBeenCalledWith("fake_password");
    expect(User.create).toHaveBeenCalledWith({
      email: "fake_email",
      password: "hash password",
    });
  });

  it("should return status 201 when new user is created", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({
      id: 1,
      email: "email",
      password: "password",
    });
    await authRegisterController(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.status).toHaveBeenCalledTimes(1);
  });

  it("should return a success message when new user is created", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({
      id: 1,
      email: "email",
      password: "password",
    });
    await authRegisterController(request, response);
    expect(response.send).toHaveBeenCalledWith({ msg: "User created!" });
    expect(response.send).toHaveBeenCalledTimes(1);
  });
});
