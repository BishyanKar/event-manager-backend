class CustomError extends Error {

    constructor( message,  statusCode, functionName, data = null) {
      console.trace()
      super(message);
      Error.captureStackTrace(this, CustomError);
      this.name = (this).constructor.name; // OR this.name = (<any>this).constructor.name;
      this.statusCode = statusCode;
      this.functionName = functionName
      this.data = data;
      console.error(message,"\t|\t", statusCode, "\t|\t", functionName)
    }
  
  };

module.exports = CustomError;