const express = require("express");
const router = express.Router();
const controller = require("../controllers/bill-controller");
const security = require("../middleware/security");

router.get("/godine/", security, controller.getGodine);
router.post("/nov-poverilac/", security, controller.postAddPoverilac);
router.get("/poverioci/:userId", security, controller.getPoverioci);
router.patch("/edit-poverilac/", security, controller.editPoverilac);
router.delete("/delete-creditor/", security, controller.deleteCreditor);
router.patch("/edit-bill/", security, controller.editBill);
router.get("/periodi/", security, controller.getPeriodi);
router.post("/add-bill/", security, controller.postAddBill);
// router.get("/racunu/single/:racunId/:userId/");
router.get("/racuni/:userId/", security, controller.getRacuni);
router.delete("/delete-bill/:racunId", security, controller.deleteBill);

router.post("/add-payment/", security, controller.postAddPayment);
router.get("/get-payments/", security, controller.getPlacanja);
router.delete("/delete-payment/", security, controller.deletePayment);
router.patch("/edit-payment/", security, controller.editPayment);

router.get("/graf1/:userId", security, controller.getGraf1);
router.get("/graf12/:userId", security, controller.getGraf12);
router.get("/graf2/:userId", security, controller.getGraf2);
router.get("/graf22/:userId", security, controller.getGraf22);
router.get("/graf31/:userId", security, controller.getGraf31);
router.get("/graf32/:userId", security, controller.getGraf32);
router.get("/graf33/:userId", security, controller.getGraf33);
router.get("/graf34/:userId", security, controller.getGraf34);

module.exports = router;
