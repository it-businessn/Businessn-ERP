const express = require("express");
const router = express.Router();

const { storageSpace } = require("../services/fileService");
const resourceController = require("../controllers/resourceController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, resourceController.getResources);

router.get("/download/:filename", resourceController.downloadResource);

router.get(
	"/type/:fileType/:companyName",
	authenticateToken,
	resourceController.getCompanyResources,
);

router.get("/:fileType", authenticateToken, resourceController.getResource);

router.get("/:companyName", authenticateToken, resourceController.getResourcesByCompany);

router.post(
	"/upload",
	authenticateToken,
	storageSpace.single("file"),
	resourceController.createResource,
);

router.put("/:id", authenticateToken, resourceController.updateResource);

router.delete("/:id", authenticateToken, resourceController.deleteResource);

module.exports = router;
