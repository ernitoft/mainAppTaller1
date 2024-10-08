
```markdown
## Requisitos
Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js**: [Descargar Node.js](https://nodejs.org/)
- **npm**: npm se instala automáticamente con Node.js, pero puedes verificar si está instalado correctamente ejecutando:
  ```bash
  npm --version
  ```
  
## Instalación

Sigue estos pasos para clonar el repositorio e instalar las dependencias del proyecto:

1. **Clona el repositorio**:

    ```bash
    git clone https://github.com/ernitoft/mainAppTaller1
    ```

2. **Navega al directorio del proyecto**:

    ```bash
    cd mainAppTaller1
    ```

3. **Instala las dependencias**:

    ```bash
    npm install
    ```

## Scripts disponibles

En este proyecto puedes utilizar los siguientes comandos:

- **Iniciar el servidor en modo desarrollo**:
  
    Utiliza `nodemon` (si está instalado globalmente o en tu proyecto) para recargar el servidor automáticamente con cada cambio:

    ```bash
    npm run dev
    ```

- **Iniciar el servidor**:

    Para iniciar el servidor en modo producción:

    ```bash
    npm start
    ```


## Variables de entorno

El proyecto utiliza variables de entorno para la configuración. Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:

```
PORT=8080
SECRET=""
```

Puedes personalizar estas variables según lo que necesites.

## Uso

1. **Ejecutar el servidor**:

    ```bash
    npm start
    ```

2. Abre tu navegador o Postman y accede a `http://localhost:8080` para verificar que el servidor esté funcionando.

Puedes ver todas las dependencias en el archivo `package.json`.

```

Este archivo `README.md` está listo para ser copiado y pegado en tu repositorio de GitHub.
