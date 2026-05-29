const express = require("express");
const router = express.Router();
const { getMaterial, addMaterial, updateMaterial, deleteMaterial } = require("../../controllers/Other/material.controller.js");
const upload = require("../../middlewares/multer.middleware.js");

// Optional file upload — for video type, no file is required
const optionalUpload = (req, res, next) => {
  upload.single("material")(req, res, (err) => {
    if (err) {
      // If no file is sent (video type), that's OK
      return next();
    }
    next();
  });
};

router.post("/getMaterial", getMaterial);
router.post("/addMaterial", optionalUpload, addMaterial);
router.put("/updateMaterial/:id", updateMaterial);
router.delete("/deleteMaterial/:id", deleteMaterial);

module.exports = router;
