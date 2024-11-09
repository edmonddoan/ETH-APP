const formatResponse = (data = null, message = 'Success', statusCode = 200) => ({
  success: true,
  status: statusCode,
  message,
  data
});

module.exports = { formatResponse }; 