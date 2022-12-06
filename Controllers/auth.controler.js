import User from "../model/userSchema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in separate file in utils
};

/************************************************
 *  @SIGNUP
 *  @route https://localhost:4000/api/auth/signup
 *  @description User signup Controller for creating a new user
 *  @parametes
 *  @return User Object
 *************************************************/

export const signUP = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("please fill the fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const token = user.getJwtToken();
  console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/************************************************
 *  @LOGIN
 *  @route https://localhost:4000/api/auth/login
 *  @descriptionUser Sign In Controller for loging new user
 *  @parametes Email, password
 *  @return User Object
 *************************************************/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("please fill the fields", 400);
  }
  const user = User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    const token = user.getJwtToken();
    user.password.undefined;
    res.cookie("token", token, cookieOptions);
    return req.status(200).json({
      success: true,
      token,
      user,
    });
  }
  throw new CustomError("Invalid crdentials - pass", 400);
});

/************************************************
 *  @LOGOUT
 *  @route https://localhost:4000/api/auth/logout
 *  @description User Logout by clearing user cookies
 *  @parametes
 *  @return success message
 *************************************************/

export const logout = asyncHandler(async (_req, res) => {
  /**
   * res.clearCookie()
   */
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
/************************************************
 *  @FORGOT_PASSWORD
 *  @route https://localhost:4000/api/auth/password/forget
 *  @description user will submit email and we will generate a token
 *  @parametes Email
 *  @return Success Messae - email send
 *************************************************/

export const forgot = asyncHandler(async (_req, res) => {
  /**
   * res.clearCookie()
   */
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
