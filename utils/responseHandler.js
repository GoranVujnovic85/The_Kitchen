/*=======================================================================*/
/*---- The purpose of this code is to ensure a consistent format for ----*/
/*------- responding to client requests, making it easier to debug ------*/
/*---------------------  and maintain the code. -------------------------*/
/*---------------- All API responses have the same format. --------------*/
/*=======================================================================*/

module.exports = {
    successResponse: (res, message, data = null, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    },
  
    errorResponse: (res, message, statusCode = 500, errors = null) => {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    },
};