const User = require("../Models/UserSchema");
const Bill = require("../Models/BillSchema");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../utils/validators");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CheckAuth = require("../utils/authChecker");
const { default: mongoose } = require("mongoose");

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.resolvers = {
  Query: {
    async users(_, input, contextValue) {
      
      
      if(contextValue.user === null){
        
        throw new Error("you are not logged in ")
      }
      
      if ( contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }
      
      console.log("users get ")
      const users = await User.find();

      return users;
    },
    async user(_, args) {
      const user = await User.findById(args.id);
      return user;
    },
    async bills(_, args) {
      const bills = await Bill.find({ userId: args.id });
      return bills;
    },
  },
  User: {
    async bills(parent) {
      const bills = await Bill.find({ userId: parent._id });

      return bills;
    },
  },

  Mutation: {
    //register

    async register(
      _,
      { registerInput: { name, role, email, password, confirmPassword } },
      contextValue
    ) {
      const { errors, valid } = validateRegisterInput(
        name,
        role,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new Error(Object.entries(errors)[0][1]);
      }

      const user = await User.findOne({ email });
      if (user) {
        throw new Error("email is already registered");
      }

      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        name,
        password,
        role,
        status: "active",
      });

      let res = await newUser.save();

      const token = jwt.sign(
        {
          id: res._id,
          email: res.email,
          name: res.name,
          role: res.role,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.token = token;

      res = await res.save();

      const newBill = new Bill({
        userId: res._id,
        status: "pending",
        billType: "security",
      });

      await newBill.save();

      contextValue.res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      return {
        user: {
          ...res._doc,
          id: res._id,
          token: res.token,
        },
        message: "User successfull registered",
      };
    },

    //login

    async login(_, { loginInput: { email, password } }, contextValue) {
      const existingLogin = contextValue.user;

      if (existingLogin)
        return {
          message: "you are already loggedin ",
          user: existingLogin,
        };

      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new Error(Object.entries(errors)[0][1]);
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Email is not registered");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Wrong credentials");
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.email,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      user.token = token;

      await user.save();

      contextValue.res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      return {
        message: "successfully logged in ",
        user,
      };
    },

    // logout

    async logout(_, inputs, contextValue) {
      const user = contextValue.user;

      if (!user) {
        return {
          message: "logged Out",
        };
      }

      const updatedUser = await User.findByIdAndUpdate(user._id, { token: "" });

      contextValue.res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return {
        message: "logged Out",
      };
    },

    // markBillPaid

    async markBillPaid(_, input, contextValue) {
      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const { id } = input;

      const updatedBill = await Bill.findByIdAndUpdate(id, { status: "paid" });

      return { bill: updatedBill, message: "bill marked paid" };
    },

    // new Bill

    async newBill(_, input, contextValue) {
      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const { newBillInput } = input;

      const newBill = await new Bill({
        ...newBillInput,
      });

      await newBill.save();

      return {
        bill: newBill,
        message: "new bill successfully created",
      };
    },

    //vacate

    async vacate(_, input, contextValue) {
      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const { id } = input;

      const userId = new mongoose.Types.ObjectId(id);

      console.log(input);

      const paidBills = await Bill.aggregate([
        {
          $match: {
            userId,
            status: "paid",
          },
        },{
          $group:{
            _id: null, amount: { $sum: "$amount" }
          }
        }
      ]);
      
      
         const unpaidBills = await Bill.aggregate([
           {
             $match: {
               userId,
               status: "pending",
             },
           },
           {
             $group: {
               _id: null,
               amount: { $sum: "$amount" },
             },
           },
         ]);
         
          const refundable = await Bill.aggregate([
            {
              $match: {
                userId,
                billType:"security",
                status: "paid",
              },
            },
            {
              $group: {
                _id: null,
                amount: { $sum: "$amount" },
              },
            },
          ]);
          
          const vacateduser = await User.findById(userId);
          
          if(vacateduser.status == "vacated"){
            throw new Error("user already vacated")
          }
          
          vacateduser.status = "vacated";
          
          await vacateduser.save();
          
          return {
            bill: {
              paidBills: paidBills.length > 0 ? paidBills[0].amount : 0,
              unpaidBills: unpaidBills.length > 0 ? unpaidBills[0].amount : 0,
              refundable: refundable.length > 0 ? refundable[0].amount : 0,
            },
            message:"user successfully vacated"
          };
      
    },
  },
};
