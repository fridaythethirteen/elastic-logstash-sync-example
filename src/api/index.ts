import fetch, { Response } from 'node-fetch';
import ApiException from './Api.exception';
import logger from '@shared/Logger';
import ApiConstants from './Api.constants';

interface IOptions extends RequestInit {
  headers?: Headers;

}

const ENDPOINT = process.env.APIGEE_ENDPOINT;

const headers = {
  appId: process.env.APP_ID,
  env: process.env.APP_ENV,
  'Content-Type': 'application/json',
};

interface IParams {
  [key: string] : any;
};

/**
 * Maps all url string based params container {} pattern
 */
const mapParamsToUrl = (url: string, params: { [key: string]: string }) => {
  const regexReqParam = /[^{]+(?=})/g;
  const matches = url.match(regexReqParam) || [];
  let changedUrl = url;
  matches.forEach(match => {
    const param = params[match] !== undefined ? params[match] : '';
    changedUrl = changedUrl.replace(`{${match}}`, param);
  });
  return changedUrl;
};

/**
 * A fetch wrapper to call external api's
 */
const doCall = async (uri: string, params: IParams = {}, option: any = {}): Promise<Response> => {
  const { headers: extraHeaders = {} } = params;
  uri = mapParamsToUrl(uri, params);
  const { isAbsUrl } = params;
  const url = uri; // isAbsUrl ? uri : `${ENDPOINT}/${uri}`;
  const start = Date.now();
  return fetch(url, {
    ...option,
    headers: { ...headers, ...extraHeaders, ...option.headers },
  }).catch(err => {
    logger.error('error', err);
    throw new ApiException(err.statusText, err.status, err);
  }).finally(() => {
    const end = Date.now();
    logger.info(`Proxy url: ${url} time take: ${end - start}`);
  });
};

/**
 * Used for fetching Http Get method resources
 * @param {string} uri - resource uri
 * @param {Object} params - params need to be replaced with matched params of the uri
 * @param {Object} options - extra options needs to be passed along with request such as headers
 * @return {Promise} - a promise of Response with json data
 */
export const doGet = async (uri: string, params: IParams, options: IOptions = {}): Promise<any> => {
  return doCall(uri, params, options);
};

export const doPost = async (uri: string, params: IParams, options: IOptions = {}) => {
  const { body = {} } = params;
  return doCall(
    uri,
    params,
    {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    },
  );
};

export const doPut = async (uri: string, params: IParams, options: IOptions = {}) => {
  const { body = {} } = params;
  return doCall(
    uri,
    params,
    { method: 'PUT', body: JSON.stringify(body), ...options },
  );
};


export { ApiConstants };