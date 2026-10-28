-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS students_example (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses_example (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0)
);

-- Tabla intermedia para la relación N:M
CREATE TABLE IF NOT EXISTS enrollments_example (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES students_example(id) ON DELETE CASCADE,
    curso_id INTEGER NOT NULL REFERENCES courses_example(id) ON DELETE CASCADE,
    fecha_matricula DATE NOT NULL DEFAULT CURRENT_DATE,
    nota_final NUMERIC(3, 1) CHECK (nota_final BETWEEN 0 AND 5),
    UNIQUE (estudiante_id, curso_id)
);

-- =====================================================================
-- LABORATORIO I - Funcionalidad 1: Cartelera de eventos
-- Relación 1:N  ->  theaters (1) --- (N) events
-- =====================================================================

-- Tabla de teatros / escenarios
CREATE TABLE IF NOT EXISTS theaters (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    UNIQUE (nombre, ciudad)
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    codigo INTEGER UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    teatro_id INTEGER NOT NULL REFERENCES theaters(id) ON DELETE RESTRICT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programado'
        CHECK (estado IN ('Programado', 'En Boleteria', 'En Vivo', 'Finalizado', 'Cancelado')),
    CHECK (fecha_fin > fecha_inicio)
);

CREATE INDEX IF NOT EXISTS idx_events_teatro_id ON events(teatro_id);
CREATE INDEX IF NOT EXISTS idx_events_estado ON events(estado);

-- =====================================================================
-- LABORATORIO I - Funcionalidad 2: Reservaciones y ventas
-- Relación N:M  ->  customers (N) --- (M) events, resuelta con reservations
-- =====================================================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL
);

-- Tabla de reservaciones (tabla intermedia con datos propios)
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    codigo INTEGER UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    evento_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    entradas INTEGER NOT NULL CHECK (entradas > 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Reservada'
        CHECK (estado IN ('Reservada', 'Confirmada', 'Cancelada'))
);

CREATE INDEX IF NOT EXISTS idx_reservations_cliente_id ON reservations(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reservations_evento_id ON reservations(evento_id);
CREATE INDEX IF NOT EXISTS idx_reservations_estado ON reservations(estado);
