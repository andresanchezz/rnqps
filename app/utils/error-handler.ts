import * as Sentry from '@sentry/react-native';
import { AxiosResponse } from 'axios';
import { ERROR_CODE, ERROR_MESSAGE, ERROR_STATUS, IAxiosError } from '../models/error-model';
import Toast from 'react-native-toast-message';


type ApiResponse<T> = T;

const handleAxiosError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: 'Message',
    text2: message
  });
  Sentry.captureMessage(message);
};

/**
 * @param {() => Promise<AxiosResponse<T>>} apiCall - La función de la API a ejecutar.
 * @param {(msg: string) => void} [errorCallback] - Callback opcional para manejar errores específicos.
 * @returns {Promise<T>} - Devuelve los datos si la llamada es exitosa.
 * @throws {IAxiosError} - Si la API falla, se captura con Sentry.
 */
export const handleApiErrors = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  errorCallback?: (msg: string) => void
): Promise<T> => {
  try {
    const response = await apiCall();
    /* console.log(response.data) */
    return response.data as ApiResponse<T>;
  } catch (error: any) {
    console.log(JSON.stringify(error.response.data, null, 2))
    Sentry.captureException(error);

    const { response, code } = error as IAxiosError;

    if (code === ERROR_CODE.ERR_NETWORK) {
      handleAxiosError(ERROR_MESSAGE.ERR_NETWORK);
    } else if (!response) {
      handleAxiosError(ERROR_MESSAGE.ERROR);
    } else {
      switch (response.status) {
        case ERROR_STATUS.SERVER_ERROR:
          handleAxiosError(ERROR_MESSAGE.SERVER_ERROR);
          break;
        case ERROR_STATUS.METHOD_NOT_ALLOWED:
          handleAxiosError(ERROR_MESSAGE.ERROR);
          break;
        case ERROR_STATUS.UNAUTHORIZED:
          handleAxiosError(ERROR_MESSAGE.UNAUTHORIZED);
          break;
        case ERROR_STATUS.NOT_FOUND:
          handleAxiosError(ERROR_MESSAGE.NOT_FOUND);
          break;
        case ERROR_STATUS.BAD_REQUEST:
        case ERROR_STATUS.UNPROCESSABLE_CONTENT:
        case 409:
          if (errorCallback) {
            errorCallback(response.data.error || ERROR_MESSAGE.BAD_REQUEST);
          }
          break;
        default:
          handleAxiosError(response.data?.error || ERROR_MESSAGE.ERROR);
      }
    }

    return Promise.reject(error);
  }
};
