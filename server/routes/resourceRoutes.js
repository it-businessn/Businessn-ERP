const express = require("express");
const router = express.Router();

const { storageSpace } = require("../services/fileService");
const resourceController = require("../controllers/resourceController");

router.get("/", resourceController.getResources);

router.get("/:fileType", resourceController.getResource);

router.get("/download/:filename", resourceController.downloadResource);

router.get(
	"/type/:fileType/:companyName",
	resourceController.getCompanyResources,
);

router.get("/:companyName", resourceController.getResourcesByCompany);

router.post(
	"/upload",
	storageSpace.single("file"),
	resourceController.createResource,
);

router.put("/:id", resourceController.updateResource);

router.delete("/:id", resourceController.deleteResource);

module.exports = router;
