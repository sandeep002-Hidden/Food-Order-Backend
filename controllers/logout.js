export default async function logout(req, res) {
  try {
    return res
      .clearCookie("orderNow", { sameSite: "None", secure: true })
      .json({ message: "successfully logout", success: true });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "error while logging out", success: false });
  }
}
