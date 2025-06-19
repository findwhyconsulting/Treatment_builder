// Success Response
export const Success = (res, code, message, data = null) => { 
  return res.status(code).json({
    success: true,
    statusCode: code,
    message: message,
    data: data,
  });
};

// Error Response
export const Error = (res, code, message, error = null) => {
  return res.status(code).json({
    success: false,
    statusCode: code,
    message: message,
  });
};
