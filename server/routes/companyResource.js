const express = require("express");
const multer = require("multer");
const router = express.Router();

const resourceController = require("../controllers/resourceController");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		const uniqueFileName = file.originalname;

		cb(null, uniqueFileName);
	},
});

const upload = multer({ storage });

router.get("/download/:filename", resourceController.downloadResource());

router.get("/type/:fileType/:name", resourceController.getResourceByTypes());
router.get("/:fileType", resourceController.getResourceByType());

router.get("/", resourceController.getResources());

router.get("/:id", resourceController.getResourcesByCompany());

router.post(
	"/upload",
	upload.single("file"),
	resourceController.createResource(),
);

router.put("/:id", resourceController.updateResource());

router.delete("/:id", resourceController.deleteResource);

module.exports = router;
