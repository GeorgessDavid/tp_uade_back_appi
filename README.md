# Trabajo Práctico Obligatorio 
Este repositorio corresponde al Back-end del TPO.

---

## Para empezar
### Requisitos Previos
* [Node.js](https://nodejs.org/es/download) >= Versión 18 (Recomendado LTS)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) o [pnpm](https://pnpm.io/installation).
### 1. Clonar el Repositorio
```bash
git clone https://github.com/usuario/tp_api_front.git
cd tp_api_front
```

### 2. Instalar Dependencias
Con **pnpm** (recomendado):
```bash
pnpm install
```
o con **npm**:
```bash
npm install
```

### 3. Inicializar el proyecto
```bash
pnpm dev 
```
o
```bash
npm run dev
```


<details><summary><strong> Enunciado </strong></summary>
### Landing Page
* La página principal debe presentar al médico, su especialidad, formación, servicios ofrecidos y datos de contacto.
* Debe incluir un formulario o enlace que permita reservar una cita.
* Debe incluir un diseño responsivo y profesional acorde a la temática médica.


---
### Reserva de Citas
* El formulario de reserva debe solicitar.
    * Nombre y Apellido
    * Nombre y Apellido del Paciente
    * Teléfono
    * Correo electrónico.
    * Obra Social.
* Debe incluir un calendario que muestre las citas disponibles durante las **dos próximas semanas**.
* Las fechas y horarios disponibles deben actualizarse dinámicamente según la ocupación.
* La obra social debe ser una lista de aquellas con las cuales el médico tiene convenio.

---
### Login para médico o secretaria
* La landing page debe incluir un acceso para el médico o su secretaria mediante usuario y contraseña.
* **No** se implementará registro de usuarios. Las credenciales del administrador.

---
### Gestión de Citas -- Área Administrativa
* Una vez logueados, el médico o su secretaria podrán:
    * Visualizar todas las citas solicitadas.
    * Confirmar una cita cambiando su estado de *"Solicitada"* a *"Confirmada"*.

---
### Administración de Obras Sociales
* El sistema debe permitir al usuario crear, modificar o eliminar obras sociales.
* Estas serán las qeu se muestren en la funcionalidad de concretar cita.

---
### Notificaciones
* Enviar notificación por correo electrónico al paciente cuando crea una nueva cita.
* Enviar notificación por correo electrónico al paciente cuando la cita pase de *"Solicitada"* a *"Confirmada"*.

---
### Seguridad y Privacidad
* Asegurar la protección de los datos de los pacientes y la privacidad de la información.
* Implementar buenas prácticas de seguridad, como el cifrado de contraseñas del administrador.
</details>

#### Integrantes
---

* Ramiro Carranza.
* Luciano Conde.
* Georges David.

---