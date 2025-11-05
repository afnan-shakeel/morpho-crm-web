

export interface MorphoApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}