export class HttpService {
    public readonly baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
    }
}
