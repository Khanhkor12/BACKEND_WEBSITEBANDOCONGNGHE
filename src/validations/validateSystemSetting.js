const validator = require("validator");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

const validateSystemSetting = async (req, res, next) => {
  const {
    site_name,
    hotline,
    hotline_mua_online,
    hotline_bao_hanh,
    hotline_gop_y,
    support_email,
  } = req.body;

  if (!site_name || site_name.trim() === "") {
    return res.status(400).json({ field: "site_name", message: "Tên website không được để trống!" });
  }

  if (!hotline || hotline.trim().length < 8 || hotline.trim().length > 15) {
    return res.status(400).json({ field: "hotline", message: "Hotline không hợp lệ!" });
  }

  const hotlines = [
    { field: "hotline_mua_online", value: hotline_mua_online },
    { field: "hotline_bao_hanh", value: hotline_bao_hanh },
    { field: "hotline_gop_y", value: hotline_gop_y },
  ];

  for (const item of hotlines) {
    if (item.value && (item.value.trim().length < 8 || item.value.trim().length > 15)) {
      return res.status(400).json({ field: item.field, message: "Số điện thoại không hợp lệ!" });
    }
  }

  if (support_email && !validator.isEmail(support_email)) {
    return res.status(400).json({ field: "support_email", message: "Email không hợp lệ!" });
  }

  // Nếu có upload ảnh logo hoặc favicon thì kiểm tra size
  const files = req.files || {};
  const logoFile = files.logo?.[0];
  const faviconFile = files.favicon?.[0];

  if (logoFile && logoFile.size > MAX_IMAGE_SIZE) {
    return res.status(400).json({ field: "logo", message: "Logo không được vượt quá 5MB!" });
  }

  if (faviconFile && faviconFile.size > MAX_IMAGE_SIZE) {
    return res.status(400).json({ field: "favicon", message: "Favicon không được vượt quá 5MB!" });
  }

  next();
};

module.exports = { validateSystemSetting };
