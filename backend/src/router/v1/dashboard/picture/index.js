const express = require("express");
const { STATUS_SUCCESS } = require("../../../../states");
const { pictureService } = require("../../../../service/dashboard/picture");
const router = express.Router();
const hasAccess = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", hasAccess, upload.single("image"), async (req, res, next) => {
  try {
    const fileId = await pictureService.upload(req.file);

    return res.json({
      status: STATUS_SUCCESS,
      message: "Picture uploaded successfully",
      data: { fileId },
    });
  } catch (error) {
    next(error);
  }
});

exports.PictureRouter = router;
