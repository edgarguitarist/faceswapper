import ImageUploader from "./components/imageUploader";
import "./app.css";
import { useRef, useState } from "react";

function App() {
  const originalIMGRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelect = (e:any) => {
    setSelectedFile(e.target.files[0]);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    originalIMGRef.current.src = fileURL;
  };

  return (
    <>
      <div id="principal">
        <div id="uno">
          <h1>ORIGINAL</h1>
          <img ref={originalIMGRef} src="" alt="" />
          <input
            type="file"
            name="originalFile"
            id="originalFile"
            onChange={handleSelect}
          />
        </div>
        <div id="dos">
          <h1>MODELOS</h1>
          <ImageUploader fileOriginal={selectedFile} />
        </div>
      </div>
    </>
  );
}

export default App;
