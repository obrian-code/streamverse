-- StreamVerse OTT Platform - Seed Data v2
-- Schema: TypeORM entities actuales
-- ============================================

-- ============================================
-- PREPARACIÓN
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Limpiar datos existentes (orden inverso de FK)
TRUNCATE TABLE history CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE episodes CASCADE;
TRUNCATE TABLE channels CASCADE;
TRUNCATE TABLE series CASCADE;
TRUNCATE TABLE movies CASCADE;
TRUNCATE TABLE users CASCADE;

-- Resetear secuencias si las hubiera (no aplica para UUIDs)

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (id, name, email, password, role, avatar) VALUES
    ('a0000000-0000-0000-0000-000000000001',
     'Admin StreamVerse',
     'admin@streamverse.com',
     crypt('Admin1234', gen_salt('bf', 10)),
     'admin',
     'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
    ('a0000000-0000-0000-0000-000000000002',
     'Usuario Demo',
     'user@streamverse.com',
     crypt('Demo1234', gen_salt('bf', 10)),
     'user',
     'https://api.dicebear.com/7.x/avataaars/svg?seed=demo');

-- ============================================
-- MOVIES (20 películas)
-- ============================================
INSERT INTO movies (id, title, description, poster, backdrop, category, duration, "releaseDate", rating, status, "videoUrl", views) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'El Último Guerrero', 'Un guerrero solitario debe defender su reino de las fuerzas oscuras que amenazan con destruirlo todo.', 'https://img.streamverse.com/movies/ultimo-guerrero-poster.jpg', 'https://img.streamverse.com/movies/ultimo-guerrero-backdrop.jpg', 'Acción', 148, '2024-03-15', 8.2, 'published', 'https://stream.streamverse.com/movies/ultimo-guerrero.m3u8', 45200),
    ('d0000000-0000-0000-0000-000000000002', 'Risas en Marte', 'Un grupo de astronautas torpes intenta colonizar Marte con resultados hilarantes.', 'https://img.streamverse.com/movies/risas-marte-poster.jpg', 'https://img.streamverse.com/movies/risas-marte-backdrop.jpg', 'Comedia', 112, '2024-05-20', 7.5, 'published', 'https://stream.streamverse.com/movies/risas-marte.m3u8', 38100),
    ('d0000000-0000-0000-0000-000000000003', 'El Silencio del Bosque', 'Un detective investiga desapariciones en un bosque donde nada es lo que parece.', 'https://img.streamverse.com/movies/silencio-bosque-poster.jpg', 'https://img.streamverse.com/movies/silencio-bosque-backdrop.jpg', 'Suspenso', 135, '2024-01-10', 8.7, 'published', 'https://stream.streamverse.com/movies/silencio-bosque.m3u8', 52300),
    ('d0000000-0000-0000-0000-000000000004', 'Corazones Eléctricos', 'Dos robots se enamoran en un mundo post-apocalíptico donde los humanos ya no existen.', 'https://img.streamverse.com/movies/corazones-electricos-poster.jpg', 'https://img.streamverse.com/movies/corazones-electricos-backdrop.jpg', 'Romance', 126, '2024-02-14', 8.0, 'published', 'https://stream.streamverse.com/movies/corazones-electricos.m3u8', 29800),
    ('d0000000-0000-0000-0000-000000000005', 'La Noche del Demonio', 'Una familia se muda a una casa antigua donde habita una presencia demoníaca.', 'https://img.streamverse.com/movies/noche-demonio-poster.jpg', 'https://img.streamverse.com/movies/noche-demonio-backdrop.jpg', 'Terror', 108, '2024-10-15', 7.8, 'published', 'https://stream.streamverse.com/movies/noche-demonio.m3u8', 41500),
    ('d0000000-0000-0000-0000-000000000006', 'El Último Refugio', 'En un mundo devastado, un padre busca un lugar seguro para su hija.', 'https://img.streamverse.com/movies/ultimo-refugio-poster.jpg', 'https://img.streamverse.com/movies/ultimo-refugio-backdrop.jpg', 'Drama', 142, '2024-06-01', 8.9, 'published', 'https://stream.streamverse.com/movies/ultimo-refugio.m3u8', 61200),
    ('d0000000-0000-0000-0000-000000000007', 'Planeta Prohibido', 'Una expedición científica llega a un planeta donde las leyes de la física no aplican.', 'https://img.streamverse.com/movies/planeta-prohibido-poster.jpg', 'https://img.streamverse.com/movies/planeta-prohibido-backdrop.jpg', 'Ciencia Ficción', 155, '2024-07-20', 8.4, 'published', 'https://stream.streamverse.com/movies/planeta-prohibido.m3u8', 35700),
    ('d0000000-0000-0000-0000-000000000008', 'La Familia Pérez', 'Las aventuras de una familia mexicana disfuncional pero unida.', 'https://img.streamverse.com/movies/familia-perez-poster.jpg', 'https://img.streamverse.com/movies/familia-perez-backdrop.jpg', 'Comedia', 98, '2024-04-25', 7.2, 'published', 'https://stream.streamverse.com/movies/familia-perez.m3u8', 28400),
    ('d0000000-0000-0000-0000-000000000009', 'Mentes Brillantes', 'Un grupo de estudiantes de matemáticas descubre un código que puede cambiar el mundo.', 'https://img.streamverse.com/movies/mentes-brillantes-poster.jpg', 'https://img.streamverse.com/movies/mentes-brillantes-backdrop.jpg', 'Suspenso', 132, '2024-08-10', 8.1, 'published', 'https://stream.streamverse.com/movies/mentes-brillantes.m3u8', 22100),
    ('d0000000-0000-0000-0000-000000000010', 'El Gran Viaje de Lila', 'Una niña y su perro mágico exploran un mundo fantástico lleno de criaturas asombrosas.', 'https://img.streamverse.com/movies/gran-viaje-lila-poster.jpg', 'https://img.streamverse.com/movies/gran-viaje-lila-backdrop.jpg', 'Animación', 95, '2024-03-30', 8.5, 'published', 'https://stream.streamverse.com/movies/gran-viaje-lila.m3u8', 48600),
    ('d0000000-0000-0000-0000-000000000011', 'Operación Rescate', 'Un agente secreto deberá infiltrarse en la fortaleza más custodiada del mundo.', 'https://img.streamverse.com/movies/operacion-rescate-poster.jpg', 'https://img.streamverse.com/movies/operacion-rescate-backdrop.jpg', 'Acción', 140, '2024-09-05', 7.9, 'published', 'https://stream.streamverse.com/movies/operacion-rescate.m3u8', 33400),
    ('d0000000-0000-0000-0000-000000000012', 'Secretos del Amazonas', 'Un documental que explora las maravillas ocultas de la selva amazónica.', 'https://img.streamverse.com/movies/secretos-amazonas-poster.jpg', 'https://img.streamverse.com/movies/secretos-amazonas-backdrop.jpg', 'Documental', 118, '2024-04-22', 9.0, 'published', 'https://stream.streamverse.com/movies/secretos-amazonas.m3u8', 19700),
    ('d0000000-0000-0000-0000-000000000013', 'Bailando con el Corazón', 'Dos bailarines de salsa compiten por el campeonato mundial mientras se enamoran.', 'https://img.streamverse.com/movies/bailando-corazon-poster.jpg', 'https://img.streamverse.com/movies/bailando-corazon-backdrop.jpg', 'Romance', 120, '2024-02-01', 7.6, 'published', 'https://stream.streamverse.com/movies/bailando-corazon.m3u8', 36500),
    ('d0000000-0000-0000-0000-000000000014', 'El Código del Apocalipsis', 'Un científico descifra un código antiguo que predice el fin del mundo.', 'https://img.streamverse.com/movies/codigo-apocalipsis-poster.jpg', 'https://img.streamverse.com/movies/codigo-apocalipsis-backdrop.jpg', 'Ciencia Ficción', 138, '2024-11-10', 7.7, 'published', 'https://stream.streamverse.com/movies/codigo-apocalipsis.m3u8', 28900),
    ('d0000000-0000-0000-0000-000000000015', 'La Invitación', 'Una cena elegante se convierte en una pesadilla cuando los invitados comienzan a desaparecer.', 'https://img.streamverse.com/movies/invitacion-poster.jpg', 'https://img.streamverse.com/movies/invitacion-backdrop.jpg', 'Terror', 105, '2024-10-31', 8.3, 'published', 'https://stream.streamverse.com/movies/invitacion.m3u8', 37900),
    ('d0000000-0000-0000-0000-000000000016', 'Sueños de Gloria', 'La historia real del futbolista que superó todas las adversidades para llegar a la cima.', 'https://img.streamverse.com/movies/suenos-gloria-poster.jpg', 'https://img.streamverse.com/movies/suenos-gloria-backdrop.jpg', 'Drama', 152, '2024-06-15', 8.6, 'published', 'https://stream.streamverse.com/movies/suenos-gloria.m3u8', 55300),
    ('d0000000-0000-0000-0000-000000000017', 'El Viajero del Tiempo', 'Un hombre común encuentra un reloj que le permite viajar al pasado.', 'https://img.streamverse.com/movies/viajero-tiempo-poster.jpg', 'https://img.streamverse.com/movies/viajero-tiempo-backdrop.jpg', 'Ciencia Ficción', 130, '2024-12-25', 8.0, 'published', 'https://stream.streamverse.com/movies/viajero-tiempo.m3u8', 31200),
    ('d0000000-0000-0000-0000-000000000018', 'La Reina del Barrio', 'Una humilde vendedora ambulante se convierte en la empresaria más poderosa del país.', 'https://img.streamverse.com/movies/reina-barrio-poster.jpg', 'https://img.streamverse.com/movies/reina-barrio-backdrop.jpg', 'Drama', 125, '2024-08-20', 7.8, 'published', 'https://stream.streamverse.com/movies/reina-barrio.m3u8', 26800),
    ('d0000000-0000-0000-0000-000000000019', 'Sombras en la Ciudad', 'Un justiciero enmascarado limpia las calles de una ciudad corrupta.', 'https://img.streamverse.com/movies/sombras-ciudad-poster.jpg', 'https://img.streamverse.com/movies/sombras-ciudad-backdrop.jpg', 'Acción', 145, '2024-07-04', 8.2, 'published', 'https://stream.streamverse.com/movies/sombras-ciudad.m3u8', 42100),
    ('d0000000-0000-0000-0000-000000000020', 'El Jardín Secreto', 'Una niña huérfana descubre un jardín mágico que cambia su vida para siempre.', 'https://img.streamverse.com/movies/jardin-secreto-poster.jpg', 'https://img.streamverse.com/movies/jardin-secreto-backdrop.jpg', 'Drama', 110, '2024-12-10', 8.4, 'published', 'https://stream.streamverse.com/movies/jardin-secreto.m3u8', 24500);

-- ============================================
-- SERIES (5 series)
-- ============================================
INSERT INTO series (id, title, description, poster, backdrop, category, rating, status, views) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Frontera Sur', 'Un agente de la DEA se infiltra en un cártel mexicano mientras lidia con su propia identidad.', 'https://img.streamverse.com/series/frontera-sur-poster.jpg', 'https://img.streamverse.com/series/frontera-sur-backdrop.jpg', 'Drama', 8.7, 'published', 89200),
    ('e0000000-0000-0000-0000-000000000002', 'Código Cósmico', 'Un equipo de científicos descubre una señal extraterrestre que cambiará la humanidad.', 'https://img.streamverse.com/series/codigo-cosmico-poster.jpg', 'https://img.streamverse.com/series/codigo-cosmico-backdrop.jpg', 'Ciencia Ficción', 8.5, 'published', 76500),
    ('e0000000-0000-0000-0000-000000000003', 'Nuevos Comienzos', 'Las vidas de cinco personas se entrelazan en la Ciudad de México.', 'https://img.streamverse.com/series/nuevos-comienzos-poster.jpg', 'https://img.streamverse.com/series/nuevos-comienzos-backdrop.jpg', 'Drama', 7.9, 'published', 63400),
    ('e0000000-0000-0000-0000-000000000004', 'Risa Asegurada', 'Un grupo de comediantes fracasados abre un club de comedia en el peor barrio de la ciudad.', 'https://img.streamverse.com/series/risa-asegurada-poster.jpg', 'https://img.streamverse.com/series/risa-asegurada-backdrop.jpg', 'Comedia', 8.1, 'published', 52100),
    ('e0000000-0000-0000-0000-000000000005', 'El Santuario', 'Los sobrevivientes de un apocalipsis zombie buscan un lugar seguro.', 'https://img.streamverse.com/series/santuario-poster.jpg', 'https://img.streamverse.com/series/santuario-backdrop.jpg', 'Terror', 8.3, 'published', 94800);

-- ============================================
-- EPISODES
-- ============================================
-- Frontera Sur (8 episodios, 2 temporadas)
INSERT INTO episodes (id, "seriesId", season, episode, title, description, "videoUrl", duration, thumbnail) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, 1, 'El Infiltrado', 'Andrés Herrera recibe su primera misión encubierta: infiltrarse en el Cártel del Pacífico. Un solo error puede costarle la vida.', 'https://stream.streamverse.com/series/frontera-sur/s1e1.m3u8', 52, 'https://img.streamverse.com/episodes/frontera-sur-s1e1.jpg'),
    ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 1, 2, 'La Prueba de Sangre', 'Para ganar la confianza del cártel, Andrés debe superar una peligrosa prueba.', 'https://stream.streamverse.com/series/frontera-sur/s1e2.m3u8', 48, 'https://img.streamverse.com/episodes/frontera-sur-s1e2.jpg'),
    ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 1, 3, 'Lealtades Divididas', 'Andrés comienza a cuestionar su lealtad cuando conoce el lado humano del cártel.', 'https://stream.streamverse.com/series/frontera-sur/s1e3.m3u8', 50, 'https://img.streamverse.com/episodes/frontera-sur-s1e3.jpg'),
    ('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 1, 4, 'Traición', 'Un informante anónimo amenaza con exponer a Andrés.', 'https://stream.streamverse.com/series/frontera-sur/s1e4.m3u8', 46, 'https://img.streamverse.com/episodes/frontera-sur-s1e4.jpg'),
    ('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 2, 1, 'Nuevo Comienzo', 'Un año después, Andrés ha ascendido en la organización. La DEA le exige una operación final.', 'https://stream.streamverse.com/series/frontera-sur/s2e1.m3u8', 54, 'https://img.streamverse.com/episodes/frontera-sur-s2e1.jpg'),
    ('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', 2, 2, 'El Precio del Poder', 'Andrés descubre que el cártel planea un golpe masivo.', 'https://stream.streamverse.com/series/frontera-sur/s2e2.m3u8', 51, 'https://img.streamverse.com/episodes/frontera-sur-s2e2.jpg'),
    ('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000001', 2, 3, 'Sin Salida', 'La situación se vuelve insostenible. Andrés queda atrapado entre dos fuegos.', 'https://stream.streamverse.com/series/frontera-sur/s2e3.m3u8', 49, 'https://img.streamverse.com/episodes/frontera-sur-s2e3.jpg'),
    ('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000001', 2, 4, 'El Final del Camino', 'El desenlace de la historia de Andrés Herrera.', 'https://stream.streamverse.com/series/frontera-sur/s2e4.m3u8', 56, 'https://img.streamverse.com/episodes/frontera-sur-s2e4.jpg');

-- Código Cósmico (6 episodios, 2 temporadas)
INSERT INTO episodes (id, "seriesId", season, episode, title, description, "videoUrl", duration, thumbnail) VALUES
    ('f0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000002', 1, 1, 'La Señal', 'La Dra. Elena Rivas detecta una señal que no es de este mundo.', 'https://stream.streamverse.com/series/codigo-cosmico/s1e1.m3u8', 50, 'https://img.streamverse.com/episodes/codigo-cosmico-s1e1.jpg'),
    ('f0000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000002', 1, 2, 'El Mensaje', 'El equipo logra decodificar parcialmente el mensaje extraterrestre.', 'https://stream.streamverse.com/series/codigo-cosmico/s1e2.m3u8', 47, 'https://img.streamverse.com/episodes/codigo-cosmico-s1e2.jpg'),
    ('f0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000002', 1, 3, 'Visitas No Deseadas', 'Agentes gubernamentales toman el control del observatorio.', 'https://stream.streamverse.com/series/codigo-cosmico/s1e3.m3u8', 52, 'https://img.streamverse.com/episodes/codigo-cosmico-s1e3.jpg'),
    ('f0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000002', 2, 1, 'Respuesta', 'Seis meses después, la humanidad recibe una segunda señal.', 'https://stream.streamverse.com/series/codigo-cosmico/s2e1.m3u8', 55, 'https://img.streamverse.com/episodes/codigo-cosmico-s2e1.jpg'),
    ('f0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000002', 2, 2, 'Hacia lo Desconocido', 'El equipo se embarca en la primera misión interestelar de la historia.', 'https://stream.streamverse.com/series/codigo-cosmico/s2e2.m3u8', 53, 'https://img.streamverse.com/episodes/codigo-cosmico-s2e2.jpg'),
    ('f0000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000002', 2, 3, 'Contacto', 'El momento decisivo: el encuentro con lo desconocido.', 'https://stream.streamverse.com/series/codigo-cosmico/s2e3.m3u8', 58, 'https://img.streamverse.com/episodes/codigo-cosmico-s2e3.jpg');

-- Nuevos Comienzos (4 episodios)
INSERT INTO episodes (id, "seriesId", season, episode, title, description, "videoUrl", duration, thumbnail) VALUES
    ('f0000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000003', 1, 1, 'Cruces de Destinos', 'Cinco desconocidos en la CDMX. Un accidente los une de la manera más inesperada.', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e1.m3u8', 45, 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e1.jpg'),
    ('f0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000003', 1, 2, 'Secretos y Mentiras', 'Cada personaje guarda un secreto que podría destruir su conexión.', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e2.m3u8', 48, 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e2.jpg'),
    ('f0000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000003', 1, 3, 'El Pasado Regresa', 'El pasado de cada uno regresa para perseguirlos.', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e3.m3u8', 44, 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e3.jpg'),
    ('f0000000-0000-0000-0000-000000000018', 'e0000000-0000-0000-0000-000000000003', 1, 4, 'Nuevos Horizontes', 'Los destinos se cruzan de nuevo en un final que lo cambiará todo.', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e4.m3u8', 50, 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e4.jpg');

-- Risa Asegurada (4 episodios)
INSERT INTO episodes (id, "seriesId", season, episode, title, description, "videoUrl", duration, thumbnail) VALUES
    ('f0000000-0000-0000-0000-000000000019', 'e0000000-0000-0000-0000-000000000004', 1, 1, 'El Peor Local del Mundo', 'Cinco comediantes desempleados alquilan el peor local posible para su club.', 'https://stream.streamverse.com/series/risa-asegurada/s1e1.m3u8', 35, 'https://img.streamverse.com/episodes/risa-asegurada-s1e1.jpg'),
    ('f0000000-0000-0000-0000-000000000020', 'e0000000-0000-0000-0000-000000000004', 1, 2, 'Noche de Prueba', 'La primera noche de shows es un completo desastre.', 'https://stream.streamverse.com/series/risa-asegurada/s1e2.m3u8', 32, 'https://img.streamverse.com/episodes/risa-asegurada-s1e2.jpg'),
    ('f0000000-0000-0000-0000-000000000021', 'e0000000-0000-0000-0000-000000000004', 1, 3, 'El Club Crece', 'El club gana popularidad, pero los problemas internos amenazan con destruirlo.', 'https://stream.streamverse.com/series/risa-asegurada/s1e3.m3u8', 33, 'https://img.streamverse.com/episodes/risa-asegurada-s1e3.jpg'),
    ('f0000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000004', 1, 4, 'El Gran Show', 'La noche más importante: la presentación ante los productores de televisión.', 'https://stream.streamverse.com/series/risa-asegurada/s1e4.m3u8', 36, 'https://img.streamverse.com/episodes/risa-asegurada-s1e4.jpg');

-- El Santuario (4 episodios)
INSERT INTO episodes (id, "seriesId", season, episode, title, description, "videoUrl", duration, thumbnail) VALUES
    ('f0000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000005', 1, 1, 'El Último Día', 'Tres años después del brote, un grupo recibe un mensaje: El Santuario existe.', 'https://stream.streamverse.com/series/santuario/s1e1.m3u8', 55, 'https://img.streamverse.com/episodes/santuario-s1e1.jpg'),
    ('f0000000-0000-0000-0000-000000000024', 'e0000000-0000-0000-0000-000000000005', 1, 2, 'El Camino', 'El grupo atraviesa territorios hostiles en busca del Santuario.', 'https://stream.streamverse.com/series/santuario/s1e2.m3u8', 52, 'https://img.streamverse.com/episodes/santuario-s1e2.jpg'),
    ('f0000000-0000-0000-0000-000000000025', 'e0000000-0000-0000-0000-000000000005', 1, 3, 'Peligro Constante', 'La traición sacude al grupo cuando descubren que el mensaje podría ser una trampa.', 'https://stream.streamverse.com/series/santuario/s1e3.m3u8', 48, 'https://img.streamverse.com/episodes/santuario-s1e3.jpg'),
    ('f0000000-0000-0000-0000-000000000026', 'e0000000-0000-0000-0000-000000000005', 1, 4, 'El Santuario', 'El grupo finalmente llega al Santuario. Nada es lo que esperaban.', 'https://stream.streamverse.com/series/santuario/s1e4.m3u8', 58, 'https://img.streamverse.com/episodes/santuario-s1e4.jpg');

-- ============================================
-- CHANNELS (6 canales latinoamericanos)
-- ============================================
INSERT INTO channels (id, name, logo, category, "streamUrl", country, status, "epgData") VALUES
    ('c0000000-0000-0000-0000-000000000001', 'HBO Latinoamérica', 'https://img.streamverse.com/channels/hbo-latam.png', 'Entretenimiento', 'https://stream.streamverse.com/channels/hbo-latam.m3u8', 'México', 'active', NULL),
    ('c0000000-0000-0000-0000-000000000002', 'ESPN Latinoamérica', 'https://img.streamverse.com/channels/espn-latam.png', 'Deportes', 'https://stream.streamverse.com/channels/espn-latam.m3u8', 'México', 'active', NULL),
    ('c0000000-0000-0000-0000-000000000003', 'Discovery Channel', 'https://img.streamverse.com/channels/discovery.png', 'Documentales', 'https://stream.streamverse.com/channels/discovery.m3u8', 'Estados Unidos', 'active', NULL),
    ('c0000000-0000-0000-0000-000000000004', 'Cartoon Network', 'https://img.streamverse.com/channels/cartoon-network.png', 'Infantil', 'https://stream.streamverse.com/channels/cartoon-network.m3u8', 'México', 'active', NULL),
    ('c0000000-0000-0000-0000-000000000005', 'CNN en Español', 'https://img.streamverse.com/channels/cnn-espanol.png', 'Noticias', 'https://stream.streamverse.com/channels/cnn-espanol.m3u8', 'Estados Unidos', 'active', NULL),
    ('c0000000-0000-0000-0000-000000000006', 'National Geographic', 'https://img.streamverse.com/channels/natgeo.png', 'Documentales', 'https://stream.streamverse.com/channels/natgeo.m3u8', 'Estados Unidos', 'active', NULL);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Seed v2 completado exitosamente!' AS resultado;
SELECT COUNT(*) || ' usuarios' AS total FROM users;
SELECT COUNT(*) || ' películas' AS total FROM movies;
SELECT COUNT(*) || ' series' AS total FROM series;
SELECT COUNT(*) || ' episodios' AS total FROM episodes;
SELECT COUNT(*) || ' canales' AS total FROM channels;
