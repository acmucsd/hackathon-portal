export type APIHandlerProps<T> = {
  onSuccessCallback?: (data: T) => void;
  onFailCallback?: (error: unknown) => void;
};
