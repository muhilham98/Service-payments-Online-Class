const midtransClient = require('midtrans-client');
const Order = require('../models/Order');
const mongoose = require("mongoose");
const helpersUsers = require('./helpersUsers');
// Create Snap API instance
const { HOSTNAME, serverKey } = process.env;

module.exports = {
    createOrder: async (req,res) => {

        const { user, course } = req.body;

        const order = await Order.create({
            'userId' : user._id,
            'courseId' : course.id
        });

        let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction : false,
            serverKey : serverKey
        });
        // console.log(typeof serverKey);
        //console.log(user._id);
        //return res.json(order);
        let parameter = {
            "transaction_details": {
                "order_id": order._id,
                "gross_amount": course.price
            },
            "credit_card":{
                "secure" : true
            },
            "item_details":[
                {
                    "id": course.id,
                    "price": course.price,
                    "quantity": 1,
                    "name": course.name,
                    "category": course.category
                }
            ],
            "customer_details": {
                "first_name": user.name,
                "email": user.email
            }
        };

        order.dataOrderCourse = {
            'courseId': course.id,
            'courseName' : course.name,
            'courseCategory' : course.category,
            'coursePrice': course.price
        }
        
        snap.createTransaction(parameter)
            .then(async (transaction)=>{
                // transaction token
                let transactionRedirectUrl = transaction.redirect_url;
                order.snapUrlMidtrans = transactionRedirectUrl;
                await order.save();
                return res.json({
                    status :'success',
                    message: 'order successfully',
                    data:  order
                })
            });
    },


    getOrders: async (req,res) => {
        const { id } = req.params;
        //console.log(name);
        if(id){
            const orders = await Order.find({ userId: id});
            return res.json({
                status :'success',
                message: 'get order successfully',
                data: orders,
            });
        }

        const orders = await Order.find();
        return res.json({
            status :'success',
            message: 'get all orders successfully',
            data: orders
        });
    },

    getAllOrders: async (req,res) => {
        // const order = await Order.find();
        // return res.json({
        //     status :'success',
        //     message: 'get all orders successfully',
        //     data: order
        // });
        let arr = []
        let { page } = req.query;
        
        if(typeof page === 'undefined' || page === null){
            page = 1;
        }
        //console.log(page);
        const options = {
            limit: 5,
            page: page,
            pagination: true
        };

        //console.log(page);
          
        Order.paginate({}, options, async function (err, result) {
            //console.log(result.nextPage);
            
            let nextPage = `${HOSTNAME}/orders?page=${result.nextPage}`;

            let prevPage = `${HOSTNAME}/orders?page=${result.prevPage}`;

            if(typeof result.nextPage === 'undefined' || result.nextPage === null){
                nextPage = `${HOSTNAME}/orders`;
            }

            if(typeof result.prevPage  === 'undefined' || result.prevPage === null){
                prevPage = `${HOSTNAME}/orders`;
            }

            for (let i = 0; i < result.docs.length; i++){
                //let element = JSON.stringify(result.docs[i].userId);
                //console.log(result.docs[i].userId.toString());
                arr.push(result.docs[i].userId.toString());
            }
            //console.log(arr);
            if(arr.length >0 ){
                usersData = await helpersUsers(arr);
            } else {
                usersData = []
            }
           
            return res.json({
                status :'success',
                message: 'get all orders successfully',
                data: result.docs,
                users_data : usersData.data,
                next_page_url: nextPage,
                prev_page_url: prevPage
            })
        
        });
    },
    
}