-- StreamVerse OTT Platform - Seed Data
-- ============================================

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (id, name, email, password, role, avatar, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin StreamVerse', 'admin@streamverse.com', '$2b$10$placeholder_hashed_password_admin', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', true),
    ('a0000000-0000-0000-0000-000000000002', 'Editor StreamVerse', 'editor@streamverse.com', '$2b$10$placeholder_hashed_password_editor', 'editor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor', true),
    ('a0000000-0000-0000-0000-000000000003', 'Usuario Demo', 'user@streamverse.com', '$2b$10$placeholder_hashed_password_user', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user', true);

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, display_order, is_active) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Acción', 'accion', 'Películas y series llenas de adrenalina', 1, true),
    ('b0000000-0000-0000-0000-000000000002', 'Comedia', 'comedia', 'Contenido divertido para toda la familia', 2, true),
    ('b0000000-0000-0000-0000-000000000003', 'Drama', 'drama', 'Historias profundas y emocionantes', 3, true),
    ('b0000000-0000-0000-0000-000000000004', 'Ciencia Ficción', 'ciencia-ficcion', 'Viajes espaciales y futuros distópicos', 4, true),
    ('b0000000-0000-0000-0000-000000000005', 'Documental', 'documental', 'Contenido educativo y realista', 5, true),
    ('b0000000-0000-0000-0000-000000000006', 'Animación', 'animacion', 'Dibujos animados y anime', 6, true),
    ('b0000000-0000-0000-0000-000000000007', 'Terror', 'terror', 'Sustos y suspenso garantizados', 7, true),
    ('b0000000-0000-0000-0000-000000000008', 'Suspenso', 'suspenso', 'Misterio y thrillers psicológicos', 8, true),
    ('b0000000-0000-0000-0000-000000000009', 'Romance', 'romance', 'Historias de amor apasionantes', 9, true);

-- ============================================
-- CHANNELS (Latin America)
-- ============================================
INSERT INTO channels (id, name, logo, category, stream_url, dash_url, country, language, status, viewers_count) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'HBO Latinoamérica', 'https://img.streamverse.com/channels/hbo-latam.png', 'entertainment', 'https://stream.streamverse.com/hbo-latam/index.m3u8', 'https://stream.streamverse.com/hbo-latam/manifest.mpd', 'México', 'Español', 'active', 12540),
    ('c0000000-0000-0000-0000-000000000002', 'ESPN Latinoamérica', 'https://img.streamverse.com/channels/espn-latam.png', 'sports', 'https://stream.streamverse.com/espn-latam/index.m3u8', 'https://stream.streamverse.com/espn-latam/manifest.mpd', 'México', 'Español', 'active', 23400),
    ('c0000000-0000-0000-0000-000000000003', 'Discovery Channel', 'https://img.streamverse.com/channels/discovery.png', 'documentary', 'https://stream.streamverse.com/discovery/index.m3u8', 'https://stream.streamverse.com/discovery/manifest.mpd', 'Estados Unidos', 'Español', 'active', 8900),
    ('c0000000-0000-0000-0000-000000000004', 'Cartoon Network', 'https://img.streamverse.com/channels/cartoon-network.png', 'kids', 'https://stream.streamverse.com/cartoon-network/index.m3u8', 'https://stream.streamverse.com/cartoon-network/manifest.mpd', 'México', 'Español', 'active', 15600),
    ('c0000000-0000-0000-0000-000000000005', 'History Channel', 'https://img.streamverse.com/channels/history.png', 'documentary', 'https://stream.streamverse.com/history/index.m3u8', 'https://stream.streamverse.com/history/manifest.mpd', 'Estados Unidos', 'Español', 'active', 7200),
    ('c0000000-0000-0000-0000-000000000006', 'National Geographic', 'https://img.streamverse.com/channels/natgeo.png', 'documentary', 'https://stream.streamverse.com/natgeo/index.m3u8', 'https://stream.streamverse.com/natgeo/manifest.mpd', 'Estados Unidos', 'Español', 'active', 9800),
    ('c0000000-0000-0000-0000-000000000007', 'Fox Channel', 'https://img.streamverse.com/channels/fox.png', 'entertainment', 'https://stream.streamverse.com/fox/index.m3u8', 'https://stream.streamverse.com/fox/manifest.mpd', 'México', 'Español', 'active', 11200),
    ('c0000000-0000-0000-0000-000000000008', 'MTV Latinoamérica', 'https://img.streamverse.com/channels/mtv-latam.png', 'music', 'https://stream.streamverse.com/mtv-latam/index.m3u8', 'https://stream.streamverse.com/mtv-latam/manifest.mpd', 'México', 'Español', 'active', 8900),
    ('c0000000-0000-0000-0000-000000000009', 'CNN en Español', 'https://img.streamverse.com/channels/cnn-espanol.png', 'news', 'https://stream.streamverse.com/cnn-espanol/index.m3u8', 'https://stream.streamverse.com/cnn-espanol/manifest.mpd', 'Estados Unidos', 'Español', 'active', 14500),
    ('c0000000-0000-0000-0000-000000000010', 'Disney Channel', 'https://img.streamverse.com/channels/disney.png', 'kids', 'https://stream.streamverse.com/disney/index.m3u8', 'https://stream.streamverse.com/disney/manifest.mpd', 'México', 'Español', 'active', 17800),
    ('c0000000-0000-0000-0000-000000000011', 'TNT Latinoamérica', 'https://img.streamverse.com/channels/tnt-latam.png', 'movies', 'https://stream.streamverse.com/tnt-latam/index.m3u8', 'https://stream.streamverse.com/tnt-latam/manifest.mpd', 'Argentina', 'Español', 'active', 10300),
    ('c0000000-0000-0000-0000-000000000012', 'Animal Planet', 'https://img.streamverse.com/channels/animal-planet.png', 'education', 'https://stream.streamverse.com/animal-planet/index.m3u8', 'https://stream.streamverse.com/animal-planet/manifest.mpd', 'Estados Unidos', 'Español', 'active', 6700),
    ('c0000000-0000-0000-0000-000000000013', 'Nickelodeon', 'https://img.streamverse.com/channels/nickelodeon.png', 'kids', 'https://stream.streamverse.com/nickelodeon/index.m3u8', 'https://stream.streamverse.com/nickelodeon/manifest.mpd', 'México', 'Español', 'active', 13400),
    ('c0000000-0000-0000-0000-000000000014', 'Space', 'https://img.streamverse.com/channels/space.png', 'entertainment', 'https://stream.streamverse.com/space/index.m3u8', 'https://stream.streamverse.com/space/manifest.mpd', 'México', 'Español', 'active', 5600),
    ('c0000000-0000-0000-0000-000000000015', 'Star Channel', 'https://img.streamverse.com/channels/star-channel.png', 'entertainment', 'https://stream.streamverse.com/star-channel/index.m3u8', 'https://stream.streamverse.com/star-channel/manifest.mpd', 'México', 'Español', 'active', 9100),
    ('c0000000-0000-0000-0000-000000000016', 'Televisa Deportes', 'https://img.streamverse.com/channels/televisa-deportes.png', 'sports', 'https://stream.streamverse.com/televisa-deportes/index.m3u8', 'https://stream.streamverse.com/televisa-deportes/manifest.mpd', 'México', 'Español', 'active', 20100),
    ('c0000000-0000-0000-0000-000000000017', 'TyC Sports', 'https://img.streamverse.com/channels/tyc-sports.png', 'sports', 'https://stream.streamverse.com/tyc-sports/index.m3u8', 'https://stream.streamverse.com/tyc-sports/manifest.mpd', 'Argentina', 'Español', 'active', 11800),
    ('c0000000-0000-0000-0000-000000000018', 'Discovery Kids', 'https://img.streamverse.com/channels/discovery-kids.png', 'kids', 'https://stream.streamverse.com/discovery-kids/index.m3u8', 'https://stream.streamverse.com/discovery-kids/manifest.mpd', 'México', 'Español', 'active', 14200);

-- ============================================
-- MOVIES
-- ============================================
INSERT INTO movies (id, title, description, synopsis, poster, backdrop, category, genres, tags, duration, release_date, rating, maturity_rating, director, cast_members, status, is_featured, views_count) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'El Último Guerrero', 'Un guerrero solitario debe defender su reino de las fuerzas oscuras que amenazan con destruirlo todo.', 'En un reino medieval asolado por la guerra, un guerrero solitario descubre que posee un poder ancestral que podría inclinar la balanza. Con la ayuda de una misteriosa hechicera, deberá enfrentar al señor oscuro y salvar su tierra.', 'https://img.streamverse.com/movies/ultimo-guerrero-poster.jpg', 'https://img.streamverse.com/movies/ultimo-guerrero-backdrop.jpg', 'Acción', ARRAY['Acción', 'Aventura', 'Fantasía'], ARRAY['guerrero', 'reino', 'batalla épica'], 148, '2024-03-15', 8.2, 'PG-13', 'Carlos Márquez', ARRAY['Juan Pérez', 'María García', 'Roberto Sánchez'], 'active', true, 45200),
    ('d0000000-0000-0000-0000-000000000002', 'Risas en Marte', 'Un grupo de astronautas torpes intenta colonizar Marte con resultados hilarantes.', 'Cuando la NASA selecciona al peor equipo de astronautas para la primera misión tripulada a Marte, el caos está garantizado. Entre fallos técnicos y situaciones absurdas, este grupo de inútiles podría salvar la humanidad sin quererlo.', 'https://img.streamverse.com/movies/risas-marte-poster.jpg', 'https://img.streamverse.com/movies/risas-marte-backdrop.jpg', 'Comedia', ARRAY['Comedia', 'Ciencia Ficción'], ARRAY['comedia espacial', 'astronautas', 'Marte'], 112, '2024-05-20', 7.5, 'PG-13', 'Ana López', ARRAY['Pedro Infante', 'Lucía Méndez', 'Jorge Ramos'], 'active', true, 38100),
    ('d0000000-0000-0000-0000-000000000003', 'El Silencio del Bosque', 'Un detective investiga desapariciones en un bosque donde nada es lo que parece.', 'El detective Vargas llega a un pequeño pueblo donde varias personas han desaparecido en el bosque cercano. Pronto descubre que el bosque guarda secretos que la gente del pueblo prefiere mantener enterrados. Cada paso lo acerca más a una verdad aterradora.', 'https://img.streamverse.com/movies/silencio-bosque-poster.jpg', 'https://img.streamverse.com/movies/silencio-bosque-backdrop.jpg', 'Suspenso', ARRAY['Suspenso', 'Misterio', 'Drama'], ARRAY['detective', 'bosque', 'desapariciones'], 135, '2024-01-10', 8.7, 'PG-13', 'Fernando Torres', ARRAY['Ricardo Montalvo', 'Elena Vega', 'Luis Domínguez'], 'active', true, 52300),
    ('d0000000-0000-0000-0000-000000000004', 'Corazones Eléctricos', 'Dos robots se enamoran en un mundo post-apocalíptico donde los humanos ya no existen.', 'En un mundo donde la humanidad desapareció hace siglos, dos robots inteligentes desarrollan sentimientos el uno por el otro. Su amor prohibido desafía las leyes de su programación y los lleva a cuestionar su propia existencia.', 'https://img.streamverse.com/movies/corazones-electricos-poster.jpg', 'https://img.streamverse.com/movies/corazones-electricos-backdrop.jpg', 'Romance', ARRAY['Romance', 'Ciencia Ficción', 'Drama'], ARRAY['robots', 'amor postapocalíptico', 'futuro'], 126, '2024-02-14', 8.0, 'PG-13', 'Sofía Reyes', ARRAY['Voz de: Andrés Hernández', 'Voz de: Catalina Ruiz'], 'active', true, 29800),
    ('d0000000-0000-0000-0000-000000000005', 'La Noche del Demonio', 'Una familia se muda a una casa antigua donde habita una presencia demoníaca.', 'La familia Martínez se muda a una hermosa casa victoriana sin saber que está maldita. Cuando su hija menor comienza a comportarse de manera extraña, deberán enfrentarse al demonio que lleva siglos atormentando el lugar.', 'https://img.streamverse.com/movies/noche-demonio-poster.jpg', 'https://img.streamverse.com/movies/noche-demonio-backdrop.jpg', 'Terror', ARRAY['Terror', 'Suspenso'], ARRAY['casa embrujada', 'demonio', 'terror sobrenatural'], 108, '2024-10-15', 7.8, 'R', 'Gabriela Ríos', ARRAY['Mónica Flores', 'Alberto Gómez', 'Niña: Sofía Vargas'], 'active', false, 41500),
    ('d0000000-0000-0000-0000-000000000006', 'El Último Refugio', 'En un mundo devastado, un padre busca un lugar seguro para su hija.', 'Tras una catástrofe global, un padre y su hija pequeña recorren un páramo desolado en busca del legendario Último Refugio, un lugar donde la vida aún es posible. En el camino enfrentarán peligros que pondrán a prueba su amor y su voluntad de sobrevivir.', 'https://img.streamverse.com/movies/ultimo-refugio-poster.jpg', 'https://img.streamverse.com/movies/ultimo-refugio-backdrop.jpg', 'Drama', ARRAY['Drama', 'Ciencia Ficción', 'Aventura'], ARRAY['supervivencia', 'padre e hija', 'apocalipsis'], 142, '2024-06-01', 8.9, 'PG-13', 'Héctor Morales', ARRAY['Daniel Fuentes', 'Valentina Cruz'], 'active', true, 61200),
    ('d0000000-0000-0000-0000-000000000007', 'Planeta Prohibido', 'Una expedición científica llega a un planeta donde las leyes de la física no aplican.', 'Cuando una nave espacial aterriza en un planeta desconocido, los científicos descubren que aquí la gravedad, el tiempo y la realidad misma funcionan de manera diferente. Pronto se dan cuenta de que no están solos y que el planeta tiene su propia conciencia.', 'https://img.streamverse.com/movies/planeta-prohibido-poster.jpg', 'https://img.streamverse.com/movies/planeta-prohibido-backdrop.jpg', 'Ciencia Ficción', ARRAY['Ciencia Ficción', 'Aventura', 'Misterio'], ARRAY['planeta alienígena', 'expedición', 'ciencia ficción'], 155, '2024-07-20', 8.4, 'PG-13', 'Diego Castillo', ARRAY['Camila Andrade', 'Esteban Rivas', 'Patricia Núñez'], 'active', false, 35700),
    ('d0000000-0000-0000-0000-000000000008', 'La Familia Pérez', 'Las aventuras de una familia mexicana disfuncional pero unida.', 'Los Pérez son una familia como cualquier otra: la mamá que todo controla, el papá que todo olvida, los hijos adolescentes rebeldes y la abuela que dice lo que piensa. Cuando el abuelo desaparece misteriosamente, deberán unirse para encontrarlo.', 'https://img.streamverse.com/movies/familia-perez-poster.jpg', 'https://img.streamverse.com/movies/familia-perez-backdrop.jpg', 'Comedia', ARRAY['Comedia', 'Familiar'], ARRAY['familia', 'comedia', 'mexicana'], 98, '2024-04-25', 7.2, 'PG', 'María del Carmen Vega', ARRAY['Adriana Uribe', 'José Luis Martínez', 'Carmen Salinas'], 'active', true, 28400),
    ('d0000000-0000-0000-0000-000000000009', 'Mentes Brillantes', 'Un grupo de estudiantes de matemáticas descubre un código que puede cambiar el mundo.', 'En la prestigiosa Universidad Nacional, un grupo de estudiantes de matemáticas encuentra un patrón numérico oculto en los mercados financieros globales. Lo que comienza como un juego intelectual se convierte en una carrera contra el tiempo cuando descubren que gobiernos poderosos harán lo imposible por silenciarlos.', 'https://img.streamverse.com/movies/mentes-brillantes-poster.jpg', 'https://img.streamverse.com/movies/mentes-brillantes-backdrop.jpg', 'Suspenso', ARRAY['Suspenso', 'Drama', 'Thriller'], ARRAY['matemáticas', 'código', 'conspiración'], 132, '2024-08-10', 8.1, 'PG-13', 'Alejandro Pinto', ARRAY['Mateo García', 'Daniela Quintero', 'Santiago Páez'], 'active', false, 22100),
    ('d0000000-0000-0000-0000-000000000010', 'El Gran Viaje de Lila', 'Una niña y su perro mágico exploran un mundo fantástico lleno de criaturas asombrosas.', 'Lila descubre que su perro, Copito, puede hablar y llevarla a un mundo mágico escondido detrás de un viejo roble en el jardín de su abuela. Juntos emprenderán un viaje para salvar a las criaturas mágicas de la oscuridad que amenaza con consumir su mundo.', 'https://img.streamverse.com/movies/gran-viaje-lila-poster.jpg', 'https://img.streamverse.com/movies/gran-viaje-lila-backdrop.jpg', 'Animación', ARRAY['Animación', 'Aventura', 'Fantasía'], ARRAY['animación', 'mundo mágico', 'infantil'], 95, '2024-03-30', 8.5, 'PG', 'Andrea Jiménez', ARRAY['Voz de: Renata Flores', 'Voz de: Germán Bravo'], 'active', true, 48600),
    ('d0000000-0000-0000-0000-000000000011', 'Operación Rescate', 'Un agente secreto deberá infiltrarse en la fortaleza más custodiada del mundo.', 'El agente Sebastián Cruz es el mejor en lo que hace. Cuando la hija del presidente es secuestrada y llevada a una fortaleza inexpugnable en los Andes, deberá reunir a su antiguo equipo para ejecutar el rescate más audaz de la historia.', 'https://img.streamverse.com/movies/operacion-rescate-poster.jpg', 'https://img.streamverse.com/movies/operacion-rescate-backdrop.jpg', 'Acción', ARRAY['Acción', 'Aventura', 'Suspenso'], ARRAY['agente secreto', 'rescate', 'acción trepidante'], 140, '2024-09-05', 7.9, 'PG-13', 'Roberto Ávalos', ARRAY['Mauricio Herrera', 'Ximena Delgado', 'Óscar Fuentes'], 'active', false, 33400),
    ('d0000000-0000-0000-0000-000000000012', 'Secretos del Amazonas', 'Un documental que explora las maravillas ocultas de la selva amazónica.', 'Acompaña a un equipo de biólogos y exploradores en su viaje por las profundidades del Amazonas. Descubrirán especies nunca antes vistas, comunidades indígenas aisladas y los secretos que la selva más grande del mundo guarda celosamente.', 'https://img.streamverse.com/movies/secretos-amazonas-poster.jpg', 'https://img.streamverse.com/movies/secretos-amazonas-backdrop.jpg', 'Documental', ARRAY['Documental', 'Naturaleza'], ARRAY['amazonas', 'naturaleza', 'exploración'], 118, '2024-04-22', 9.0, 'PG', 'Diana Ordóñez', ARRAY['Narrado por: Ricardo Montaner'], 'active', false, 19700),
    ('d0000000-0000-0000-0000-000000000013', 'Bailando con el Corazón', 'Dos bailarines de salsa compiten por el campeonato mundial mientras se enamoran.', 'Elena y Marcos son rivales en la pista de baile. Ambos sueñan con ganar el Campeonato Mundial de Salsa. Cuando el destino los une como pareja de baile, deberán aprender a confiar el uno en el otro mientras sus sentimientos se intensifican.', 'https://img.streamverse.com/movies/bailando-corazon-poster.jpg', 'https://img.streamverse.com/movies/bailando-corazon-backdrop.jpg', 'Romance', ARRAY['Romance', 'Música', 'Drama'], ARRAY['salsa', 'baile', 'amor y baile'], 120, '2024-02-01', 7.6, 'PG', 'Carla Espinoza', ARRAY['Daniella Navarro', 'Alejandro Rangel', 'Lucía Torres'], 'active', true, 36500),
    ('d0000000-0000-0000-0000-000000000014', 'El Código del Apocalipsis', 'Un científico descifra un código antiguo que predice el fin del mundo.', 'El Dr. Arturo Sandoval, un renombrado criptógrafo, descubre que un código antiguo encontrado en las pirámides de Teotihuacán contiene una cuenta regresiva. Con solo días antes de la fecha señalada, deberá convencer a las autoridades y encontrar la manera de evitar la catástrofe.', 'https://img.streamverse.com/movies/codigo-apocalipsis-poster.jpg', 'https://img.streamverse.com/movies/codigo-apocalipsis-backdrop.jpg', 'Ciencia Ficción', ARRAY['Ciencia Ficción', 'Suspenso', 'Drama'], ARRAY['apocalipsis', 'código', 'científico'], 138, '2024-11-10', 7.7, 'PG-13', 'Raúl Mendoza', ARRAY['Fabián Vargas', 'Martha Rivas', 'Hugo Silva'], 'active', false, 28900),
    ('d0000000-0000-0000-0000-000000000015', 'La Invitación', 'Una cena elegante se convierte en una pesadilla cuando los invitados comienzan a desaparecer.', 'Ocho personas son invitadas a una cena exclusiva en una mansión remota. Cuando el anfitrión anuncia que todos ellos están condenados a morir, comienza un juego mortal donde la confianza no existe y solo uno podrá sobrevivir.', 'https://img.streamverse.com/movies/invitacion-poster.jpg', 'https://img.streamverse.com/movies/invitacion-backdrop.jpg', 'Terror', ARRAY['Terror', 'Suspenso', 'Misterio'], ARRAY['cena mortal', 'supervivencia', 'terror psicológico'], 105, '2024-10-31', 8.3, 'R', 'Liliana Montes', ARRAY['Pablo Montero', 'Adriana Campos', 'Fernando Luján', 'Rocío García'], 'active', false, 37900),
    ('d0000000-0000-0000-0000-000000000016', 'Sueños de Gloria', 'La historia real del futbolista que superó todas las adversidades para llegar a la cima.', 'Basada en hechos reales, la historia de Miguel Ángel Rivas, un niño de un barrio humilde que sueña con ser futbolista profesional. Contra todo pronóstico y superando innumerables obstáculos, su talento y perseverancia lo llevarán a jugar en los estadios más grandes del mundo.', 'https://img.streamverse.com/movies/suenos-gloria-poster.jpg', 'https://img.streamverse.com/movies/suenos-gloria-backdrop.jpg', 'Drama', ARRAY['Drama', 'Deportes', 'Biografía'], ARRAY['fútbol', 'superación', 'biografía'], 152, '2024-06-15', 8.6, 'PG-13', 'Jorge Castillo', ARRAY['Emilio Valenzuela', 'Carolina Meza', 'Julián Torres'], 'active', true, 55300),
    ('d0000000-0000-0000-0000-000000000017', 'El Viajero del Tiempo', 'Un hombre común encuentra un reloj que le permite viajar al pasado.', 'Cuando Javier encuentra un reloj antiguo en una tienda de antigüedades, descubre que puede viajar en el tiempo. Lo que parece un sueño se convierte en una responsabilidad cuando sus alteraciones en el pasado comienzan a tener consecuencias catastróficas en el presente.', 'https://img.streamverse.com/movies/viajero-tiempo-poster.jpg', 'https://img.streamverse.com/movies/viajero-tiempo-backdrop.jpg', 'Ciencia Ficción', ARRAY['Ciencia Ficción', 'Aventura', 'Drama'], ARRAY['viaje en el tiempo', 'reloj', 'paradojas temporales'], 130, '2024-12-25', 8.0, 'PG-13', 'Sergio Aguirre', ARRAY['Luis Miguel Pérez', 'Andrea Silva', 'Raúl Costa'], 'active', false, 31200),
    ('d0000000-0000-0000-0000-000000000018', 'La Reina del Barrio', 'Una humilde vendedora ambulante se convierte en la empresaria más poderosa del país.', 'María Esperanza comienza vendiendo empanadas en la esquina de su barrio. Con determinación y un talento innato para los negocios, construye un imperio gastronómico. Pero el éxito tiene un precio, y deberá decidir qué está dispuesta a sacrificar.', 'https://img.streamverse.com/movies/reina-barrio-poster.jpg', 'https://img.streamverse.com/movies/reina-barrio-backdrop.jpg', 'Drama', ARRAY['Drama', 'Comedia'], ARRAY['emprendimiento', 'superación femenina', 'gastronomía'], 125, '2024-08-20', 7.8, 'PG-13', 'Patricia Álvarez', ARRAY['Yalitza Aparicio', 'Diego Boneta', 'Kate del Castillo'], 'active', false, 26800),
    ('d0000000-0000-0000-0000-000000000019', 'Sombras en la Ciudad', 'Un justiciero enmascarado limpia las calles de una ciudad corrupta.', 'En una ciudad dominada por el crimen y la corrupción, un misterioso justiciero emerge de las sombras. Con un pasado trágico y un código moral inquebrantable, 'El Fantasma' se convierte en la esperanza de los oprimidos y la pesadilla de los criminales.', 'https://img.streamverse.com/movies/sombras-ciudad-poster.jpg', 'https://img.streamverse.com/movies/sombras-ciudad-backdrop.jpg', 'Acción', ARRAY['Acción', 'Drama', 'Crimen'], ARRAY['justiciero', 'ciudad', 'venganza'], 145, '2024-07-04', 8.2, 'PG-13', 'Esteban Navarro', ARRAY['Gael García', 'Demián Bichir', 'Salma Hayek'], 'active', false, 42100),
    ('d0000000-0000-0000-0000-000000000020', 'El Jardín Secreto', 'Una niña huérfana descubre un jardín mágico que cambia su vida para siempre.', 'Después de perder a sus padres, la pequeña Alba se muda a la mansión de su excéntrico tío. Allí descubre un jardín secreto escondido detrás de un muro de piedra. Con la ayuda de un nuevo amigo, restaurará el jardín y encontrará la magia que sana todas las heridas.', 'https://img.streamverse.com/movies/jardin-secreto-poster.jpg', 'https://img.streamverse.com/movies/jardin-secreto-backdrop.jpg', 'Drama', ARRAY['Drama', 'Familiar', 'Fantasía'], ARRAY['jardín mágico', 'familia', 'superación'], 110, '2024-12-10', 8.4, 'PG', 'Mónica Villalobos', ARRAY['Aitana Sánchez-Gijón', 'Niño: Mateo López'], 'active', false, 24500);

-- ============================================
-- SERIES
-- ============================================
INSERT INTO series (id, title, description, synopsis, poster, backdrop, category, genres, tags, release_date, rating, maturity_rating, status, is_featured, views_count) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Frontera Sur', 'Un agente de la DEA se infiltra en un cártel mexicano mientras lidia con su propia identidad.', 'El agente encubierto Andrés Herrera se infiltra en el temido Cártel del Pacífico. Cuanto más asciende en la organización, más se difumina la línea entre quien finge ser y quien realmente es. En un mundo donde la traición está a la orden del día, descubrir la verdad puede costarle la vida.', 'https://img.streamverse.com/series/frontera-sur-poster.jpg', 'https://img.streamverse.com/series/frontera-sur-backdrop.jpg', 'Drama', ARRAY['Drama', 'Crimen', 'Suspenso'], ARRAY['narcotráfico', 'DEA', 'infiltrado'], '2024-01-15', 8.7, 'TV-MA', 'active', true, 89200),
    ('e0000000-0000-0000-0000-000000000002', 'Código Cósmico', 'Un equipo de científicos descubre una señal extraterrestre que cambiará la humanidad.', 'En el observatorio astronómico de Atacama, un equipo internacional de científicos detecta una señal proveniente de un sistema solar cercano. Mientras intentan descifrar el mensaje, gobiernos y corporaciones harán todo lo posible por controlar esta información que podría redefinir el lugar de la humanidad en el universo.', 'https://img.streamverse.com/series/codigo-cosmico-poster.jpg', 'https://img.streamverse.com/series/codigo-cosmico-backdrop.jpg', 'Ciencia Ficción', ARRAY['Ciencia Ficción', 'Drama', 'Misterio'], ARRAY['extraterrestres', 'observatorio', 'primer contacto'], '2024-03-08', 8.5, 'TV-14', 'active', true, 76500),
    ('e0000000-0000-0000-0000-000000000003', 'Nuevos Comienzos', 'Las vidas de cinco personas se entrelazan en la Ciudad de México.', 'Cinco desconocidos en la Ciudad de México descubren que sus vidas están conectadas de maneras que nunca imaginaron. Entre el amor, la pérdida y la esperanza, esta serie explora las complejas relaciones humanas en una de las ciudades más vibrantes del mundo.', 'https://img.streamverse.com/series/nuevos-comienzos-poster.jpg', 'https://img.streamverse.com/series/nuevos-comienzos-backdrop.jpg', 'Drama', ARRAY['Drama', 'Romance'], ARRAY['CDMX', 'vidas cruzadas', 'drama romántico'], '2024-02-20', 7.9, 'TV-14', 'active', true, 63400),
    ('e0000000-0000-0000-0000-000000000004', 'Risa Asegurada', 'Un grupo de comediantes fracasados abre un club de comedia en el peor barrio de la ciudad.', 'Después de ser despedidos del teatro más prestigioso de la ciudad, cinco cómicos deciden abrir su propio club de comedia en un barrio peligroso. Entre clientes hostiles, shows desastrosos y sus propios demonios internos, intentarán demostrar que el humor puede surgir en los lugares más oscuros.', 'https://img.streamverse.com/series/risa-asegurada-poster.jpg', 'https://img.streamverse.com/series/risa-asegurada-backdrop.jpg', 'Comedia', ARRAY['Comedia', 'Drama'], ARRAY['comedia', 'club', 'comediantes'], '2024-04-01', 8.1, 'TV-14', 'active', false, 52100),
    ('e0000000-0000-0000-0000-000000000005', 'El Santuario', 'Los sobrevivientes de un apocalipsis zombie buscan un lugar seguro.', 'Tres años después del brote que acabó con la civilización, un grupo de sobrevivientes viaja por Latinoamérica en busca de El Santuario, una fortaleza donde se dice que la vida ha vuelto a la normalidad. Pero en el camino enfrentarán amenazas tanto de infectados como de otros humanos.', 'https://img.streamverse.com/series/santuario-poster.jpg', 'https://img.streamverse.com/series/santuario-backdrop.jpg', 'Terror', ARRAY['Terror', 'Drama', 'Acción'], ARRAY['zombies', 'apocalipsis', 'supervivencia'], '2024-10-01', 8.3, 'TV-MA', 'active', false, 94800);

-- ============================================
-- EPISODES
-- ============================================
-- Frontera Sur (8 episodes, 2 seasons)
INSERT INTO episodes (id, series_id, season, episode_number, title, description, thumbnail, video_url, duration, air_date, views_count) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, 1, 'El Infiltrado', 'Andrés Herrera recibe su primera misión encubierta: infiltrarse en el Cártel del Pacífico. Saber que un solo error puede costarle la vida.', 'https://img.streamverse.com/episodes/frontera-sur-s1e1.jpg', 'https://stream.streamverse.com/series/frontera-sur/s1e1.m3u8', 52, '2024-01-15', 45200),
    ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 1, 2, 'La Prueba de Sangre', 'Para ganar la confianza del cártel, Andrés debe superar una peligrosa prueba. Mientras tanto, la DEA presiona por resultados.', 'https://img.streamverse.com/episodes/frontera-sur-s1e2.jpg', 'https://stream.streamverse.com/series/frontera-sur/s1e2.m3u8', 48, '2024-01-22', 38900),
    ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 1, 3, 'Lealtades Divididas', 'Andrés comienza a cuestionar su lealtad cuando conoce el lado humano del cártel. Su identidad como agente comienza a desdibujarse.', 'https://img.streamverse.com/episodes/frontera-sur-s1e3.jpg', 'https://stream.streamverse.com/series/frontera-sur/s1e3.m3u8', 50, '2024-01-29', 35600),
    ('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 1, 4, 'Traición', 'Un informante anónimo amenaza con exponer a Andrés. Deberá descubrir quién es antes de que su tapadera se destruya por completo.', 'https://img.streamverse.com/episodes/frontera-sur-s1e4.jpg', 'https://stream.streamverse.com/series/frontera-sur/s1e4.m3u8', 46, '2024-02-05', 33400),
    ('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 2, 1, 'Nuevo Comienzo', 'Un año después, Andrés ha ascendido en la organización. Pero el pasado regresa para atormentarlo cuando la DEA le exige una operación final.', 'https://img.streamverse.com/episodes/frontera-sur-s2e1.jpg', 'https://stream.streamverse.com/series/frontera-sur/s2e1.m3u8', 54, '2024-09-10', 41200),
    ('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', 2, 2, 'El Precio del Poder', 'Andrés descubre que el cártel planea un golpe masivo. Debe decidir si sigue siendo fiel a la DEA o protege a las personas que ahora considera su familia.', 'https://img.streamverse.com/episodes/frontera-sur-s2e2.jpg', 'https://stream.streamverse.com/series/frontera-sur/s2e2.m3u8', 51, '2024-09-17', 37800),
    ('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000001', 2, 3, 'Sin Salida', 'La situación se vuelve insostenible. Andrés queda atrapado entre dos fuegos y deberá tomar la decisión más difícil de su vida.', 'https://img.streamverse.com/episodes/frontera-sur-s2e3.jpg', 'https://stream.streamverse.com/series/frontera-sur/s2e3.m3u8', 49, '2024-09-24', 34500),
    ('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000001', 2, 4, 'El Final del Camino', 'El desenlace de la historia de Andrés Herrera. Lealtades, traiciones y sacrificios definen el destino de todos.', 'https://img.streamverse.com/episodes/frontera-sur-s2e4.jpg', 'https://stream.streamverse.com/series/frontera-sur/s2e4.m3u8', 56, '2024-10-01', 40100),

-- Código Cósmico (8 episodes, 2 seasons)
    ('f0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000002', 1, 1, 'La Señal', 'En el observatorio de Atacama, la Dra. Elena Rivas detecta una señal que no es de este mundo. El descubrimiento pondrá en marcha eventos que cambiarán la humanidad.', 'https://img.streamverse.com/episodes/codigo-cosmico-s1e1.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s1e1.m3u8', 50, '2024-03-08', 42100),
    ('f0000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000002', 1, 2, 'El Mensaje', 'El equipo logra decodificar parcialmente el mensaje. Contiene información científica que desafía todo lo que conocemos.', 'https://img.streamverse.com/episodes/codigo-cosmico-s1e2.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s1e2.m3u8', 47, '2024-03-15', 36800),
    ('f0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000002', 1, 3, 'Visitas No Deseadas', 'La noticia llega a oídos equivocados. Agentes gubernamentales toman el control del observatorio y el equipo queda atrapado.', 'https://img.streamverse.com/episodes/codigo-cosmico-s1e3.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s1e3.m3u8', 52, '2024-03-22', 34500),
    ('f0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000002', 1, 4, 'Contrarreloj', 'El equipo descubre que la señal tiene un temporizador. Deben completar el contacto antes de que sea demasiado tarde.', 'https://img.streamverse.com/episodes/codigo-cosmico-s1e4.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s1e4.m3u8', 48, '2024-03-29', 32100),
    ('f0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000002', 2, 1, 'Respuesta', 'Seis meses después, la humanidad recibe una segunda señal. Elena debe reunir al equipo para una misión que los llevará al espacio.', 'https://img.streamverse.com/episodes/codigo-cosmico-s2e1.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s2e1.m3u8', 55, '2024-10-15', 38900),
    ('f0000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000002', 2, 2, 'Hacia lo Desconocido', 'El equipo internacional se embarca en la primera misión interestelar de la historia. Los peligros del espacio profundo los esperan.', 'https://img.streamverse.com/episodes/codigo-cosmico-s2e2.jpg', 'https://stream.streamverse.com/series/codigo-cosmico/s2e2.m3u8', 53, '2024-10-22', 35600),

-- Nuevos Comienzos (6 episodes, 1 season)
    ('f0000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000003', 1, 1, 'Cruces de Destinos', 'Cinco desconocidos en la CDMX. Un accidente automovilístico los une de la manera más inesperada.', 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e1.jpg', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e1.m3u8', 45, '2024-02-20', 31200),
    ('f0000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000003', 1, 2, 'Secretos y Mentiras', 'Cada personaje guarda un secreto que podría destruir la frágil conexión que han construido.', 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e2.jpg', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e2.m3u8', 48, '2024-02-27', 28700),
    ('f0000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000003', 1, 3, 'El Pasado Regresa', 'El pasado de cada uno regresa para perseguirlos. Las decisiones que tomaron hace años los alcanzan en el presente.', 'https://img.streamverse.com/episodes/nuevos-comienzos-s1e3.jpg', 'https://stream.streamverse.com/series/nuevos-comienzos/s1e3.m3u8', 44, '2024-03-05', 26500),

-- Risa Asegurada (6 episodes, 1 season)
    ('f0000000-0000-0000-0000-000000000018', 'e0000000-0000-0000-0000-000000000004', 1, 1, 'El Peor Local del Mundo', 'Cinco comediantes desempleados alquilan el peor local posible para abrir su club de comedia. El desastre está garantizado.', 'https://img.streamverse.com/episodes/risa-asegurada-s1e1.jpg', 'https://stream.streamverse.com/series/risa-asegurada/s1e1.m3u8', 35, '2024-04-01', 28900),
    ('f0000000-0000-0000-0000-000000000019', 'e0000000-0000-0000-0000-000000000004', 1, 2, 'Noche de Prueba', 'La primera noche de shows es un completo desastre. Pero entre el público hay un crítico famoso que podría cambiar su suerte.', 'https://img.streamverse.com/episodes/risa-asegurada-s1e2.jpg', 'https://stream.streamverse.com/series/risa-asegurada/s1e2.m3u8', 32, '2024-04-08', 25600),
    ('f0000000-0000-0000-0000-000000000020', 'e0000000-0000-0000-0000-000000000004', 1, 3, 'El Club Crece', 'El club comienza a ganar popularidad, pero los problemas internos del grupo amenazan con destruir todo lo que han construido.', 'https://img.streamverse.com/episodes/risa-asegurada-s1e3.jpg', 'https://stream.streamverse.com/series/risa-asegurada/s1e3.m3u8', 33, '2024-04-15', 23400),
    ('f0000000-0000-0000-0000-000000000021', 'e0000000-0000-0000-0000-000000000004', 1, 4, 'El Gran Show', 'Llega la noche más importante: la presentación ante los productores de televisión. Todo puede salir mal, y probablemente saldrá.', 'https://img.streamverse.com/episodes/risa-asegurada-s1e4.jpg', 'https://stream.streamverse.com/series/risa-asegurada/s1e4.m3u8', 36, '2024-04-22', 31200),

-- El Santuario (4 episodes, 1 season)
    ('f0000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000005', 1, 1, 'El Último Día', 'Tres años después del brote, un grupo de sobrevivientes recibe un mensaje de radio: El Santuario existe. Comienza el viaje.', 'https://img.streamverse.com/episodes/santuario-s1e1.jpg', 'https://stream.streamverse.com/series/santuario/s1e1.m3u8', 55, '2024-10-01', 52300),
    ('f0000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000005', 1, 2, 'El Camino', 'El grupo atraviesa territorios hostiles. Encuentran otros sobrevivientes, algunos amigos, otros enemigos.', 'https://img.streamverse.com/episodes/santuario-s1e2.jpg', 'https://stream.streamverse.com/series/santuario/s1e2.m3u8', 52, '2024-10-08', 48700),
    ('f0000000-0000-0000-0000-000000000024', 'e0000000-0000-0000-0000-000000000005', 1, 3, 'Peligro Constante', 'La traición sacude al grupo cuando descubren que el mensaje de radio podría ser una trampa.', 'https://img.streamverse.com/episodes/santuario-s1e3.jpg', 'https://stream.streamverse.com/series/santuario/s1e3.m3u8', 48, '2024-10-15', 45400),
    ('f0000000-0000-0000-0000-000000000025', 'e0000000-0000-0000-0000-000000000005', 1, 4, 'El Santuario', 'El grupo finalmente llega a El Santuario. Pero nada es lo que esperaban. El verdadero desafío apenas comienza.', 'https://img.streamverse.com/episodes/santuario-s1e4.jpg', 'https://stream.streamverse.com/series/santuario/s1e4.m3u8', 58, '2024-10-22', 51200);

-- ============================================
-- EPG PROGRAMS (24-hour schedule)
-- ============================================
DO $$
DECLARE
    now_ts TIMESTAMPTZ := NOW();
    slot_start TIMESTAMPTZ;
    slot_end TIMESTAMPTZ;
    channel RECORD;
BEGIN
    FOR channel IN SELECT * FROM channels LOOP
        -- Morning block (00:00 - 06:00)
        slot_start := date_trunc('day', now_ts) + interval '0 hours';
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Programa Nocturno', 'Programación nocturna especial', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Madrugada en Vivo', 'Transmisión en vivo desde nuestros estudios', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Primera Hora', 'Las noticias más importantes del día', slot_start, slot_end, 'news');

        -- Morning block (06:00 - 12:00)
        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Buenos Días Latinoamérica', 'El mejor programa matutino para comenzar el día', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Estilo de Vida', 'Consejos de salud, bienestar y cocina', slot_start, slot_end, 'education');

        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Series Matutinas', 'Los mejores episodios de tus series favoritas', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Documentales', 'Contenido educativo y documentales exclusivos', slot_start, slot_end, 'documentary');

        -- Afternoon block (12:00 - 18:00)
        slot_start := slot_end;
        slot_end := slot_start + interval '1 hour';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Noticias del Mediodía', 'Resumen informativo con los acontecimientos más relevantes', slot_start, slot_end, 'news');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Cine de Tarde', 'Películas seleccionadas para disfrutar en casa', slot_start, slot_end, 'movies');

        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Programa Juvenil', 'Contenido fresco y dinámico para los jóvenes', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '1.5 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Tardes Deportivas', 'Cobertura de eventos deportivos nacionales e internacionales', slot_start, slot_end, 'sports');

        -- Primetime (18:00 - 00:00)
        slot_start := slot_end;
        slot_end := slot_start + interval '1 hour';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Noticias Estelar', 'El noticiero más completo con análisis de expertos', slot_start, slot_end, 'news');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Horario Estelar - Serie Principal', 'El episodio más reciente de nuestra serie estrella', slot_start, slot_end, 'entertainment');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Película de la Noche', 'Estreno exclusivo de la película de la semana', slot_start, slot_end, 'movies');

        slot_start := slot_end;
        slot_end := slot_start + interval '2 hours';
        INSERT INTO epg_programs (channel_id, title, description, start_time, end_time, category) VALUES
            (channel.id, 'Programa de Entrevistas', 'Entrevistas en profundidad con personalidades destacadas', slot_start, slot_end, 'entertainment');
    END LOOP;
END $$;

-- ============================================
-- BANNERS
-- ============================================
INSERT INTO banners (id, title, subtitle, image, video_url, content_id, content_type, link_url, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000101', 'El Último Refugio', 'En un mundo devastado, la esperanza es el arma más poderosa', 'https://img.streamverse.com/banners/ultimo-refugio-banner.jpg', 'https://stream.streamverse.com/trailers/ultimo-refugio.mp4', 'd0000000-0000-0000-0000-000000000006', 'movie', '/movies/el-ultimo-refugio', 1, true),
    ('a0000000-0000-0000-0000-000000000102', 'Frontera Sur - Temporada 2', 'La frontera no solo divide países, divide lealtades', 'https://img.streamverse.com/banners/frontera-sur-banner.jpg', 'https://stream.streamverse.com/trailers/frontera-sur-s2.mp4', 'e0000000-0000-0000-0000-000000000001', 'series', '/series/frontera-sur', 2, true),
    ('a0000000-0000-0000-0000-000000000103', 'HBO Latinoamérica en Vivo', 'Los mejores estrenos y contenido exclusivo', 'https://img.streamverse.com/banners/hbo-live-banner.jpg', NULL, 'c0000000-0000-0000-0000-000000000001', 'channel', '/channels/hbo-latam', 3, true),
    ('a0000000-0000-0000-0000-000000000104', 'Código Cósmico', 'La señal que cambiará la humanidad', 'https://img.streamverse.com/banners/codigo-cosmico-banner.jpg', 'https://stream.streamverse.com/trailers/codigo-cosmico.mp4', 'e0000000-0000-0000-0000-000000000002', 'series', '/series/codigo-cosmico', 4, true),
    ('a0000000-0000-0000-0000-000000000105', 'Deportes en Vivo', 'Toda la acción deportiva con ESPN y Televisa Deportes', 'https://img.streamverse.com/banners/deportes-banner.jpg', NULL, NULL, NULL, '/channels?category=sports', 5, true);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Seed completed successfully!' AS result;
