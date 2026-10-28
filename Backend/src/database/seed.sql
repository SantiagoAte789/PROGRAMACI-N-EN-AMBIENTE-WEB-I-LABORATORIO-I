-- Estudiantes
INSERT INTO students_example (nombre, correo) 
VALUES
    ('Carlos Ramirez', 'carlos.example@example.com'),
    ('Laura Gomez', 'laura.example@example.com'),
    ('Andres Martinez', 'andres.example@example.com');

-- Cursos
INSERT INTO courses_example (nombre, creditos) 
VALUES
    ('Bases de Datos', 3),
    ('Programacion Web', 4),
    ('Arquitectura de Software', 3);

-- Matrículas
INSERT INTO enrollments_example (estudiante_id, curso_id, fecha_matricula, nota_final)
VALUES
    (1, 1, CURRENT_DATE, 4.5),
    (1, 2, CURRENT_DATE, 4.2),
    (2, 1, CURRENT_DATE, 3.8),
    (2, 3, CURRENT_DATE, 4.6),
    (3, 2, CURRENT_DATE, 4.0);

-- =====================================================================
-- LABORATORIO I - Datos de prueba (re-ejecutables: ON CONFLICT DO NOTHING)
-- =====================================================================

-- Teatros
INSERT INTO theaters (nombre, ciudad, direccion)
VALUES
    ('Teatro Municipal Enrique Buenaventura', 'Cali', 'Carrera 5 # 6-64'),
    ('Centro de Eventos Valle del Pacífico', 'Cali', 'Calle 36 Norte # 6A-65'),
    ('Coliseo de Ferias', 'Tuluá', 'Carrera 40 # 24-30'),
    ('Estadio Doce de Octubre', 'Tuluá', 'Calle 25 # 40-10'),
    ('Auditorio Central', 'Buga', 'Carrera 14 # 5-20'),
    ('Teatro Experimental', 'Palmira', 'Calle 30 # 28-45')
ON CONFLICT (nombre, ciudad) DO NOTHING;

-- Eventos (cubren los 5 estados del dominio)
INSERT INTO events (codigo, nombre, descripcion, categoria, teatro_id, fecha_inicio, fecha_fin, capacidad, precio, observaciones, estado)
SELECT v.codigo, v.nombre, v.descripcion, v.categoria, t.id, v.fecha_inicio::timestamp, v.fecha_fin::timestamp, v.capacidad, v.precio, v.observaciones, v.estado
FROM (VALUES
    (1001, 'Festival de Música del Valle', 'Festival con artistas nacionales y locales de diferentes géneros musicales.', 'Música', 'Coliseo de Ferias', 'Tuluá', '2026-12-05 18:00', '2026-12-05 23:30', 120, 85000, 'Apertura de puertas a las 5:00 PM.', 'Programado'),
    (1002, 'Concierto Sinfónico de Primavera', 'Presentación de la Orquesta Sinfónica del Valle con repertorio clásico y contemporáneo.', 'Música', 'Teatro Municipal Enrique Buenaventura', 'Cali', '2026-11-20 19:00', '2026-11-20 21:30', 80, 65000, 'Venta de boletería habilitada en puntos autorizados.', 'En Boleteria'),
    (1003, 'Rock al Parque Valle', 'Festival de rock con participación de bandas nacionales e internacionales.', 'Música', 'Estadio Doce de Octubre', 'Tuluá', '2026-10-27 17:00', '2026-10-27 23:00', 200, 45000, 'Evento actualmente en desarrollo.', 'En Vivo'),
    (1004, 'Obra de Teatro: El Principito', 'Adaptación teatral del clásico literario El Principito.', 'Teatro', 'Teatro Municipal Enrique Buenaventura', 'Cali', '2026-09-28 19:00', '2026-09-28 21:00', 60, 55000, 'Evento finalizado satisfactoriamente.', 'Finalizado'),
    (1005, 'Concierto de Música Urbana', 'Concierto con los principales exponentes de música urbana de la región.', 'Música', 'Centro de Eventos Valle del Pacífico', 'Cali', '2026-10-10 19:00', '2026-10-10 23:00', 150, 75000, 'Evento cancelado por motivos logísticos. Se realizará devolución del dinero.', 'Cancelado'),
    (1006, 'Noche de Stand Up Comedy', 'Cuatro comediantes colombianos en una noche de humor sin censura.', 'Comedia', 'Auditorio Central', 'Buga', '2026-11-14 20:00', '2026-11-14 22:00', 50, 35000, 'Recomendado para mayores de 16 años.', 'En Boleteria'),
    (1007, 'Muestra de Danza Folclórica del Pacífico', 'Compañías de danza de la región presentan los ritmos tradicionales del Pacífico colombiano.', 'Danza', 'Teatro Experimental', 'Palmira', '2026-11-28 18:30', '2026-11-28 20:30', 70, 30000, 'Entrada con cupo limitado.', 'Programado'),
    (1008, 'Noche de Jazz en Vivo', 'Un recorrido por los clásicos del jazz con músicos invitados.', 'Música', 'Teatro Experimental', 'Palmira', '2026-12-12 20:00', '2026-12-12 22:30', 45, 50000, 'Incluye una bebida de cortesía.', 'En Boleteria'),
    (1009, 'Feria Gastronómica del Valle', 'Muestra de la cocina vallecaucana con chefs invitados y degustaciones.', 'Gastronomía', 'Centro de Eventos Valle del Pacífico', 'Cali', '2026-10-24 11:00', '2026-10-24 20:00', 100, 25000, 'Evento finalizado. Gracias por su asistencia.', 'Finalizado'),
    (1010, 'Ópera: La Traviata', 'Montaje de la ópera de Verdi con solistas nacionales y coro invitado.', 'Ópera', 'Teatro Municipal Enrique Buenaventura', 'Cali', '2026-12-18 19:30', '2026-12-18 22:30', 90, 120000, 'Código de vestuario: formal.', 'Programado')
) AS v(codigo, nombre, descripcion, categoria, teatro, ciudad, fecha_inicio, fecha_fin, capacidad, precio, observaciones, estado)
JOIN theaters t ON t.nombre = v.teatro AND t.ciudad = v.ciudad
ON CONFLICT (codigo) DO NOTHING;

-- Clientes
INSERT INTO customers (nombre, correo)
VALUES
    ('Juan David Pérez', 'juan.perez@example.com'),
    ('María Fernanda López', 'maria.lopez@example.com'),
    ('Santiago Herrera', 'santiago.herrera@example.com'),
    ('Valentina Ríos', 'valentina.rios@example.com'),
    ('Camilo Ortiz', 'camilo.ortiz@example.com'),
    ('Daniela Castro', 'daniela.castro@example.com')
ON CONFLICT (correo) DO NOTHING;

-- Reservaciones (el total se calcula como entradas x precio del evento)
INSERT INTO reservations (codigo, cliente_id, evento_id, entradas, total, fecha_reserva, observaciones, estado)
SELECT v.codigo, c.id, e.id, v.entradas, v.entradas * e.precio, v.fecha_reserva::timestamp, v.observaciones, v.estado
FROM (VALUES
    (5001, 'juan.perez@example.com',        1001, 4, '2026-10-02 10:15', 'Pago en línea',              'Confirmada'),
    (5002, 'maria.lopez@example.com',       1001, 3, '2026-10-03 14:40', NULL,                         'Reservada'),
    (5003, 'santiago.herrera@example.com',  1001, 2, '2026-10-05 09:05', 'Zona preferencial',          'Confirmada'),
    (5004, 'juan.perez@example.com',        1002, 2, '2026-10-04 16:20', NULL,                         'Confirmada'),
    (5005, 'valentina.rios@example.com',    1002, 5, '2026-10-06 11:30', 'Grupo familiar',             'Confirmada'),
    (5006, 'camilo.ortiz@example.com',      1002, 1, '2026-10-07 18:10', NULL,                         'Cancelada'),
    (5007, 'daniela.castro@example.com',    1003, 6, '2026-10-08 12:00', 'Entradas para amigos',       'Confirmada'),
    (5008, 'santiago.herrera@example.com',  1003, 4, '2026-10-09 19:45', NULL,                         'Confirmada'),
    (5009, 'maria.lopez@example.com',       1004, 3, '2026-09-10 10:00', NULL,                         'Confirmada'),
    (5010, 'camilo.ortiz@example.com',      1004, 2, '2026-09-12 15:25', NULL,                         'Confirmada'),
    (5011, 'valentina.rios@example.com',    1005, 4, '2026-09-20 13:00', 'Reembolso en proceso',       'Cancelada'),
    (5012, 'juan.perez@example.com',        1005, 2, '2026-09-22 17:35', 'Reembolso en proceso',       'Cancelada'),
    (5013, 'daniela.castro@example.com',    1006, 4, '2026-10-11 20:10', NULL,                         'Confirmada'),
    (5014, 'camilo.ortiz@example.com',      1006, 3, '2026-10-12 08:50', NULL,                         'Reservada'),
    (5015, 'maria.lopez@example.com',       1007, 5, '2026-10-13 10:30', 'Visita de colegio',          'Reservada'),
    (5016, 'santiago.herrera@example.com',  1007, 2, '2026-10-14 16:00', NULL,                         'Confirmada'),
    (5017, 'valentina.rios@example.com',    1008, 2, '2026-10-15 21:15', 'Mesa cerca al escenario',    'Confirmada'),
    (5018, 'juan.perez@example.com',        1008, 3, '2026-10-16 09:40', NULL,                         'Reservada'),
    (5019, 'daniela.castro@example.com',    1009, 6, '2026-10-01 12:20', NULL,                         'Confirmada'),
    (5020, 'camilo.ortiz@example.com',      1009, 4, '2026-10-02 12:45', NULL,                         'Confirmada'),
    (5021, 'maria.lopez@example.com',       1010, 2, '2026-10-18 19:00', 'Palco lateral',              'Confirmada'),
    (5022, 'santiago.herrera@example.com',  1010, 4, '2026-10-19 10:05', NULL,                         'Reservada')
) AS v(codigo, correo, evento_codigo, entradas, fecha_reserva, observaciones, estado)
JOIN customers c ON c.correo = v.correo
JOIN events e ON e.codigo = v.evento_codigo
ON CONFLICT (codigo) DO NOTHING;
