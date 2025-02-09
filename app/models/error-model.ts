// Definición de códigos de error que podrían ocurrir con Axios
export const ERROR_CODE = {
    ERR_NETWORK: 'ERR_NETWORK',
    ERR_TIMEOUT: 'ERR_TIMEOUT',
  };
  
  // Mensajes de error que se usan en el manejo de excepciones
  export const ERROR_MESSAGE = {
    ERR_NETWORK: "No se pudo establecer conexión con el servidor.",
    SERVER_ERROR: "Hubo un error en el servidor, por favor intente nuevamente.",
    ERROR: "Se produjo un error inesperado.",
    UNAUTHORIZED: "No autorizado, por favor inicie sesión.",
    NOT_FOUND: "No se encontró el recurso.",
    BAD_REQUEST: "La solicitud es incorrecta. Verifique los datos.",
    UNPROCESSABLE_CONTENT: "El contenido procesado no es válido.",
  };
  
  // Estatus de los errores que pueden ser usados para manejar respuestas HTTP
  export const ERROR_STATUS = {
    SERVER_ERROR: 500,
    METHOD_NOT_ALLOWED: 405,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNPROCESSABLE_CONTENT: 422,
    CONFLICT: 409,
  };
  
  // Interfaz para describir el error en Axios
  export interface IAxiosError {
    response?: {
      status: number;
      data: {
        error?: string;
      };
    };
    code?: string;
    message?: string;
}
   