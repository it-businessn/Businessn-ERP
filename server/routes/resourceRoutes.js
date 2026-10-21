const express = require("express");
const router = express.Router();

const { storageSpace } = require("../services/fileService");
const resourceController = require("../controllers/resourceController");
const { authenticateToken } = require("../middleware/auth");
const Resource = require("../models/CompanyResource");
const {
	authorizeCompanyAccess,
	authorizeMultipartCompany,
	applyCompanyParamGuards,
	requireDocumentInCallerCompany,
} = require("../middleware/authorize");

// All resource routes require authentication (REV-002: previously per-route, which
// left the :companyName params without a tenant guard).
router.use(authenticateToken);
// NEW-06 (CHANGES.md API #11): this router is mounted before the app-level
// authorizeCompanyAccess, so body / query company names were never checked.
router.use(authorizeCompanyAccess);
applyCompanyParamGuards(router);

router.get("/", resourceController.getResources);

// FIX (AUD-009): resource download was public.
router.get("/download/:filename", resourceController.downloadResource);

router.get("/type/:fileType/:companyName", resourceController.getCompanyResources);

// CHANGES.md API #1: "/:fileType" (getResource, unscoped) used to shadow this route, so the
// client's GET /resource/<company> searched fileType=<company> and got []. No
// client calls "/:fileType" (it uses /type/:fileType/:companyName), so it is removed.
router.get("/:companyName", resourceController.getResourcesByCompany);

// NEW-06 (CHANGES.md API #11): id-addressed routes had no tenant check.
const requireOwnResource = requireDocumentInCallerCompany(Resource, { label: "Resource" });

router.post(
	"/upload",
	storageSpace.single("file"),
	authorizeMultipartCompany,
	resourceController.createResource,
);

router.put("/:id", requireOwnResource, resourceController.updateResource);

router.delete("/:id", requireOwnResource, resourceController.deleteResource);

module.exports = router;
