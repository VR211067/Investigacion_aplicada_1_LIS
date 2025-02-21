# Usa la versión 20 de Node.js en una imagen ligera
FROM node:20-alpine 

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias
COPY package.json package-lock.json ./

# Instala solo las dependencias necesarias para producción
RUN npm install --omit=dev

# Copia el resto de los archivos
COPY . .

# Exponer el puerto (el que usa la API)
EXPOSE 5000

# Comando para iniciar la API
CMD ["npm", "run", "start"]
