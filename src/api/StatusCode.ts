interface IStatusCode {
  [key: number]: {
    code: number; message: string;
  };
}

const StatusCode: IStatusCode = {
  200: {
    code: 200,
    message: 'Ok',
  },
  400: {
    code: 400,
    message: 'Bad request',
  },
  500: {
    code: 500,
    message: 'Internal server error',
  },
  404: {
    code: 404,
    message: 'Resource not found',
  },
};

export default StatusCode;