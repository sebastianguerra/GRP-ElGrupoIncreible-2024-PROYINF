import React, { useEffect } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneFileImageLoader from 'cornerstone-file-image-loader';

const App = () => {
  useEffect(() => {
    // Configurar el cargador de imágenes
    cornerstoneFileImageLoader.external.cornerstone = cornerstone;

    const element = document.getElementById('dicomImage') as HTMLElement;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    const handleFileChange = (file: File) => {
      if (!file) {
        console.error("No file selected");
        return;
      }
      const imageId = cornerstoneFileImageLoader.fileManager.add(file);
      cornerstone.loadImage(imageId).then((image) => {
        cornerstone.displayImage(element, image);
      }).catch((error) => {
        console.error("Error loading image: ", error);
      });
    };

    fileInput.addEventListener('change', (e: Event) => {
      const file = (e.target as HTMLInputElement).files![0];
      console.log("File selected from input: ", file);
      handleFileChange(file);
    });

    // Agregar manejadores de eventos de drag and drop
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.style.borderColor = 'blue'; // Cambiar el color del borde para indicar que se puede soltar el archivo
    });

    element.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.style.borderColor = 'black'; // Restaurar el color del borde cuando el archivo es arrastrado fuera del contenedor
    });

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.style.borderColor = 'black'; // Restaurar el color del borde cuando se suelta el archivo

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        console.log("File dropped: ", files[0]);
        handleFileChange(files[0]); // Procesar el archivo soltado
      } else {
        console.error("No files dropped");
      }
    });

    return () => {
      // Limpiar los event listeners cuando el componente se desmonta
      fileInput.removeEventListener('change', handleFileChange as any);
      element.removeEventListener('dragover', (e) => e.preventDefault());
      element.removeEventListener('dragleave', (e) => e.preventDefault());
      element.removeEventListener('drop', (e) => e.preventDefault());
    };
  }, []);

  return (
    <div>
      <input type="file" id="fileInput" />
      <div
        id="dicomImage"
        style={{ width: '512px', height: '512px', border: '1px solid black' }}
      ></div>
    </div>
  );
};

export default App;
