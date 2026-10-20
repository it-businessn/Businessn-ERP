const express = require("express");
const router = express.Router();

const { storageSpace } = require("../services/fileService");
const resourceController = require("../controllers/resourceController");
const { authenticateToken } = require("../middleware/auth");
const {
	authorizeMultipartCompany,
	applyCompanyParamGuards,
} = require("../middleware/authorize");

// All resource routes require authentication (REV-002: previously per-route, which
// left the :companyName params without a tenant guard).
router.use(authenticateToken);
applyCompanyParamGuards(router);

router.get("/", resourceController.getResources);

// FIX (AUD-009): resource download was public.
router.get("/download/:filename", resourceController.downloadResource);

router.get("/type/:fileType/:companyName", resourceController.getCompanyResources);

router.get("/:fileType", resourceController.getResource);

// NOTE: unreachable — "/:fileType" above matches first (pre-existing, AUD-032).
router.get("/:companyName", resourceController.getResourcesByCompany);

router.post(
	"/upload",
	storageSpace.single("file"),
	authorizeMultipartCompany,
	resourceController.createResource,
);

router.put("/:id", resourceController.updateResource);

router.delete("/:id", resourceController.deleteResource);

module.exports = router;
