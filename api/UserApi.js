exports.index = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "Welcome To Authenticate Login Registration System :)"
    })
}



exports.logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        status: 'success',
        message: "Logout Successfully"
    })
}