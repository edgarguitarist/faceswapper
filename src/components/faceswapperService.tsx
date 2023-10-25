/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_RESULT, API_UPLOAD, MODEL_TYPE, SERVER_URL } from "./api_constants";

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



function generarImagen(code: string) {
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
          generarImagen(code);
        }, 4000); // Reintentar después de 3 segundos (3000 milisegundos)
      } else {
        console.log(`El estado ya no es waiting. URL: ${response.data.downloadUrls[0]}`);
        // Hacer algo con la respuesta cuando el estado ya no sea 'waiting'
        // abrir la imagen en una nueva pestaña
        //window.open(response.data.downloadUrls[0], "_blank");

        // descargar la imagen
        const imageUrl = response.data.downloadUrls[0]; // Obtener la URL de la imagen del objeto JSON
        const filename = `${code}.jpg`; // Nombre del archivo a descargar

        fetch(imageUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
      }
    })
    .catch((error) => {
      console.error("Error al realizar la consulta:", error);
      // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    });
}

export async function subirImagen(formData: any) {
  try {
    const response = await fetch(API_UPLOAD, {
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
