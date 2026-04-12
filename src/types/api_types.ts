export interface ResponseApiType {
    success: boolean,
    message: string,
    data?: Object,
    meta?: Object,
    errors?: Object
}