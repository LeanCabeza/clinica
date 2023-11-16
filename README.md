# Clínica OSPI - Plataforma de Gestión de Turnos Médicos

## Bienvenido/a a la plataforma de gestión de turnos médicos de la Clínica OSPI. Este sistema permite a pacientes, especialistas y administradores acceder y gestionar de manera eficiente los turnos médicos. A continuación, se detallan las funcionalidades de cada sprint:

## Sprint 1 - Registro e Ingreso al Sistema

### Página de Bienvenida
- Accesos al login y registro del sistema.

### Registro
#### Pacientes
- Campos: Nombre, Apellido, Edad, DNI, Obra Social, Mail, Password, 2 imágenes.
- Validación de campos.

#### Especialistas
- Campos: Nombre, Apellido, Edad, DNI, Especialidad (con opción de agregar nueva), Mail, Password, Imagen.
- Validación de campos.

### Login
- Acceso al sistema con botones de acceso rápido.
- Validación y condiciones de acceso para Especialistas y Pacientes.

### Sección Usuarios (Solo Administradores)
- Visualización de información de usuarios.
- Habilitar/inhabilitar acceso de Especialistas.
- Crear nuevos usuarios con opción de administrador.

## Sprint 2 - Carga y Visualización de Turnos

### Mis Turnos (Paciente)
- Filtro por Especialidad y Especialista sin combobox.
- Acciones: Cancelar turno, Ver reseña, Completar encuesta, Calificar Atención.
- Estado del turno visible.

### Mis Turnos (Especialista)
- Filtro por Especialidad y Paciente sin combobox.
- Acciones: Cancelar, Rechazar, Aceptar, Finalizar turno, Ver Reseña.
- Estado del turno visible.

### Turnos (Administrador)
- Filtro por Especialidad y Especialista sin combobox.
- Acciones: Cancelar turno, Solicitar turno.
- Estado del turno visible.

### Solicitar Turno
- Acceso para Pacientes y Administradores.
- Selección de Especialidad, Especialista, Día y Horario.

### Mi Perfil
- Datos del usuario (nombre, apellido, imágenes, etc.).
- Mis Horarios (Solo Especialistas)
  - Marcado de disponibilidad horaria.

# Capturas de la web

![Main](https://github.com/LeanCabeza/clinica/assets/60674663/846fb87f-f5b9-4747-b612-cd2cbbf2f576)
![Login](https://github.com/LeanCabeza/clinica/assets/60674663/b97100df-2153-486e-895b-f1c4cd0a23a0)
![Registrarse2](https://github.com/LeanCabeza/clinica/assets/60674663/8a5f7aa8-13d8-414c-a216-2deff1c7ae12)
![MiPerfil](https://github.com/LeanCabeza/clinica/assets/60674663/8399d0bd-328d-4aa7-b794-fa6defe91746)
![AdminPanel](https://github.com/LeanCabeza/clinica/assets/60674663/7c59269a-4448-47aa-9446-5207a2196d15)
![ReservarTurno](https://github.com/LeanCabeza/clinica/assets/60674663/61239196-06a0-4d77-a5a7-c7f04f56cdf9)
![CalificarAtencion](https://github.com/LeanCabeza/clinica/assets/60674663/82381d82-eb20-4988-aa82-a66a17bed5c3)
![EspecialistaPanel](https://github.com/LeanCabeza/clinica/assets/60674663/8ba51e37-ab06-4277-9277-2091bd8eae5a)


¡Gracias por confiar en la Clínica OSPI para tu gestión de turnos médicos!
