import ImageUploader from "./components/imageUploader.jsx";
import "./app.css";
import { useRef, useState } from "react";


export default function App() {
  const originalIMGRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    originalIMGRef!.current!.src = fileURL;
  };

  return (
    <>
      <div id="principal">
        <div id="uno">
          <h1>ORIGINAL</h1>
          <img ref={originalIMGRef} src="/no-image.jpg" alt="" />
          <input
            type="file"
            name="originalFile"
            id="originalFile"
            onChange={handleSelect}
          />
        </div>
        <div id="dos">
          <h1>DESTINO</h1>
          <ImageUploader fileOriginal={selectedFile} />
        </div>
      </div>
    </>
  );
}
