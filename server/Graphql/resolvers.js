const {
  validateRegisterInput,
  validateLoginInput,
  validateNewBillInput,
} = require("../utils/validators");
const User = require("../Models/UserSchema");
const Bill = require("../Models/BillSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.resolvers = {
  Query: {
    // all users query

    async users(_, input, contextValue) {
      // allow only logged users who are admin to get users data

      if (contextValue.user === null) {
        throw new Error("you are not logged in ");
      }

      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const users = await User.find();

      return users;
    },

    // single user query

    async user(_, args, contextValue) {
      // allow only logged users who are admin to get user data

      if (contextValue.user === null) {
        throw new Error("you are not logged in ");
      }

      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const userId = args.id;

      if (!userId || userId.trim() === "") {
        throw new Error("UserID shouldn't be empty");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("UserID is not a valid ID");
      }

      const user = await User.findById(args.id);

      if (!user) {
        throw new Error("No user with given id was found");
      }

      return user;
    },

    // all bills query

    async bills(_, args, contextValue) {
      // allow only logged users who are admin to get user bills data

      if (contextValue.user === null) {
        throw new Error("you are not logged in ");
      }

      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const userId = args.id;

      if (!userId || userId.trim() === "") {
        throw new Error("UserID shouldn't be empty");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("UserID is not a valid ID");
      }

      const bills = await Bill.find({ userId });

      return bills;
    },
  },

  // query from parent query of user

  User: {
    // subquery to get bill of each user

    async bills(parent) {
      const bills = await Bill.find({ userId: parent._id });

      return bills;
    },
  },

  // mutations

  Mutation: {
    //register a user

    async register(
      _,
      { registerInput: { name, role, password, confirmPassword } },
      contextValue
    ) {
      const { errors, valid } = validateRegisterInput(
        name,
        role,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new Error(Object.entries(errors)[0][1]);
      }

      const user = await User.findOne({ name });

      if (user) {
        throw new Error("username is already taken choose another");
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        password,
        role,
        status: "active",
      });

      let res = await newUser.save();

      const token = jwt.sign(
        {
          id: res._id,
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
        },
        message: "User successfull registered",
      };
    },

    //login

    async login(_, { loginInput: { name, password } }, contextValue) {
      const existingLogin = contextValue.user;

      if (existingLogin)
        return {
          message: "you are already loggedin ",
          user: existingLogin,
        };

      const { errors, valid } = validateLoginInput(name, password);

      if (!valid) {
        throw new Error(Object.entries(errors)[0][1]);
      }

      const user = await User.findOne({ name });

      if (!user) {
        throw new Error("User is not registered");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Wrong credentials");
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
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

      if (!user._id) {
        contextValue.res.clearCookie("token", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        return {
          message: "logged Out",
        };
      }

      await User.findByIdAndUpdate(user._id, { token: "" });

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

      const { id: billId } = input;

      if (!billId || billId.trim() === "") {
        throw new Error("BillId shouldn't be empty");
      }

      if (!mongoose.Types.ObjectId.isValid(billId)) {
        throw new Error("BillId is not a valid ID");
      }
      
      const bill = await Bill.findById(billId);
      
      const userId = bill.userId;
      
      const user = await User.findById(userId);
      
      if(user.status === "vacated"){
        throw new Error("User already vacated")
      }
      
      if(!bill){
        throw new Error("Failed to find bill with given id")
      }

      const updatedBill = await Bill.findByIdAndUpdate(billId, {
        status: "paid",
      },{new:true});

      
      return { bill: updatedBill, message: "bill marked paid" };
    },

    // new Bill

    async newBill(_, input, contextValue) {
      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      const {
        newBillInput: { userId, amount, dueDate, status, billType },
      } = input;

      const { errors, valid } = validateNewBillInput(
        userId,
        amount,
        dueDate,
        status,
        billType
      );

      if (!valid) {
        throw new Error(Object.entries(errors)[0][1]);
      }

      const newBill = new Bill({
        userId,
        amount,
        dueDate,
        status,
        billType,
      });

      await newBill.save();

      return {
        bill: newBill,
        message: "new bill successfully created",
      };
    },

    //vacate a user and return bills details

    async vacate(_, input, contextValue) {
      if (contextValue.user.role !== "admin") {
        throw new Error("you don't have admin privileges");
      }

      let { id: userId } = input;

      if (!userId || userId.trim() === "") {
        throw new Error("UserID shouldn't be empty");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("UserID is not a valid ID");
      }

      userId = new mongoose.Types.ObjectId(userId);

      const paidBills = await Bill.aggregate([
        {
          $match: {
            userId,
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
            billType: "security",
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

      if (vacateduser.status == "vacated") {
        throw new Error("user already vacated");
      }

      vacateduser.status = "vacated";

      await vacateduser.save();

      return {
        bill: {
          paidBills: paidBills.length > 0 ? paidBills[0].amount : 0,
          unpaidBills: unpaidBills.length > 0 ? unpaidBills[0].amount : 0,
          refundable: refundable.length > 0 ? refundable[0].amount : 0,
        },
        message: "user successfully vacated",
      };
    },

    // check is user login if logged give back user details

    async checkLogin(_, input, contextValue) {
      if (contextValue.user === null) {
        return { user: null, message: "not logged in " };
      }

      return { user: contextValue.user, message: "logged in " };
    },
  },
};
