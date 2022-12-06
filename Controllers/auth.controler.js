import User from "../model/userSchema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import mailHelper from "../utils/mailhelper";
import crypto from "crypto";

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
  const user = await User.findOne({ email }).select("+password");

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
 *  @route https://localhost:4000/api/auth/password/forgot
 *  @description user will submit email and we will generate a token
 *  @parametes Email
 *  @return Success Messae - email send
 *************************************************/

export const forgot = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email === null || email === "") {
    throw new CustomError("Email is not Available", 404);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const resetToken = user.generateForgetPaswordToken();

  await user.save({ validateBeforesave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`;

  const text = `Your password rest link is  
 \n\ ${resetUrl}
`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Password Reste Email for website",
      text: text,
    });

    res.status(200).json({
      success: true,
      message: ` Email send to ${user.email}`,
    });
  } catch (err) {
    // clear the forget password feilds
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforesave: false });
    throw new CustomError(err.message || "Email Failed to send process");
  }
});

/************************************************
 *  @RESET_PASSOWORD
 *  @route https://localhost:4000/api/auth/password/reset/:Token
 *  @description User will be able to reset password based on url token
 *  @parametes token form url, password and confirmpass
 *  @return Success Messae - user object
 *************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
  const { Token: resetToken } = req.params;
  const { password, confirmPasword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Password token is invalid or expired", 400);
  }

  if (password !== confirmPasword) {
    throw new CustomError("Password and conform password des not match", 400);
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save({ validateBeforesave: false });

  const token = user.getJwtToken();
  user.password = undefined;
  //helper method for cookie will be created after finishing
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user,
  });
});

// TODO: create a controller for change password

/************************************************
 *  @CHANGE_PASSSWORD
 *  @route https://localhost:4000/api/auth/password/change
 *  @description User will be able to reset password based on url token
 *  @parametes token form url, password and confirmpass
 *  @return Success Messae - user object
 *************************************************/
export const changePassword = asyncHandler(async (req, res) => {
  /**
   *
   */
});

/************************************************
 * @GET_PROFILE
 *  @REQUEST_TYPE GET
 *  @route https://localhost:4000/api/auth/profile
 *  @description check for token and populate req.user
 *  @parametes token form url, password and confirmpass
 *  @return Success Messae - user object
 *************************************************/
export const getPorfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
  /**
   *
   */
});
