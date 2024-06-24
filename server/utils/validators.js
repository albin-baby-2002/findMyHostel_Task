const { default: mongoose } = require("mongoose");

module.exports.validateRegisterInput = (
  name,
  role,

  password,
  confirmPassword
) => {
  const errors = {};

  if (name.trim() === "") {
    errors.username = "name must not be empty";
  }

  if (role.trim() === "") {
    errors.role = "role shouldn't be empty";
  } else {
    if (role !== "admin" && role !== "tenant") {
      errors.role = "role should be admin or tenant";
    }
  }


  if (password === "") {
    errors.password = "Password must not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (name, password) => {
  const errors = {};
  
  
   if (name.trim() === "") {
     errors.username = "name must not be empty";
   }

  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateNewBillInput = (
  userId,
  amount,
  dueDate,
  status,
  billType
) => {
  const errors = {};

  if (!userId || userId.trim() === "") {
    errors.userId = "UserID shouldn't be empty";
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    errors.userId = "UserID is not a valid ID";
  }

  if (!amount || amount <= 0) {
    errors.amount = "Bill amount should a valid Number > 0";
  }

  if (!dueDate || dueDate.trim() === "") {
    errors.dueDate = "Due date should be a valid date";
  }

  if (!status || status.trim() === "") {
    errors.status = "status should be a valid string of paid or pending";
  }

  if (!billType || billType.trim() === "") {
    errors.billType = "billType should be a valid string of paid or pending";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
