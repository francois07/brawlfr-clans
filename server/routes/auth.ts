import express, { Request, Response, Router } from "express";
const router = Router();
const passport = require("passport");

router.get("/", passport.authenticate("discord"));

router.get(
  "/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/",
    successRedirect: "/",
  })
);

router.get("/success", (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get("/forbidden", (req: express.Request, res: express.Response) => {
  res.sendStatus(401);
});

router.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect("http://localhost:5000/");
});

router.get("/me", (req: express.Request, res: express.Response) => {
  if (!req.isAuthenticated()) res.status(401);
  res.json({ status: 200, body: req.user });
});

module.exports = router;
