import express, { Router } from "express";

export const auth = Router();

auth.use(express.json());

auth.post("/api/signIn", (req, res) => {
  const validUsers = [
    { id: "1", name: "Manager", roles: ["admin"] },
    { id: "2", name: "SalesRep" },
  ];
  const user = validUsers.find((user) => user.name === req.body.username);
  if (user) {
    req.session!["user"] = user;
    res.json(user);
  } else {
    res.sendStatus(403);
  }
});

auth.post("/api/signOut", (req, res) => {
  req.session!["user"] = null;
  res.json("signed out");
});
