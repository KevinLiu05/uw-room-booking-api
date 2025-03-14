export default function handler(req, res) {
    res.status(200).json({ 
      message: "Welcome to UW Room Booking API",
      availableRoutes: [
        "/api/search",
        "/api/advanced-search"
      ]
    });
  }