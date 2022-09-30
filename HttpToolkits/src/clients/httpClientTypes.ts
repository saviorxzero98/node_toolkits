import * as stream from 'stream';

export type HttpClientOptions = {
    /** Http Request Timeout (milliseconds)，default: 0 (no timeour) */
    timeout ?: number,

    /** SSL certificates */
    strictSSL ?: boolean,

    /** Retry Options，default: null (without retry) */
    retryOptions ?: HttpClientRetryOptions
}

export type HttpClientRetryOptions = {
    /** Retry Count */
    retry ?: number,

    /** Retry Dalay (milliseconds) */
    retryDelay ?: number,

    /** On Retry Attempt Callback */
    onRetryAttempt?: (error: any) => void;
}

export type HttpResponseMessage = {
    /** Axios Response */
    response ?: any,
    
    /** Error */
    error ?: any,
    
    /** Status Code */
    statusCode ?: number,

    /** Status Message */
    statusMessage ?: string,

    /** Body */
    body ?: any,

    /** Body Raw String */
    bodyRaw ?: string,

    /** Headers */
    headers ?: any,

    /** File Stream */
    fileStream ?: stream.Stream,

    /** Is Success */
    isSuccess ?: boolean
}

export type HttpResponseCallback = (res: HttpResponseMessage) => void;