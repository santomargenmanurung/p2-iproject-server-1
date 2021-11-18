const FormData = require("form-data");
const instanceImagekitUpload = require("../apis/instanceImagekit");

const uploadImageKit = async (req, res, next) => {
  try {
    if (req.file.size > 255000) {
      throw { name: "ImageSIzeToBig" };
    }

    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/png"
    ) {
      throw { name: "InvalidFormat" };
    }

    const form = new FormData();
    const { originalname } = req.file;
    const posterUrl = req.file.buffer.toString("base64");

    form.append("fileName", originalname);
    form.append("file", posterUrl);
    const response = await instanceImagekitUpload({
      url: "/files/upload",
      method: "POST",
      data: form,
      headers: { ...form.getHeaders() },
    });
    req.body.posterUrl = response.data.url;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = uploadImageKit;
