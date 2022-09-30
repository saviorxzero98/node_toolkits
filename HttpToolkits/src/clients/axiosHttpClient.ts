import axios, { AxiosInstance } from 'axios';
import * as rax from 'retry-axios';
import * as https from 'https';
import * as stream from 'stream';
import * as FormData from 'form-data';
import { URLSearchParams } from 'url';
import { HttpClientOptions, HttpResponseCallback, HttpResponseMessage } from './httpClientTypes';
import { IHttpClient } from './httpClient';

export class AxiosHttpClient implements IHttpClient {
    public options: HttpClientOptions;
    protected axios: AxiosInstance;

    constructor(options ?: HttpClientOptions) {
        if (options) {
            this.options = options;
        }
        else {
            this.options = {
                timeout: 0,
                strictSSL: false
            }
        }

        this.axios = axios.create();
    }

    /** Http Request */
    public request(options: any, callback ?: (res: HttpResponseMessage) => void) {
        let config = this.confgureOptions(options);
        let self = this;

        this.axios(config)
            .then((axiosResponse) => {
                let response: HttpResponseMessage = {
                    response: axiosResponse,
                    headers: axiosResponse.headers,
                    body: axiosResponse.data,
                    bodyRaw: self.getBodyRaw(axiosResponse.data),
                    statusCode: axiosResponse.status,
                    statusMessage: axiosResponse.statusText,
                    isSuccess: true
                }

                if (callback && typeof callback === 'function') {
                    callback(response);
                }
            })
            .catch((e) => {
                if (callback && typeof callback === 'function') {
                    if (e.response) {
                        callback({
                            response: e.response,
                            headers: e.response.headers,
                            body: e.response.data,
                            bodyRaw: self.getBodyRaw(e.response.data),
                            statusCode: e.response.status,
                            statusMessage: e.response.statusText,
                            isSuccess: false,
                            error: e
                        });
                    }
                    else {
                        callback({
                            error: e,
                            isSuccess: false
                        });
                    }
                }
            });
    }

    /** Http Request */
    public async requestAsync(options: any): Promise<HttpResponseMessage> {
        let config = this.confgureOptions(options);

        try {
            let axiosResponse = await this.axios(config);
            
            let response: HttpResponseMessage = {
                response: axiosResponse,
                headers: axiosResponse.headers,
                body: axiosResponse.data,
                bodyRaw: this.getBodyRaw(axiosResponse.data),
                statusCode: axiosResponse.status,
                statusMessage: axiosResponse.statusText,
                isSuccess: true
            }
            return response;
        }
        catch (e) {
            if (e.response) {
                return {
                    response: e.response,
                    headers: e.response.headers,
                    body: e.response.data,
                    bodyRaw: this.getBodyRaw(e.response.data),
                    statusCode: e.response.status,
                    statusMessage: e.response.statusText,
                    isSuccess: false,
                    error: e
                }
            }
            else {
                return {
                    error: e,
                    isSuccess: false
                }
            }
        }
    }

    /** Http Request Stream */
    public requestStream(options: any, callback ?: (res: HttpResponseMessage) => void) {
        let config = this.confgureOptions(options);
        let self = this;
        
        // 設定 Response Type 為 Stream
        config = {
            ...config,
            responseType: 'stream'
        }

        this.axios(config)
            .then((axiosResponse) => {
            let fileStream = new stream.PassThrough();
                axiosResponse.data.pipe(fileStream);

                let response: HttpResponseMessage = {
                    response: axiosResponse,
                    headers: axiosResponse.headers,
                    body: null,
                    bodyRaw: '',
                    statusCode: axiosResponse.status,
                    statusMessage: axiosResponse.statusText,
                    fileStream: fileStream,
                    isSuccess: true
                }

                if (callback && typeof callback === 'function') {
                    callback(response);
                }
            })
            .catch((e) => {
                if (e.response) {
                    return {
                        response: e.response,
                        headers: e.response.headers,
                        body: e.response.data,
                        bodyRaw: '',
                        statusCode: e.response.status,
                        statusMessage: e.response.statusText,
                        isSuccess: false,
                        error: e
                    }
                }
                else {
                    return {
                        error: e,
                        isSuccess: false
                    }
                }
            });
    }

    /** Http Request Stream */
    public async requestStreamAsync(options: any): Promise<HttpResponseMessage> {
        let config = this.confgureOptions(options);
        let self = this;

        // 設定 Response Type 為 Stream
        config = {
            ...config,
            responseType: 'stream'
        }

        try {
            let axiosResponse = await this.axios(config);

            let fileStream = new stream.PassThrough();
            axiosResponse.data.pipe(fileStream);

            let response: HttpResponseMessage = {
                response: axiosResponse,
                headers: axiosResponse.headers,
                body: null,
                bodyRaw: '',
                statusCode: axiosResponse.status,
                statusMessage: axiosResponse.statusText,
                fileStream: fileStream,
                isSuccess: true
            }
            return response;
        }
        catch (e) {
            if (e.response) {
                return {
                    response: e.response,
                    headers: e.response.headers,
                    body: e.response.data,
                    bodyRaw: '',
                    statusCode: e.response.status,
                    statusMessage: e.response.statusText,
                    isSuccess: false,
                    error: e
                }
            }
            else {
                return {
                    error: e,
                    isSuccess: false
                }
            }
        }
    }

    //--------------------------------------------------------------------------------

    /** Http GET */
    public get(url: string, options ?: any, callback ?: HttpResponseCallback) {
        let getOptions = this.createOptions('GET', url, null, options);
        this.request(getOptions, callback);
    }

    /** Http Get (Stream) */
    public getStream(url: string, options ?: any, callback ?: HttpResponseCallback) {
        let getOptions = this.createOptions('GET', url, null, options);
        this.requestStream(getOptions, callback);
    }

    /** Http GET */
    public async getAsync(url: string, options ?: any): Promise<HttpResponseMessage>  {
        let getOptions = this.createOptions('GET', url, null, options);
        return await this.requestAsync(getOptions);
    }

    /** Http Get (Stream) */
    public async getStreamAsync(url: string, options ?: any): Promise<HttpResponseMessage> {
        let getOptions = this.createOptions('GET', url, null, options);
        return await this.requestStreamAsync(getOptions);
    }

    //--------------------------------------------------------------------------------

    /** Http POST */
    public post(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let postOptions = this.createOptions('POST', url, data, options);
        this.request(postOptions, callback);
    }

    /** Http POST */
    public async postAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let postOptions = this.createOptions('POST', url, data, options);
        return await this.requestAsync(postOptions);
    }

    /** Http POST JSON */
    public postJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let jsonData = this.toJsonData(data);
        this.post(url, jsonData, options, callback);
    }

    /** Http POST JSON */
    public async postJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage> {
        let jsonData = this.toJsonData(data);
        return await this.postAsync(url, jsonData, options);
    }

    /** Http POST Form */
    public postForm(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let formData = this.toForm(data);
        this.post(url, formData, options, callback);
    }

    /** Http POST Form */
    public async postFormAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage> {
        let formData = this.toForm(data);
        return await this.postAsync(url, formData, options);
    }


    /** Http POST Form Data */
    public postFormData(url: string, data: any, options ?: any, callback ?: HttpResponseCallback)  {
        let formData = this.toFormData(data);
        this.post(url, formData, options, callback);
    }

    /** Http POST Form Data */
    public async postFormDataAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let formData = this.toFormData(data);
        return await this.postAsync(url, formData, options);
    }

    //--------------------------------------------------------------------------------

    /** Http PUT */
    public put(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let putOptions = this.createOptions('PUT', url, data, options);
        this.request(putOptions, callback);
    }

    /** Http PUT */
    public async putAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let putOptions = this.createOptions('PUT', url, data, options);
        return await this.requestAsync(putOptions);
    }

    /** Http PUT JSON */
    public putJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let jsonData = this.toJsonData(data);
        this.put(url, jsonData, options, callback);
    }

    /** Http PUT JSON */
    public async putJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let jsonData = this.toJsonData(data);
        return await this.putAsync(url, jsonData, options);
    }

    /** Http PUT Form */
    public putForm(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let formData = this.toForm(data);
        this.put(url, formData, options, callback);
    }

    /** Http PUT Form */
    public async putFormAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage> {
        let formData = this.toForm(data);
        return await this.putAsync(url, formData, options);
    }


    /** Http PUT Form Data */
    public putFormData(url: string, data: any, options ?: any, callback ?: HttpResponseCallback)  {
        let formData = this.toFormData(data);
        this.put(url, formData, options, callback);
    }

    /** Http PUT Form Data */
    public async putFormDataAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let formData = this.toFormData(data);
        return await this.putAsync(url, formData, options);
    }


    //--------------------------------------------------------------------------------

    /** Http PATCH */
    public patch(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let patchOptions = this.createOptions('PATCH', url, data, options);
        this.request(patchOptions, callback);
    }

    /** Http PATCH */
    public async patchAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let patchOptions = this.createOptions('PATCH', url, data, options);
        return await this.requestAsync(patchOptions);
    }

    /** Http PATCH JSON */
    public patchJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback) {
        let jsonData = this.toJsonData(data);
        this.patch(url, jsonData, options, callback);
    }

    /** Http PATCH JSON */
    public async patchJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>  {
        let jsonData = this.toJsonData(data);
        return await this.patchAsync(url, jsonData, options);
    }


    //----------------------------------------------------------------------------------------------------

    /** 設定 Axios Config */
    protected confgureOptions(options: any) : any {
        if (this.options) {
            // 設定忽略 SSL 憑證的檢查
            if (this.options.strictSSL !== undefined &&
                this.options.strictSSL === false) {
                let httpsAgent = new https.Agent({ rejectUnauthorized: false });

                options = {
                    ...options,
                    httpsAgent: httpsAgent

                }
            }

            // 設定 Timeout
            if (this.options.timeout && this.options.timeout > 0) {
                options = {
                    ...options,
                    timeout: this.options.timeout
                };
            }

            // 設定錯誤重試
            if (this.options.retryOptions) {
                this.axios.defaults.raxConfig = {
                    instance: this.axios
                }
                rax.attach(this.axios);

                options = {
                    ...options,
                    raxConfig: {
                        retry: this.options.retryOptions.retry ?? 3,
                        retryDelay: this.options.retryOptions.retryDelay ?? 100,
                        onRetryAttempt: (error: any) => {
                            
                            if (this.options.retryOptions?.onRetryAttempt &&
                                typeof this.options.retryOptions?.onRetryAttempt === 'function') {
                                this.options.retryOptions?.onRetryAttempt(error);
                            }
                        }
                    }
                }
            }
        }
        return options;
    }

    /** 建立 Request Options */
    protected createOptions(method: string, url: string, data?: any, options ?: any) {
        let newOptions = {
            method: method,
            url: url,
            data: data
        }

        if (options) {
            newOptions = {
                ...options,
                method: method,
                url: url,
                data: data
            }
        }
        return newOptions;
    }

    /** Object or String to Json Object */
    protected toJsonData(data: any): any {
        if (data && typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    }

    /** Object to Form */
    protected toForm(data: any) {
        return new URLSearchParams(data);
    }

    /** Object to Form Data */
    protected toFormData(data: any) {
        let formData = new FormData();

        let appendForm = (formData: FormData, key: string, value: any) => {
            if (value && value.hasOwnProperty('value') && value.hasOwnProperty('options')) {
    
                formData.append(key, value.value, value.options)
            } 
            else {
                formData.append(key, value)
            }
        }

        if (data) {
            let formKeys = Object.keys(data);

            for (let formKey of formKeys) {
                let formValue = data[formKey];
                
                if (formValue instanceof Array) {
                    for (let value of formValue) {
                        appendForm(formData, formKey, value);
                    }
                }
                else {
                    appendForm(formData, formKey, formValue);
                }
            }
        }
        return formData;
    }

    /** Get Body Raw */
    protected getBodyRaw(body: any): string {
        if (body) {
            if (typeof body === 'object' || Array.isArray(body)) {
                try {
                    return JSON.stringify(body);
                }
                catch {
                    return '';
                }
            }
            return `${body}`;
        }
        return '';
    }
}