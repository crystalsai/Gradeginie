const Material = require("../../models/Other/material.model");
const studentDetails = require("../../models/Students/details.model");
const { sendMaterialNotification } = require("../../utils/mailer");
const { getUploadedFileValue } = require("../../utils/uploadedFile");

const getMaterial = async (req, res) => {
    try {
        let material = await Material.find(req.body);
        if (!material) {
            return res
                .status(400)
                .json({ success: false, message: "No Material Available!" });
        }
        res.json({ success: true, message: "Material Found!", material });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addMaterial = async (req, res) => {
    let { faculty, subject, title, materialType, videoLink } = req.body;
    try {
        // For video type, use a placeholder filename; for pdf, use uploaded file
        const type = materialType || "pdf";
        const fileLink = type === "video" ? (videoLink || "") : getUploadedFileValue(req.file);

        if (!fileLink) {
            return res.status(400).json({ success: false, message: "Please provide a file or video link!" });
        }

        await Material.create({
            faculty,
            link: fileLink,
            subject,
            title,
            materialType: type,
            videoLink: type === "video" ? videoLink : "",
        });

        // Send email notification to all students (background, non-blocking)
        try {
            const students = await studentDetails.find({}, { email: 1 });
            const emails = students.map(s => s.email).filter(Boolean);
            if (emails.length > 0) {
                sendMaterialNotification(emails, title, subject, faculty, type, type === "video" ? videoLink : "").catch(() => {});
            }
        } catch (_) {}

        const data = {
            success: true,
            message: "Material Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateMaterial = async (req, res) => {
    let { faculty, link, subject, title, materialType, videoLink } = req.body;
    try {
        let material = await Material.findByIdAndUpdate(req.params.id, {
            faculty,
            link,
            subject,
            title,
            materialType: materialType || "pdf",
            videoLink: videoLink || "",
        });
        if (!material) {
            return res
                .status(400)
                .json({ success: false, message: "No Material Available!" });
        }
        res.json({
            success: true,
            message: "Material Updated!",
        });
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteMaterial = async (req, res) => {
    try {
        let material = await Material.findByIdAndDelete(req.params.id);
        if (!material) {
            return res
                .status(400)
                .json({ success: false, error: "No Material Available!" });
        }
        res.json({
            success: true,
            message: "Material Deleted!",
            material,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { getMaterial, addMaterial, updateMaterial, deleteMaterial }
