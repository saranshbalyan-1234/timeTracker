const getErrorOnly = (e) => {
  const messages = [];
  if (
    e.errors &&
    (e.name == "SequelizeValidationError" ||
      e.name == "SequelizeUniqueConstraintError")
  ) {
    e.errors.forEach((error) => {
      let message = "";
      switch (error.validatorKey) {
        case "equals":
          message = `Invalid ${error.path} input`;
          break;
        case "isIn":
          message = `Invalid ${error.path} input`;
          break;
        case "not_unique":
          message = `Duplicate ${error.path} entry`;
          break;
        case "len":
          console.log(error);
          message = `${error.path} must conatin between ${error.validatorArgs[0]} and ${error.validatorArgs[1]} characters`;
          break;
        case "is_null":
          console.log(error);
          message = `${error.path} cannot be null`;
          break;
        case "isEmail":
          message = `Invalid ${error.path}`;
          break;
        default:
          console.log(error);
          message = "some error occured";
      }
      messages.push(message);
    });
    return messages;
  } else if (e.name == "SequelizeDatabaseError") {
    messages.push(e.parent.sqlMessage);
    return messages;
  } else if (e.name == "SequelizeEagerLoadingError") {
    messages.push("Association Error, Please Check Backend");
    console.log(e);
    return messages;
  } else {
    console.log(e);
    return e;
  }
};

module.exports = getErrorOnly;
