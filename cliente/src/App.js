import { useEffect, useState, useRef } from "react"
import './App.css';
import Editor from '@monaco-editor/react';

function App() {
  const editorRef = useRef(null);
  const consolaRef = useRef(null);

  function handleEditorDidMount(editor, id) {
    if (id === "editor") {
      editorRef.current = editor;
    } else if (id === "consola") {
      consolaRef.current = editor;
    }
  }


  function interpretar() {
    var entrada = editorRef.current.getValue();
    fetch('http://localhost:4000/interpretar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entrada: entrada }),
    })
      .then(response => response.json())
      .then(data => {
        consolaRef.current.setValue(data.Respuesta);
      })
      .catch((error) => {
        alert("Exitazo total")
        console.error('Error:', error);
      });
  }

  function reporteSimbolos() {
    var entrada = editorRef.current.getValue();
    fetch('http://localhost:4000/tablasimbolos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entrada: editorRef.current.getValue() }),
    })
      .then(response => response.blob())
      .then(blob => {

        const url = window.URL.createObjectURL(blob);
        const   a = document.createElement('a');
        a.href = url;
        a.download = 'TABLA_SIMBOLOS.html';
        a.click();
      })
      .catch((error) => {
        alert("Exitazo total tambla simbolos")
        console.error('Error:', error);
      });
  }
  
  function reporteErrores() {
    var entrada = editorRef.current.getValue();
    fetch('http://localhost:4000/rerrores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entrada: editorRef.current.getValue() }),
    })
      .then(response => response.blob())
      .then(blob => {

        const url = window.URL.createObjectURL(blob);
        const   a = document.createElement('a');
        a.href = url;
        a.download = 'REPORTE_ERRORES.html';
        a.click();
      })
      .catch((error) => {
        alert("Exitazo total tambla simbolos")
        console.error('Error:', error);
      });
  }


  const CargarArchivo = (event) => {
    const file = event.target.files[0];
    
    // Verificar si el archivo tiene la extensión .sc
    if (file.name.endsWith('.sc')) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const contents = event.target.result;
        editorRef.current.setValue(contents);
      };
      reader.readAsText(file);
    } else {
      alert('Por favor seleccione un archivo con extensión .sc');
      // Puedes agregar más lógica aquí si lo deseas, como limpiar el input de archivo o mostrar un mensaje de error
    }
  };
  
  const GuardarComoArchivo = () => {
    try {
        const contenido = editorRef.current.getValue(); // Obtener el contenido del editor
        const blob = new Blob([contenido], { type: 'text/plain' }); // Crear un Blob con el contenido en formato texto
        const url = URL.createObjectURL(blob); // Crear una URL del Blob
        
        const a = document.createElement('a'); // Crear un elemento <a> para el enlace de descarga
        a.href = url; // Establecer la URL como href del elemento <a>
        a.download = 'archivo.sc'; // Establecer el nombre de archivo con extensión .sc
        
        // Simular un clic en el enlace
        a.click(); 
        
        // Liberar la URL del Blob
        URL.revokeObjectURL(url); 
    } catch (error) {
        alert("Error al guardar el archivo: " + error);
    }
};

  const CrearArchivo = () => {
    try {
      editorRef.current.setValue(''); // Limpiar el contenido del editor de texto
      alert("Se ha creado un nuevo archivo. Puede comenzar a escribir.");
    } catch (error) {
      alert("Error al crear un nuevo archivo: " + error);
    }
  };
  


  return (
    <div className="App">
      <div className="text-center">
        <h3>CompiScript+ 202201947</h3>
      </div>
      <br />
      <div className="text-center">
        <div className="container">
          <div className="row">
            {/* Primer botón desplegable */}
            <div className="col">
              <div className="dropdown">
                <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  Archivo
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><label className="dropdown-item">
                    Nuevo Archivo
                    <input type="file" style={{ display: "none" }} onChange={CrearArchivo} /> 
                  </label></li>
                  <li><label className="dropdown-item">
                    Abrir Archivo
                    <input type="file" style={{ display: "none" }} onChange={CargarArchivo} />
                  </label></li>
                  <li><label className="dropdown-item">
                    Guardar Archivo
                    <input type="file" style={{ display: "none" }} onChange={GuardarComoArchivo} />
                  </label></li>
                </ul>
              </div>
            </div>
            {/* Tercer botón desplegable */}
            <div className="col">
              <div className="dropdown">
                <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                  Reportes
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                  <li><a className="dropdown-item" href="#" onClick={reporteErrores}>Reporte de Errores</a></li>
                  <li><a className="dropdown-item" href="#">Generar Arbol AST</a></li>
                  <li><a className="dropdown-item" href="#" onClick={reporteSimbolos}>Reporte Tabla de Simbolos</a></li>
                </ul>
              </div>
            </div>
            {/* Botón de interpretar */}
            <div className="col">
              <button type="button" className="btn btn-success btn-lg" onClick={interpretar}>Ejecutar</button>
            </div>
          </div>
        </div>
      </div>
      <br />
      {/* Tercer contenedor con área de consola */}
      <div className="text-center">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <p className="text-center">Entrada</p>
              <Editor height="90vh" defaultLanguage="java" defaultValue="" theme="vs-dark" onMount={(editor) => handleEditorDidMount(editor, "editor")} />
            </div>
            <div className="col">
              <p className="text-center">Consola</p>
              <Editor height="90vh" defaultLanguage="cpp" defaultValue="" theme="vs-dark" options={{ readOnly: true }} onMount={(editor) => handleEditorDidMount(editor, "consola")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;