const cors = require('cors');
const express = require('express');
const Stripe = require('stripe');

const stripe = Stripe('sk_test_51OX0nsCMuqniNwSoOmLPno2kaorwNmffwNCVxETqIafQfbpO5Aao5G28oUvLrHxSmm7VYxRYhoo0mttNB7QzjexM00NV2Unt1z')

const app = express ();
app.use(express.json())
app.use(cors())

const port = 3000;
const host = "localhost";

app.post("/payment-sheet", async (req, res, next) => {
    
    try{
        const data = req.body;
        const params = {
            email: data.email,
            name: data.name,
        }
        const customer = await stripe.customers.create(params);

        console.log(customer.id)

        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2023-10-16'}
          );
        
          const paymentIntent = await stripe.paymentIntents.create({
            amount: 10000,
            currency: 'PHP',
            customer: customer.id,
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
              enabled: true,
            },
          });

          const response = {
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id
          }
          res.status(200).send(response)

    }catch(e){
        next(e)
    }
    
  });

app.get("/payment-shit",(req,res,next)=>{
    res.status(200).send("Hello World")
})

app.listen(port,host,()=>{
    console.log(`Server is up at ${port}`);
});
