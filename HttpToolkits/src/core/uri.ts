import { URL } from 'url';
import * as path from 'path';
import * as nodeUtils from 'util';


/** Uri 處理 */
export class Uri {
    private _protocol: string = '';
    private _hostname: string = '';
    private _port: string = '';
    private _pathname: string = '';
    private _search: string = '';
    private _hash: string = '';

    constructor (baseUrl: string, ...params: string[]) {
        this.setHref(baseUrl, ...params);
    }

    /** 設定 Href */
    public setHref(href: string, ...params: string[]): Uri {       
        if (href) {
            try {
                let formatedHref = nodeUtils.format(href, ...params)
                                            .replace(/([^:]\/)\/+/g, "$1");
                const url = new URL(formatedHref);
                this._protocol = url.protocol;
                this._hostname = url.hostname;
                this._port = url.port;
                this._pathname = url.pathname;
                this._search = url.search;
                this._hash = url.hash;
            }
            catch {

            }
        }
        return this;
    }

    /** 轉成字串 */
    public toString(): string {
        // 處理 Protocol
        let protocol = this.getProtocol();

        // 處理 Host + Port '<Host>:<Port>'
        let host = this.getHost();

        // 處理 Path + Search 
        let path = this.getPath();

        // 處理 Hash
        let hash = this.getHash();

        if (protocol && host) {
            let href = `${protocol}//${host}${path}${hash}`;
            return href;
        }
        return '';
    }


    /** 設定 Protocol (ex: 'http', 'https', 'ws', 'wss' or 'ftp') */
    public setProtocol(protocol: string): Uri {
        if (protocol) {
            protocol = protocol.replace('//', '');
            this._protocol = (protocol.endsWith(':')) ? protocol : `${protocol}:`;
        }
        return this;
    }
    
    /** 取得 Protocol (ex: 'http:', 'https:', 'ws:', 'wss:' or 'ftp:') */
    public getProtocol(): string {
        return this.formatProtocal(this._protocol);
    }
    
    /** 取代 Protocol (ex: 'http:', 'https:', 'ws:', 'wss:' or 'ftp:') */
    public replaceProtocol(oldProtocol: string, newProtocol: string): Uri {
        let protocol = this.getProtocol();

        if (protocol && oldProtocol && newProtocol)  {
            oldProtocol = this.formatProtocal(oldProtocol);

            if (protocol === oldProtocol) {
                return this.setProtocol(newProtocol);
            }
        }
        return this;
    }

    /** 格式化 Protpcol */
    protected formatProtocal(protocol: string) : string {
        let formatedProtocal = protocol;
        if (formatedProtocal) {
            formatedProtocal = formatedProtocal.replace('//', '');
            formatedProtocal = (formatedProtocal.endsWith(':')) ? formatedProtocal : `${formatedProtocal}:`;
            formatedProtocal = formatedProtocal.toLowerCase();
        }
        return formatedProtocal;
    }


    /** 設定 Host Name (ex: 'www.example.com' */
    public setHostName(hostName: string): Uri {
        if (hostName) {
            if (hostName.endsWith('/')) {
                this._hostname = hostName.slice(0, -1);
            }
            else {
                this._hostname = hostName;
            }
        }
        return this;
    }
    /** 取得 Host Name (ex: 'www.example.com' */
    public getHostName(): string {
        return this._hostname;
    }


    /** 設定 Host */
    public setHost(hostName: string, port: number): Uri {
        this.setHostName(hostName);
        this.setPort(port);
        return this;
    }
    /** 取得 Host (ex: 'www.example.com:443' or ''www.example.com:80') */
    public getHost(): string {
        // 處理 Host + Port '<Host>:<Port>'
        let host = this._hostname;
        let port = this._port;
        if (host && port) {
            host = `${host}:${port}`;
        }
        return host;
    }


    /** 設定 Port */
    public setPort(port: number): Uri {
        this._port = String(port);
        return this;
    }
    
    /** 取得 Port */
    public getPort(): string {
        return this._port;
    }


    /** 設定 PathName (覆寫掉 PathName) */
    public setPathName(pathName: string): Uri {
        if (pathName) {
            this._pathname = this.formatPathName(pathName);
        }
        else {
            this._pathname = '';
        }
        return this;
    }
    
    /** 串接 PathName */
    public joinPathName(...pathNames: string[]): Uri {
        if (pathNames && pathNames.length !== 0) {
            let pathName = path.posix.join(this._pathname, ...pathNames);
            return this.setPathName(pathName);
        }
        return this;
    }
    
    /** 取得 PathName */
    public getPathName(): string {
        return this._pathname;
    }
    
    /** 格式化 PathName */
    protected formatPathName(pathName: string): string {
        let formatedPathName = pathName;
        if (formatedPathName) {
            formatedPathName = (formatedPathName.startsWith('/')) ? formatedPathName : `/${formatedPathName}`;
        }
        return formatedPathName;
    }


    /** 設定 Search (ex: '?id=3' or '?id=3&name=apple') */
    public setSearch(query: string | Map<string, string> | object): Uri {
        if (query) {
            if (typeof query === 'string') {
                // 使用字串
                this._search = this.formatSearchString(query);
                return this;
            }
            else if (query instanceof Map) {
                // 使用 Map<string, string>
                let keys = Array.from(query.keys());
                let search = '';
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value: any = query.get(key);
                    let isFiresIndex = (i === 0);
                    search += this.getQueryAppendString(key, value, isFiresIndex);
                }
                this._search = search;
            }
            else if (typeof query === 'object') {
                // 使用 Object
                let keys = Object.keys(query);
                let search = '';
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value = query[key];
                    let isFiresIndex = (i === 0);
                    search += this.getQueryAppendString(key, value, isFiresIndex);
                }
                this._search = search;
            }
        }
        else {
            this._search = '';
            return this;
        }
        return this;
    }

    /** 取得 Search */
    public getSearch(): string {
        return this._search;
    }
    /** 格式化 Search 字串 */
    protected formatSearchString(query: string): string  {
        let formatedQuery = query;
        if (formatedQuery) {
            formatedQuery = (formatedQuery.startsWith('?')) ? formatedQuery : `?${query}`;
        }
        return formatedQuery;
    }
    /** 取得 Query 字串 */
    protected getQueryAppendString(key: string, value: string, isFirstIndex: boolean): string {
        if (isFirstIndex) {
            return `?${key}=${value}`;
        }
        else {
            return `&${key}=${value}`;
        }
    }


    /** 新增 Query Parameter */
    public addQuery(key: string, value: string = ''): Uri {
        // 取得目前的 Query Parameters
        let queryMap = this.getQueryMap();

        // 設定 Query
        if (key) {
            let encodeValue = encodeURIComponent(value);
            queryMap.set(key, encodeValue);
        }
        
        // 設定 Search
        return this.setSearch(queryMap);
    }
    
    /** 新增更多的 Query Parameter */
    public addMoreQuery(query: Map<string, string> | object): Uri {
        if (query) {
            // 取得目前的 Query Parameters
            let queryMap = this.getQueryMap();

             // 設定 Query
            if (query instanceof Map) {
                // 使用 Map<string, string>
                let keys = Array.from(query.keys());
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value = encodeURIComponent(String(query.get(key)));
                    queryMap.set(key, value);
                }

                // 設定 Search
                return this.setSearch(queryMap);
            }
            else if (typeof query === 'object') {
                // 使用 Object
                let keys = Object.keys(query);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value = encodeURIComponent(query[key]);
                    queryMap.set(key, value);
                }

                // 設定 Search
                return this.setSearch(queryMap);
            }
        }
        return this;
    }
    
    /** 刪除指定 Query */
    public removeQuery(key: string): Uri {
        // 取得目前的 Query
        let queryMap = this.getQueryMap();

        // 刪除指定 Query
        if (queryMap.has(key)) {
            queryMap.delete(key);
        }
         
        // 設定 Search
        return this.setSearch(queryMap);
    }
    
    /** 取得 Query (Map<string, string>) */
    public getQueryMap(): Map<string, string> {
        let query = this._search;

        let dictionary = new Map<string, string>();
        if (query.indexOf('?') != -1) {
            let search = query.split('?');
            if (search.length === 2) {
                let parameters = search[1].split('&');

                for (let parameter of parameters) {
                    let pairKeyValue = parameter.split('='); 
                    if (pairKeyValue.length === 2) {
                        let key = pairKeyValue[0];
                        let value = decodeURIComponent(pairKeyValue[1]);

                        if (key) {
                            dictionary.set(key, value);
                        }
                    }
                }
            }
        }
        return dictionary;
    }
    
    /** 取得 Query (object) */
    public getQueryData(): object {
        let query = {};

        // 取得目前的 Query Parameters
        let queryMap = this.getQueryMap();

        // 將 Map<string, string> 轉換成 object
        let keys = Array.from(queryMap.keys());
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = queryMap.get(key);
            query[key] = value;
        }
        return query;
    }
   
    /** 取得 Path */
    public getPath(): string {
        // 處理 Path Name
        let pathName = this._pathname;
        if (pathName && !pathName.startsWith('/')) {
            pathName = `/${pathName}`;
        }

        // 處理 Search
        let search = this._search;
        if (search && !search.startsWith('?')) {
            search = `?${search}`;
        }

        let path = `${pathName}${search}`;
        return path;
    }


    /** 設定 Hash (ex: '#1') */
    public setHash(hash: string): Uri {
        if (hash) {
            this._hash = this.formatHash(hash);
        }
        else {
            this._hash = '';
        }
        return this;
    }
    
    /** 取得 Hash (ex: '#1') */
    public getHash(): string {
        return this.formatHash(this._hash);
    }

    /** 格式化 Hash */
    protected formatHash(hash: string): string {
        let formatedHash = hash;
        if (formatedHash) {
            formatedHash = (formatedHash.startsWith('#')) ? formatedHash : `#${hash}`;
        }
        return formatedHash;
    }


    /** 複製 */
    public clone(): Uri {
        let uri = new Uri(this.toString());
        return uri;
    }
}

export enum UriProtocol {
    // Http
    http = 'http',
    https = 'https',
    

    // Web Socket
    ws = 'ws',
    wss = 'wss',


    // Mail
    smtp = 'smtp',
    smtps = 'smtps',
    imap = 'imap',
    pop = 'pop',
    

    // File Transfer
    ftp = 'ftp',
    ftps = 'ftps',
    sftp = 'sftp',
    smb = 'smb',
    

    // Message
    xmpp = 'xmpp',
    tel = 'tel',
    sip = 'sip',


    // Other
    ssh = 'ssh',
    telnet = 'telnet',


    // Instant Messaging
    line = 'line',
    iota = 'iota',
    iotaRender = 'iota-render'
}