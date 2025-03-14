<<<<<<< HEAD
module.exports = (req, res) => {
    res.status(200).json({
      message: "Welcome to UW Room Booking API",
      availableRoutes: ["/api/search", "/api/advanced-search"],
      documentation: "访问 /api/search 和 /api/advanced-search 使用 POST 请求"
    });
=======
module.exports = (req, res) => {
    res.status(200).json({
      message: "Welcome to UW Room Booking API",
      availableRoutes: ["/api/search", "/api/advanced-search"],
      documentation: "访问 /api/search 和 /api/advanced-search 使用 POST 请求"
    });
>>>>>>> bae8c230bc388cad2c369e1764d9724f7fce87d7
  };