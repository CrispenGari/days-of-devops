export class Response {
  protected timeStamp: string;
  protected statusCode: number;
  protected data: any;
  protected message: string;
  protected status: string;
  constructor(
    statusCode: number,
    httpStatus: string,
    message: string,
    data: any
  ) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.status = httpStatus;
    this.message = message;
    this.data = data;
  }
}
