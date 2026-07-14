const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");

const me = async (req, res) => {
  try {
    // req.user should be set by your auth middleware after verifying JWT
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

module.exports = {
  me,
};
