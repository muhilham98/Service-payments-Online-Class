var express = require('express');
var router = express.Router();
const apiOrderController = require('../controllers/apiOrderController');
//const { upload, uploadMultiple } = require('../middlewares/multer');


/* GET users listing. */
router.post('/', apiOrderController.createOrder);
//router.get('/', apiOrderController.getOrders);
router.get('/:id', apiOrderController.getOrders);
router.get('/', apiOrderController.getAllOrders);
// router.delete('/:id', apiImageController.deleteImages);

module.exports = router;