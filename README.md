# 📦 Sistema de Gestión de Inventario Full Stack

Este es un proyecto robusto de gestión de inventario desarrollado para demostrar la integración de un backend en *Java Spring Boot, un frontend dinámico en **React* y contenedores con *Docker*.

## 🚀 Tecnologías Utilizadas

### Backend
* *Java 17* & *Spring Boot 3*
* *Spring Data JPA*: Para la persistencia de datos.
* *Spring Validation*: Validaciones de integridad en el lado del servidor.
* *MySQL*: Base de datos relacional.
* *Lombok*: Para un código más limpio (Getters/Setters automáticos).

### Frontend
* *React* (Vite): SPA rápida y moderna.
* *Bootstrap 5*: Diseño responsivo y profesional.
* *Axios*: Gestión de peticiones HTTP al API.

### DevOps & Herramientas
* *Docker & Docker Compose*: Orquestación de toda la infraestructura.
* *Git/GitHub*: Control de versiones.

---

## 🛠️ Funcionalidades del Proyecto

- [x] *CRUD Completo*: Creación, lectura y eliminación de productos.
- [x] *Validaciones de Seguridad*: El sistema no permite precios negativos ni nombres vacíos gracias a Bean Validation.
- [x] *Interfaz Responsiva*: Diseñada con Bootstrap para funcionar en móviles y escritorio.
- [x] *Arquitectura Desacoplada*: El Frontend y el Backend se comunican vía REST API con soporte para CORS.

---

## 📦 Instalación y Despliegue con Docker

Si tienes Docker instalado, puedes levantar todo el entorno (Base de Datos + API + Web) con un solo comando:

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)