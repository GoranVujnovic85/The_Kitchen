/**
 * The_Kitchen - Node.js backend for food ordering system
 *
 * @license MIT
 * @author Goran Vujnović
 * @year 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED.
 */
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