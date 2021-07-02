const midtransClient = require('midtrans-client');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const mongoose = require("mongoose");
//const { HOSTNAME } = process.env;
// Create Snap API instance
const { HOSTNAME, serverKey } = process.env;
const sha512 = require('js-sha512');
const helpers = require('./helpers');
const helpersUsers = require('./helpersUsers');
const { json } = require('express');

module.exports = {
    
    midtrans: async (req,res) => {
            
        const transactionTime = req.body.transaction_time;
        const transactionStatus = req.body.transaction_status;
        const transactionId = req.body.transaction_id;
        const statusMessage = req.body.status_message;
        const signatureKey = req.body.signature_key;
        const paymentType = req.body.payment_type;
        const statusCode = req.body.status_code;
        const orderId = req.body.order_id;
        const grossAmount = req.body.gross_amount;
        const fraudStatus = req.body.fraud_status;

        const signatureKeyCheck = sha512(orderId+statusCode+grossAmount+serverKey);

        if(signatureKey !== signatureKeyCheck){
            return res.status(400).json({
                status: 'error', 
                message: 'invalid signature key'
            });
        }
        // const helper = await helpers('il', 'ha');
        // console.log(helper);
        // // console.log(res);
        // return res.send('ok');
        // // return helper;
        //console.log(orderId)
        const order = await Order.findOne({_id: orderId});
        //console.log(order);
        if(!order){
            return res.status(404).json({
                status: 'error',
                message: 'order not found'
            });
        }

        if(order.status === 'success'){
            return res.status(405).json({
                status: 'error',
                message: 'not permitted'
            });
        }

        if (transactionStatus == 'capture'){
            if (fraudStatus == 'challenge'){
                // TODO set transaction status on your database to 'challenge'
                // and response with 200 OK
                order.status = 'challange';
            } else if (fraudStatus == 'accept'){
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                order.status = 'success';
            }
        } else if (transactionStatus == 'settlement'){
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            order.status = 'success';
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'deny' ||
          transactionStatus == 'expire'){
          // TODO set transaction status on your database to 'failure'
          // and response with 200 OK
          order.status = 'failure';
        } else if (transactionStatus == 'pending'){
          // TODO set transaction status on your database to 'pending' / waiting payment
          // and response with 200 OK
          order.status = 'pending';
        }

        Payment.create({
            orderId,
            price: grossAmount,
            responseData: req.body
        });

        await order.save();
        //await category.save();

       // console.log(order);

        if(order.status==='success'){
            helpers({
                'user_id': order.userId,
                'course_id': order.courseId
            });
        }

        return res.json({
            status: 'success',
            message: 'payment success'
        });

    },

    getAllPayments: async(req,res) => {
     

        //const data = await Payment.find();

        let { page } = req.query;
        
        if(typeof page === 'undefined' || page === null){
            page = 1;
        }
        //console.log(page);
        const options = {
            populate : 'orderId',
            limit: 5,
            page: page,
            pagination: true
        };

        //console.log(page);
          
        Payment.paginate({}, options, function (err, result) {
            //console.log(result.nextPage);
            
            let nextPage = `${HOSTNAME}/payments?page=${result.nextPage}`;

            let prevPage = `${HOSTNAME}/payments?page=${result.prevPage}`;

            if(typeof result.nextPage === 'undefined' || result.nextPage === null){
                nextPage = `${HOSTNAME}/payments`;
            }

            if(typeof result.prevPage  === 'undefined' || result.prevPage === null){
                prevPage = `${HOSTNAME}/payments`;
            }
           
            return res.json({
                status :'success',
                message: 'get all images successfully',
                data: result.docs,
                next_page_url: nextPage,
                prev_page_url: prevPage
            })
        
        });

       //res.json('ok');
    }

    // getDetailUserPayments:  async(req,res) => {

    //     const item = await Item.findOne({ _id: id })
    //         .populate({ path: 'imageId', select: 'id imageUrl' })
    //         .populate({ path: 'categoryId', select: 'id name' });

    //     helpersUsers('607b2fd4fafd0a555887c323');
    //     res.json('ok');
    // }
    
}