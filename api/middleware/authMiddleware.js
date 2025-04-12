import { tokenDecode } from "../utils/token.js";

export default (req, res, next) => {
  try {
    let token = req.cookies.Token;

    // If token is not in cookies, check the authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = tokenDecode(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }

    // Set cookie for refresh token
    const options = {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.cookie("Token", decoded.refreshToken, options);
    // Attach user data to the request object
    req.user = {
      email: decoded.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
