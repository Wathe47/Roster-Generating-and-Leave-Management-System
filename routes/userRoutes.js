const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("passport");
const multer = require("multer");
const Email = require("../utils/email");

const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize upload variable with multer middleware
const upload = multer({ storage: storage });

router.post("/register", authController.signup);
router.post("/login", authController.login);

// Routes for password reset
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Routes for updating user password and profile
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// Route for adding user to department (private, restricted to admin/department head)
router.patch("/addToDepartment", userController.addToDepartment);

// Routes for user CRUD operations
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Check if the user is authenticated
    return next(); // User is authenticated, allow access to the next middleware or route handler
  }
  res.redirect("/login"); // User is not authenticated, redirect to login page
}

router.get("/dashboard", isLoggedIn, (req, res) => {
  console.log("auth:", req.auth);
  res.render("dashboard");
});

// Update user's profile picture
router.post("/picture", upload.single("avatar"), (req, res, next) => {
  // Get user ID from request object
  const userId = req.user.id;

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ file: "No file uploaded" });
  }

  // Save file path to database
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    user.avatar = req.file.path;
    user.save((err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json(user);
    });
  });
});

// Route for getting current user
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      name: req.user.name,
      email: req.user.email,
    });
  }
);

//TESTING ROUTES
router.post("/testing-email", userController.testingEmail);

router.post("/generate-test-users", userController.generateTestUsers);

module.exports = router;
