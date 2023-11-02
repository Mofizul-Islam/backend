import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"


// Create an Express application
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB is connected");
})

//user schema

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String

})

//password hash
   userSchema.pre("save", async function (next){
     const passwordHash = await bcrypt.hash(this.password, 10);
     this.password = passwordHash
     next();
  })

//create model

const User = new mongoose.model('User', userSchema)

//Routes
app.post("/login", (req, res) => {
    // res.send("MY API Login")
    const { Email, Password } = req.body
    // console.log("Params", req.body);
    User.findOne({ email: Email })
        .then(user => {
            // console.log("User", user);

            if ( !user ) {
                res.send({ message: "User not found" });
                return;
            }

            if ( Password !== user.password ) {
                res.send({ message: "Password didn't match" })
                return;
            }

            res.send({
                message: "Login Successfully",
                user: user
            });
            
            /* if (user) {
                if (Password === user.password) {
                    res.send({
                        message: "Login Successfully",
                        user: user
                    })
                } else {
                    res.send({ message: "Password didn't match" })
                }
            } else {
                res.send({ message: "User not found" });
            } */
        })
        .catch(err => {
            res.send(err);
        })

})

app.post("/register", (req, res) => {
    // res.send("MY API Register")
    // console.log(req.body)
    const { name, email, password } = req.body
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                res.send({ message: "User already registered" });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                newUser.save()
                    .then(() => {
                        res.send({
                            message: "Successfully Registered"
                        });
                    })
                    .catch(err => {
                        res.send(err);
                    });
            }
        })
        .catch(err => {
            res.send(err);
        });

})

// Start the server
app.listen(9002, () => {
    console.log("BE started at port 9002")
})



// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';

// // Create an Express application
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Database connection
// mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;

// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the API');
// });

// // Start the server
// const PORT = process.env.PORT || 9002;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });