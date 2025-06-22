class ApiResponse {
  constructor(statusCode, message = "SUCCESS", data) {
    this.name = "API RESPONSE";
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
