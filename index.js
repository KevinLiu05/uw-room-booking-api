module.exports = (req, res) => {
    res.status(200).json({
      message: "Welcome to UW Room Booking API",
      availableRoutes: ["/api/search", "/api/advanced-search"],
      documentation: "访问 /api/search 和 /api/advanced-search 使用 POST 请求"
    });
  };