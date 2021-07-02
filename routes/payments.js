var express = require('express');
var router = express.Router();
const apiPaymentController = require('../controllers/apiPaymentController');
//const { upload, uploadMultiple } = require('../middlewares/multer');


/* GET users listing. */
router.post('/', apiPaymentController.midtrans);
router.get('/', apiPaymentController.getAllPayments);
//router.get('/coba', apiPaymentController.getDetailUserPayments);
//router.get('/', apiOrderController.getOrders);
// router.delete('/:id', apiImageController.deleteImages);

module.exports = router;