import { HttpResponseCallback, HttpResponseMessage } from "./httpClientTypes";

export interface IHttpClient {
    request(options: any, callback ?: HttpResponseCallback): void;
    requestAsync(options: any): Promise<HttpResponseMessage>;

    requestStream(options: any, callback ?: HttpResponseCallback): void;
    requestStreamAsync(options: any): Promise<HttpResponseMessage>;

    get(url: string, options ?: any, callback ?: HttpResponseCallback): void;
    getStream(url: string, options ?: any, callback ?: HttpResponseCallback): void;

    getAsync(url: string, options ?: any): Promise<HttpResponseMessage>;
    getStreamAsync(url: string, options ?: any): Promise<HttpResponseMessage>;

    post(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    postAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    postJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    postJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    postForm(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    postFormAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    postFormData(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    postFormDataAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;


    put(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    putAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    putJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    putJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    putForm(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    putFormAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    putFormData(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    putFormDataAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    patch(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    patchAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;

    patchJson(url: string, data: any, options ?: any, callback ?: HttpResponseCallback): void;
    patchJsonAsync(url: string, data: any, options ?: any): Promise<HttpResponseMessage>;
}