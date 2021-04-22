class ApiException {
  message: string;
  statusCode: number;
  errorResponse: any;
  constructor(message: string, statusCode: number, response: any = {} ) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorResponse = response;
  }
}

export default ApiException;
