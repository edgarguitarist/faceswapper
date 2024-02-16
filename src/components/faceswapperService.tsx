/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "react-toastify";
import { API_RESULT, API_UPLOAD, MODEL_TYPE, SERVER_URL, API_UPLOAD_GIF } from "./api_constants";

interface IResponse<T> {
  code: string;
  data: T;
  msg: string;
}

interface Upload {
  code: string;
}

interface Resultado {
  downloadUrls: string[];
  status: string;
  type: number;
}



function generarImagen(code: string, tryCount = 0) {
  
  if (tryCount >= 20) {
    console.error("Se ha superado el número máximo de intentos");
    return;
  }

  fetch(API_RESULT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, serveUrl: SERVER_URL, type: MODEL_TYPE }),
  })
    .then((response) => response.json())
    .then((response: IResponse<Resultado>) => {
      if (response.data.status === "waiting") {
        console.log("El estado es waiting. Reintentando en 3 segundos...");
        setTimeout(() => {
          generarImagen(code , tryCount + 1);
        }, 4000); // Reintentar después de 3 segundos (3000 milisegundos)
      } else {
        console.log(`El estado ya no es waiting. URL: ${response.data.downloadUrls[0]}`);
        // Hacer algo con la respuesta cuando el estado ya no sea 'waiting'
        // abrir la imagen en una nueva pestaña
        //window.open(response.data.downloadUrls[0], "_blank");

        // descargar la imagen
        const imageUrl = response.data.downloadUrls[0]; // Obtener la URL de la imagen del objeto JSON
        const filename = `${code}`; // Nombre del archivo a descargar
        toast.success(`Imagen generada con exito ✔️`);
        fetch(imageUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            const extension = imageUrl.split(".").pop();
            a.href = url;
            a.download = filename + extension;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
      }
    })
    .catch((error) => {
      console.error("Error al realizar la consulta:", error);
      setTimeout(() => {
        generarImagen(code , tryCount + 1);
      }, 4000);
    });
}

export async function subirImagen(formData: any, ext: string) {

  const URL_API = ext === "gif" ? API_UPLOAD_GIF : API_UPLOAD;
  try {
    const response = await fetch(URL_API, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result: IResponse<Upload> = await response.json();
      console.log("Success:", result);
      generarImagen(result.data.code);
      return result; // Devuelve el resultado si es necesario
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Lanza el error para que se maneje fuera de la función si es necesario
  }
}
