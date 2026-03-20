/* ===================================
   DATOS DEL CLUB - REAL OVIEDO
   =================================== */

const CLUB_DATA = {
    // Información del club
    club: {
        nombre: "Real Oviedo Sangre Carbayona",
        nombreCorto: "Sangre Carbayona",
        siglas: "SOC",
        fundacion: 1926,
        estadio: "Estadio Carlos Tartiere",
        capacidadEstadio: 30500,
        ciudad: "Oviedo",
        direccion: "Calle Carlos Tartiere s/n, 33013 Oviedo",
        telefono: "985 111 111",
        email: "info@sangrecarbayona.com"
    },

    // Temporada actual (por defecto)
    temporadaActual: "2024-25",
    
    // Lista de temporadas disponibles
    temporadasDisponibles: [
        { id: "2024-25", nombre: "2024/25", actual: true },
        { id: "2023-24", nombre: "2023/24", actual: false },
        { id: "2022-23", nombre: "2022/23", actual: false }
    ],

    // Datos por temporada
    temporadas: {
        // ===================================
        // TEMPORADA 2024/25
        // ===================================
        "2024-25": {
            competicion: "Primera RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: {
                posicion: 2,
                partidosJugados: 23,
                victorias: 13,
                empates: 6,
                derrotas: 4,
                golesFavor: 38,
                golesContra: 18
            },
            
            clasificacion: [
                { posicion: 1, siglas: "RAC", nombre: "Racing Ferrol", puntos: 48, jugados: 23, gfavor: 42, gcontra: 15, dg: "+27", destacado: true, logo: "https://picsum.photos/seed/racing-logo/60/60" },
                { posicion: 2, siglas: "CDV", nombre: "Villaferreira", puntos: 45, jugados: 23, gfavor: 38, gcontra: 18, dg: "+20", destacado: true, logo: "https://picsum.photos/seed/villaferreira-logo/60/60" },
                { posicion: 3, siglas: "UDR", nombre: "UD Rosaleda", puntos: 42, jugados: 23, gfavor: 35, gcontra: 20, dg: "+15", destacado: true, logo: "https://picsum.photos/seed/rosaleda-logo/60/60" },
                { posicion: 4, siglas: "ATV", nombre: "Atlético Vergara", puntos: 39, jugados: 23, gfavor: 30, gcontra: 22, dg: "+8", destacado: false, logo: "https://picsum.photos/seed/vergara-logo/60/60" },
                { posicion: 5, siglas: "CDS", nombre: "Cultural Soria", puntos: 37, jugados: 23, gfavor: 28, gcontra: 24, dg: "+4", destacado: false, logo: "https://picsum.photos/seed/soria-logo/60/60" },
                { posicion: 6, siglas: "SPE", nombre: "Sporting Esteño", puntos: 35, jugados: 23, gfavor: 32, gcontra: 28, dg: "+4", destacado: false, logo: "https://picsum.photos/seed/esteno-logo/60/60" },
                { posicion: 7, siglas: "UNI", nombre: "Unión Sur", puntos: 33, jugados: 23, gfavor: 29, gcontra: 25, dg: "+4", destacado: false, logo: "https://picsum.photos/seed/unionsur-logo/60/60" },
                { posicion: 8, siglas: "DEP", nombre: "Deportivo Norte", puntos: 31, jugados: 23, gfavor: 26, gcontra: 27, dg: "-1", destacado: false, logo: "https://picsum.photos/seed/depnorte-logo/60/60" },
                { posicion: 9, siglas: "CFP", nombre: "CF Palencia", puntos: 28, jugados: 23, gfavor: 24, gcontra: 30, dg: "-6", destacado: false, logo: "https://picsum.photos/seed/palencia-logo/60/60" },
                { posicion: 10, siglas: "ZAM", nombre: "Zamora CF", puntos: 26, jugados: 23, gfavor: 22, gcontra: 29, dg: "-7", destacado: false, logo: "https://picsum.photos/seed/zamora-logo/60/60" },
                { posicion: 11, siglas: "SAL", nombre: "Salamanca UDS", puntos: 24, jugados: 23, gfavor: 20, gcontra: 31, dg: "-11", destacado: false, logo: "https://picsum.photos/seed/salamanca-logo/60/60" },
                { posicion: 12, siglas: "GUA", nombre: "Guadalajara", puntos: 22, jugados: 23, gfavor: 18, gcontra: 33, dg: "-15", destacado: false, logo: "https://picsum.photos/seed/guadalajara-logo/60/60" },
                { posicion: 13, siglas: "BER", nombre: "Bergantiño FC", puntos: 19, jugados: 23, gfavor: 16, gcontra: 35, dg: "-19", destacado: false, logo: "https://picsum.photos/seed/bergantino-logo/60/60" },
                { posicion: 14, siglas: "COM", nombre: "Compostela", puntos: 17, jugados: 23, gfavor: 15, gcontra: 38, dg: "-23", destacado: false, logo: "https://picsum.photos/seed/compostela-logo/60/60" },
                { posicion: 15, siglas: "PON", nombre: "Pontevedra CF", puntos: 14, jugados: 23, gfavor: 12, gcontra: 40, dg: "-28", destacado: false, logo: "https://picsum.photos/seed/pontevedra-logo/60/60" },
                { posicion: 16, siglas: "LUG", nombre: "CD Lugo B", puntos: 11, jugados: 23, gfavor: 10, gcontra: 42, dg: "-32", destacado: false, logo: "https://picsum.photos/seed/lugo-logo/60/60" }
            ],
            
            jugadores: [
                { id: 1, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 28, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://picsum.photos/seed/gk1-24/400/500", stats: { partidos: 23, goles: 0, asistencias: 0, minutos: 2070, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 2, codigo: "pablo-menendez", nombre: "Pablo", apellidos: "Menéndez Álvarez", nombreCompleto: "Pablo Menéndez", dorsal: 13, posicion: "Portero", posicionCorta: "POR", edad: 22, altura: 1.83, peso: 78, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "2002-07-22", enClubDesde: "2024", contratoHasta: "2025", imagen: "https://picsum.photos/seed/gk2-24/400/500", stats: { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 3, codigo: "dani-fernandez", nombre: "Dani", apellidos: "Fernández Rodríguez", nombreCompleto: "Dani Fernández", dorsal: 2, posicion: "Lateral Derecho", posicionCorta: "LD", edad: 26, altura: 1.78, peso: 73, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Avilés, Asturias", fechaNacimiento: "1998-11-03", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df1-24/400/500", stats: { partidos: 21, goles: 2, asistencias: 4, minutos: 1780, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 4, codigo: "adrian-picos", nombre: "Adrián", apellidos: "Picos Menéndez", nombreCompleto: "Adrián Picos", dorsal: 4, posicion: "Central", posicionCorta: "DC", edad: 29, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "1995-06-18", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df2-24/400/500", stats: { partidos: 23, goles: 3, asistencias: 1, minutos: 2045, amarillas: 5, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 5, codigo: "victor-marquez", nombre: "Víctor", apellidos: "Márquez López", nombreCompleto: "Víctor Márquez", dorsal: 5, posicion: "Central", posicionCorta: "DC", edad: 27, altura: 1.82, peso: 77, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "León", fechaNacimiento: "1997-09-30", enClubDesde: "2023", contratoHasta: "2026", imagen: "https://picsum.photos/seed/df3-24/400/500", stats: { partidos: 22, goles: 1, asistencias: 2, minutos: 1890, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 6, codigo: "sergio-nunez", nombre: "Sergio", apellidos: "Núñez Pérez", nombreCompleto: "Sergio Núñez", dorsal: 3, posicion: "Lateral Izquierdo", posicionCorta: "LI", edad: 24, altura: 1.76, peso: 70, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-02-14", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/df4-24/400/500", stats: { partidos: 18, goles: 0, asistencias: 4, minutos: 1420, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 7, codigo: "borja-trujillo", nombre: "Borja", apellidos: "Trujillo Fernández", nombreCompleto: "Borja Trujillo", dorsal: 15, posicion: "Central", posicionCorta: "DC", edad: 25, altura: 1.88, peso: 83, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1999-08-05", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df5-24/400/500", stats: { partidos: 12, goles: 0, asistencias: 0, minutos: 890, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 8, codigo: "alvaro-santos", nombre: "Álvaro", apellidos: "Santos Díaz", nombreCompleto: "Álvaro Santos", dorsal: 6, posicion: "Mediocentro Defensivo", posicionCorta: "MCD", edad: 30, altura: 1.80, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Sevilla", fechaNacimiento: "1994-12-10", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf1-24/400/500", stats: { partidos: 23, goles: 1, asistencias: 2, minutos: 1980, amarillas: 8, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 9, codigo: "nacho-ruiz", nombre: "Nacho", apellidos: "Ruiz Martínez", nombreCompleto: "Nacho Ruiz", dorsal: 8, posicion: "Centrocampista", posicionCorta: "MC", edad: 26, altura: 1.77, peso: 72, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Valencia", fechaNacimiento: "1998-04-25", enClubDesde: "2023", contratoHasta: "2026", imagen: "https://picsum.photos/seed/mf2-24/400/500", stats: { partidos: 22, goles: 5, asistencias: 6, minutos: 1750, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 10, codigo: "pedro-leal", nombre: "Pedro", apellidos: "Leal García", nombreCompleto: "Pedro Leal", dorsal: 10, posicion: "Mediapunta", posicionCorta: "MP", edad: 28, altura: 1.74, peso: 68, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Barcelona", fechaNacimiento: "1996-07-08", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf3-24/400/500", stats: { partidos: 21, goles: 8, asistencias: 5, minutos: 1680, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 11, codigo: "ivan-pacheco", nombre: "Iván", apellidos: "Pacheco López", nombreCompleto: "Iván Pacheco", dorsal: 14, posicion: "Centrocampista", posicionCorta: "MC", edad: 23, altura: 1.79, peso: 74, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Murcia", fechaNacimiento: "2001-03-20", enClubDesde: "2025", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf4-24/400/500", stats: { partidos: 8, goles: 0, asistencias: 2, minutos: 420, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 12, codigo: "hugo-delatorre", nombre: "Hugo", apellidos: "de la Torre Sánchez", nombreCompleto: "Hugo de la Torre", dorsal: 16, posicion: "Mediocentro", posicionCorta: "MC", edad: 21, altura: 1.75, peso: 69, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "2003-10-12", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/mf5-24/400/500", stats: { partidos: 15, goles: 1, asistencias: 3, minutos: 890, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 13, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 27, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw1-24/400/500", esCapitan: true, stats: { partidos: 23, goles: 14, asistencias: 4, minutos: 1892, amarillas: 4, rojas: 0 }, logros: ["Pichichi Primera RFEF 2023/24", "Capitán del equipo"], redes: { instagram: "#", twitter: "#" } },
                { id: 14, codigo: "ruben-cano", nombre: "Rubén", apellidos: "Cano Pérez", nombreCompleto: "Rubén Cano", dorsal: 7, posicion: "Extremo Derecho", posicionCorta: "ED", edad: 25, altura: 1.73, peso: 67, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Bilbao, Vizcaya", fechaNacimiento: "1999-05-28", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw2-24/400/500", stats: { partidos: 20, goles: 6, asistencias: 8, minutos: 1450, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 15, codigo: "luis-garcia", nombre: "Luis", apellidos: "García Rodríguez", nombreCompleto: "Luis 'Lucho' García", dorsal: 11, posicion: "Extremo Izquierdo", posicionCorta: "EI", edad: 24, altura: 1.76, peso: 71, pie: "Izquierdo", nacionalidad: "Argentino", lugarNacimiento: "Buenos Aires", fechaNacimiento: "2000-09-18", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw3-24/400/500", stats: { partidos: 22, goles: 7, asistencias: 9, minutos: 1580, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 16, codigo: "diego-lopez", nombre: "Diego", apellidos: "López Sánchez", nombreCompleto: "Diego 'Chicho' López", dorsal: 17, posicion: "Delantero", posicionCorta: "DC", edad: 22, altura: 1.79, peso: 76, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "2002-01-05", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw4-24/400/500", stats: { partidos: 12, goles: 3, asistencias: 1, minutos: 580, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1/400/450", descripcion: "Licenciado en Educación Física con más de 15 años de experiencia.", esPrincipal: true, estadisticas: { partidos: 89, victorias: 46, empates: 22, derrotas: 21 } },
                { id: 2, nombre: "Roberto Vázquez", cargo: "Segundo Entrenador", imagen: "https://picsum.photos/seed/coach2/400/450", descripcion: "Especialista en análisis táctico.", esPrincipal: false },
                { id: 3, nombre: "Miguel Serrano", cargo: "Preparador Físico", imagen: "https://picsum.photos/seed/coach3/400/450", descripcion: "Especialista en rendimiento deportivo.", esPrincipal: false },
                { id: 4, nombre: "Antonio Cruz", cargo: "Entrenador de Porteros", imagen: "https://picsum.photos/seed/coach4/400/450", descripcion: "Ex-portero profesional.", esPrincipal: false }
            ],

            partidosJugados: [
                { id: 1, jornada: 23, fecha: "2025-01-19", local: "Villaferreira", visitante: "Atlético Vergara", golesLocal: 2, golesVisitante: 1, resultado: "V" },
                { id: 2, jornada: 22, fecha: "2025-01-12", local: "Cultural Soria", visitante: "Villaferreira", golesLocal: 0, golesVisitante: 3, resultado: "V" },
                { id: 3, jornada: 21, fecha: "2025-01-05", local: "Villaferreira", visitante: "Racing Ferrol", golesLocal: 1, golesVisitante: 1, resultado: "E" },
                { id: 4, jornada: 20, fecha: "2024-12-22", local: "Sporting Esteño", visitante: "Villaferreira", golesLocal: 2, golesVisitante: 4, resultado: "V" },
                { id: 5, jornada: 19, fecha: "2024-12-15", local: "Villaferreira", visitante: "UD Rosaleda", golesLocal: 2, golesVisitante: 0, resultado: "V" }
            ]
        },
        
        // ===================================
        // TEMPORADA 2023/24
        // ===================================
        "2023-24": {
            competicion: "Primera RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: {
                posicion: 4,
                partidosJugados: 38,
                victorias: 18,
                empates: 10,
                derrotas: 10,
                golesFavor: 56,
                golesContra: 35
            },
            
            clasificacion: [
                { posicion: 1, siglas: "RAC", nombre: "Racing Ferrol", puntos: 72, jugados: 38, gfavor: 65, gcontra: 28, dg: "+37", destacado: true, logo: "https://picsum.photos/seed/racing-logo/60/60" },
                { posicion: 2, siglas: "UDR", nombre: "UD Rosaleda", puntos: 68, jugados: 38, gfavor: 58, gcontra: 32, dg: "+26", destacado: true, logo: "https://picsum.photos/seed/rosaleda-logo/60/60" },
                { posicion: 3, siglas: "SPE", nombre: "Sporting Esteño", puntos: 64, jugados: 38, gfavor: 52, gcontra: 30, dg: "+22", destacado: true, logo: "https://picsum.photos/seed/esteno-logo/60/60" },
                { posicion: 4, siglas: "CDV", nombre: "Villaferreira", puntos: 64, jugados: 38, gfavor: 56, gcontra: 35, dg: "+21", destacado: true, logo: "https://picsum.photos/seed/villaferreira-logo/60/60" },
                { posicion: 5, siglas: "ATV", nombre: "Atlético Vergara", puntos: 60, jugados: 38, gfavor: 48, gcontra: 38, dg: "+10", destacado: false, logo: "https://picsum.photos/seed/vergara-logo/60/60" },
                { posicion: 6, siglas: "CDS", nombre: "Cultural Soria", puntos: 55, jugados: 38, gfavor: 45, gcontra: 40, dg: "+5", destacado: false, logo: "https://picsum.photos/seed/soria-logo/60/60" },
                { posicion: 7, siglas: "UNI", nombre: "Unión Sur", puntos: 50, jugados: 38, gfavor: 42, gcontra: 44, dg: "-2", destacado: false, logo: "https://picsum.photos/seed/unionsur-logo/60/60" },
                { posicion: 8, siglas: "DEP", nombre: "Deportivo Norte", puntos: 46, jugados: 38, gfavor: 38, gcontra: 45, dg: "-7", destacado: false, logo: "https://picsum.photos/seed/depnorte-logo/60/60" }
            ],
            
            jugadores: [
                { id: 101, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 27, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/gk1-23/400/500", stats: { partidos: 36, goles: 0, asistencias: 0, minutos: 3240, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 102, codigo: "ivan-garcia-p", nombre: "Iván", apellidos: "García Pérez", nombreCompleto: "Iván García", dorsal: 13, posicion: "Portero", posicionCorta: "POR", edad: 24, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-05-12", enClubDesde: "2021", contratoHasta: "2024", imagen: "https://picsum.photos/seed/gk2-23/400/500", stats: { partidos: 2, goles: 0, asistencias: 0, minutos: 180, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 103, codigo: "marcos-gonzalez", nombre: "Marcos", apellidos: "González Luna", nombreCompleto: "Marcos González", dorsal: 2, posicion: "Lateral Derecho", posicionCorta: "LD", edad: 29, altura: 1.79, peso: 74, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Salamanca", fechaNacimiento: "1995-08-20", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df1-23/400/500", stats: { partidos: 32, goles: 1, asistencias: 5, minutos: 2780, amarillas: 6, rojas: 1 }, redes: { instagram: "#", twitter: "#" } },
                { id: 104, codigo: "adrian-picos", nombre: "Adrián", apellidos: "Picos Menéndez", nombreCompleto: "Adrián Picos", dorsal: 4, posicion: "Central", posicionCorta: "DC", edad: 28, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "1995-06-18", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df2-23/400/500", stats: { partidos: 35, goles: 4, asistencias: 2, minutos: 3080, amarillas: 7, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 105, codigo: "raul-fernandez", nombre: "Raúl", apellidos: "Fernández Soto", nombreCompleto: "Raúl Fernández", dorsal: 5, posicion: "Central", posicionCorta: "DC", edad: 31, altura: 1.84, peso: 79, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1993-02-14", enClubDesde: "2021", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df3-23/400/500", stats: { partidos: 28, goles: 2, asistencias: 1, minutos: 2450, amarillas: 5, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 106, codigo: "jorge-martin", nombre: "Jorge", apellidos: "Martín Díaz", nombreCompleto: "Jorge Martín", dorsal: 3, posicion: "Lateral Izquierdo", posicionCorta: "LI", edad: 26, altura: 1.77, peso: 71, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Zamora", fechaNacimiento: "1998-11-30", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df4-23/400/500", stats: { partidos: 30, goles: 1, asistencias: 6, minutos: 2560, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 107, codigo: "alvaro-santos", nombre: "Álvaro", apellidos: "Santos Díaz", nombreCompleto: "Álvaro Santos", dorsal: 6, posicion: "Mediocentro Defensivo", posicionCorta: "MCD", edad: 29, altura: 1.80, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Sevilla", fechaNacimiento: "1994-12-10", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf1-23/400/500", stats: { partidos: 34, goles: 2, asistencias: 3, minutos: 2920, amarillas: 10, rojas: 1 }, redes: { instagram: "#", twitter: "#" } },
                { id: 108, codigo: "fernando-gomez", nombre: "Fernando", apellidos: "Gómez Vega", nombreCompleto: "Fernando Gómez", dorsal: 8, posicion: "Centrocampista", posicionCorta: "MC", edad: 25, altura: 1.75, peso: 70, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "León", fechaNacimiento: "1999-04-05", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf2-23/400/500", stats: { partidos: 28, goles: 4, asistencias: 7, minutos: 2180, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 109, codigo: "pedro-leal", nombre: "Pedro", apellidos: "Leal García", nombreCompleto: "Pedro Leal", dorsal: 10, posicion: "Mediapunta", posicionCorta: "MP", edad: 27, altura: 1.74, peso: 68, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Barcelona", fechaNacimiento: "1996-07-08", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf3-23/400/500", stats: { partidos: 33, goles: 9, asistencias: 8, minutos: 2650, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 110, codigo: "alberto-ruiz", nombre: "Alberto", apellidos: "Ruiz Núñez", nombreCompleto: "Alberto Ruiz", dorsal: 16, posicion: "Centrocampista", posicionCorta: "MC", edad: 23, altura: 1.78, peso: 72, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "2001-09-22", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf4-23/400/500", stats: { partidos: 18, goles: 1, asistencias: 2, minutos: 980, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 111, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 26, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw1-23/400/500", esCapitan: false, stats: { partidos: 35, goles: 22, asistencias: 6, minutos: 2980, amarillas: 5, rojas: 0 }, logros: ["Pichichi Primera RFEF 2023/24", "Mejor Jugador Temporada"], redes: { instagram: "#", twitter: "#" } },
                { id: 112, codigo: "carlos-diaz", nombre: "Carlos", apellidos: "Díaz López", nombreCompleto: "Carlos Díaz", dorsal: 7, posicion: "Extremo Derecho", posicionCorta: "ED", edad: 24, altura: 1.72, peso: 68, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-06-15", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/fw2-23/400/500", stats: { partidos: 25, goles: 5, asistencias: 9, minutos: 1850, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 113, codigo: "mario-alvarez", nombre: "Mario", apellidos: "Álvarez Torres", nombreCompleto: "Mario Álvarez", dorsal: 11, posicion: "Extremo Izquierdo", posicionCorta: "EI", edad: 26, altura: 1.75, peso: 70, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Santander", fechaNacimiento: "1998-01-28", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw3-23/400/500", stats: { partidos: 30, goles: 8, asistencias: 5, minutos: 2320, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 114, codigo: "diego-lopez", nombre: "Diego", apellidos: "López Sánchez", nombreCompleto: "Diego López", dorsal: 17, posicion: "Delantero", posicionCorta: "DC", edad: 21, altura: 1.79, peso: 76, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "2002-01-05", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw4-23/400/500", stats: { partidos: 15, goles: 4, asistencias: 2, minutos: 650, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1-23/400/450", descripcion: "Temporada de consolidación en el banquillo.", esPrincipal: true, estadisticas: { partidos: 38, victorias: 18, empates: 10, derrotas: 10 } },
                { id: 2, nombre: "Roberto Vázquez", cargo: "Segundo Entrenador", imagen: "https://picsum.photos/seed/coach2-23/400/450", descripcion: "Especialista en análisis táctico.", esPrincipal: false },
                { id: 3, nombre: "Miguel Serrano", cargo: "Preparador Físico", imagen: "https://picsum.photos/seed/coach3-23/400/450", descripcion: "Especialista en rendimiento.", esPrincipal: false }
            ],

            partidosJugados: [
                { id: 101, jornada: 38, fecha: "2024-05-19", local: "Villaferreira", visitante: "Cultural Soria", golesLocal: 3, golesVisitante: 1, resultado: "V" },
                { id: 102, jornada: 37, fecha: "2024-05-12", local: "Racing Ferrol", visitante: "Villaferreira", golesLocal: 2, golesVisitante: 2, resultado: "E" },
                { id: 103, jornada: 36, fecha: "2024-05-05", local: "Villaferreira", visitante: "Atlético Vergara", golesLocal: 1, golesVisitante: 0, resultado: "V" },
                { id: 104, jornada: 35, fecha: "2024-04-28", local: "Sporting Esteño", visitante: "Villaferreira", golesLocal: 3, golesVisitante: 1, resultado: "D" },
                { id: 105, jornada: 34, fecha: "2024-04-21", local: "Villaferreira", visitante: "UD Rosaleda", golesLocal: 2, golesVisitante: 1, resultado: "V" }
            ]
        },
        
        // ===================================
        // TEMPORADA 2022/23
        // ===================================
        "2022-23": {
            competicion: "Segunda RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: {
                posicion: 1,
                partidosJugados: 34,
                victorias: 22,
                empates: 6,
                derrotas: 6,
                golesFavor: 62,
                golesContra: 28
            },
            
            clasificacion: [
                { posicion: 1, siglas: "CDV", nombre: "Villaferreira", puntos: 72, jugados: 34, gfavor: 62, gcontra: 28, dg: "+34", destacado: true, logo: "https://picsum.photos/seed/villaferreira-logo/60/60" },
                { posicion: 2, siglas: "ATV", nombre: "Atlético Vergara", puntos: 65, jugados: 34, gfavor: 55, gcontra: 30, dg: "+25", destacado: true, logo: "https://picsum.photos/seed/vergara-logo/60/60" },
                { posicion: 3, siglas: "CDS", nombre: "Cultural Soria", puntos: 60, jugados: 34, gfavor: 48, gcontra: 32, dg: "+16", destacado: true, logo: "https://picsum.photos/seed/soria-logo/60/60" },
                { posicion: 4, siglas: "ZAM", nombre: "Zamora CF", puntos: 55, jugados: 34, gfavor: 45, gcontra: 35, dg: "+10", destacado: true, logo: "https://picsum.photos/seed/zamora-logo/60/60" },
                { posicion: 5, siglas: "UNI", nombre: "Unión Sur", puntos: 50, jugados: 34, gfavor: 40, gcontra: 38, dg: "+2", destacado: false, logo: "https://picsum.photos/seed/unionsur-logo/60/60" },
                { posicion: 6, siglas: "DEP", nombre: "Deportivo Norte", puntos: 48, jugados: 34, gfavor: 38, gcontra: 40, dg: "-2", destacado: false, logo: "https://picsum.photos/seed/depnorte-logo/60/60" }
            ],
            
            jugadores: [
                { id: 201, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 26, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/gk1-22/400/500", stats: { partidos: 34, goles: 0, asistencias: 0, minutos: 3060, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 202, codigo: "ivan-garcia-p", nombre: "Iván", apellidos: "García Pérez", nombreCompleto: "Iván García", dorsal: 13, posicion: "Portero", posicionCorta: "POR", edad: 23, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-05-12", enClubDesde: "2021", contratoHasta: "2023", imagen: "https://picsum.photos/seed/gk2-22/400/500", stats: { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 203, codigo: "marcos-gonzalez", nombre: "Marcos", apellidos: "González Luna", nombreCompleto: "Marcos González", dorsal: 2, posicion: "Lateral Derecho", posicionCorta: "LD", edad: 28, altura: 1.79, peso: 74, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Salamanca", fechaNacimiento: "1995-08-20", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df1-22/400/500", stats: { partidos: 30, goles: 2, asistencias: 8, minutos: 2650, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 204, codigo: "adrian-picos", nombre: "Adrián", apellidos: "Picos Menéndez", nombreCompleto: "Adrián Picos", dorsal: 4, posicion: "Central", posicionCorta: "DC", edad: 27, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "1995-06-18", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df2-22/400/500", stats: { partidos: 32, goles: 5, asistencias: 3, minutos: 2820, amarillas: 6, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 205, codigo: "raul-fernandez", nombre: "Raúl", apellidos: "Fernández Soto", nombreCompleto: "Raúl Fernández", dorsal: 5, posicion: "Central", posicionCorta: "DC", edad: 30, altura: 1.84, peso: 79, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1993-02-14", enClubDesde: "2021", contratoHasta: "2023", imagen: "https://picsum.photos/seed/df3-22/400/500", stats: { partidos: 28, goles: 3, asistencias: 1, minutos: 2480, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 206, codigo: "jorge-martin", nombre: "Jorge", apellidos: "Martín Díaz", nombreCompleto: "Jorge Martín", dorsal: 3, posicion: "Lateral Izquierdo", posicionCorta: "LI", edad: 25, altura: 1.77, peso: 71, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Zamora", fechaNacimiento: "1998-11-30", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df4-22/400/500", stats: { partidos: 26, goles: 0, asistencias: 7, minutos: 2200, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 207, codigo: "alvaro-santos", nombre: "Álvaro", apellidos: "Santos Díaz", nombreCompleto: "Álvaro Santos", dorsal: 6, posicion: "Mediocentro Defensivo", posicionCorta: "MCD", edad: 28, altura: 1.80, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Sevilla", fechaNacimiento: "1994-12-10", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/mf1-22/400/500", stats: { partidos: 32, goles: 3, asistencias: 4, minutos: 2800, amarillas: 8, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 208, codigo: "fernando-gomez", nombre: "Fernando", apellidos: "Gómez Vega", nombreCompleto: "Fernando Gómez", dorsal: 8, posicion: "Centrocampista", posicionCorta: "MC", edad: 24, altura: 1.75, peso: 70, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "León", fechaNacimiento: "1999-04-05", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/mf2-22/400/500", stats: { partidos: 29, goles: 6, asistencias: 9, minutos: 2320, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 209, codigo: "pedro-leal", nombre: "Pedro", apellidos: "Leal García", nombreCompleto: "Pedro Leal", dorsal: 10, posicion: "Mediapunta", posicionCorta: "MP", edad: 26, altura: 1.74, peso: 68, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Barcelona", fechaNacimiento: "1996-07-08", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/mf3-22/400/500", stats: { partidos: 31, goles: 10, asistencias: 7, minutos: 2580, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 210, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 25, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw1-22/400/500", esCapitan: false, stats: { partidos: 32, goles: 18, asistencias: 5, minutos: 2750, amarillas: 4, rojas: 0 }, logros: ["Ascenso a Primera RFEF", "Máximo goleador del equipo"], redes: { instagram: "#", twitter: "#" } },
                { id: 211, codigo: "carlos-diaz", nombre: "Carlos", apellidos: "Díaz López", nombreCompleto: "Carlos Díaz", dorsal: 7, posicion: "Extremo Derecho", posicionCorta: "ED", edad: 23, altura: 1.72, peso: 68, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-06-15", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/fw2-22/400/500", stats: { partidos: 28, goles: 7, asistencias: 10, minutos: 2100, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 212, codigo: "mario-alvarez", nombre: "Mario", apellidos: "Álvarez Torres", nombreCompleto: "Mario Álvarez", dorsal: 11, posicion: "Extremo Izquierdo", posicionCorta: "EI", edad: 25, altura: 1.75, peso: 70, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Santander", fechaNacimiento: "1998-01-28", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/fw3-22/400/500", stats: { partidos: 25, goles: 6, asistencias: 4, minutos: 1850, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 213, codigo: "roberto-sanchez", nombre: "Roberto", apellidos: "Sánchez Pérez", nombreCompleto: "Roberto Sánchez", dorsal: 14, posicion: "Delantero", posicionCorta: "DC", edad: 27, altura: 1.81, peso: 77, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Valencia", fechaNacimiento: "1996-09-10", enClubDesde: "2022", contratoHasta: "2023", imagen: "https://picsum.photos/seed/fw4-22/400/500", stats: { partidos: 18, goles: 5, asistencias: 2, minutos: 920, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1-22/400/450", descripcion: "Primera temporada al frente del equipo. Ascenso logrado.", esPrincipal: true, estadisticas: { partidos: 34, victorias: 22, empates: 6, derrotas: 6 } },
                { id: 2, nombre: "Roberto Vázquez", cargo: "Segundo Entrenador", imagen: "https://picsum.photos/seed/coach2-22/400/450", descripcion: "Especialista táctico.", esPrincipal: false }
            ],

            partidosJugados: [
                { id: 201, jornada: 34, fecha: "2023-05-14", local: "Villaferreira", visitante: "Atlético Vergara", golesLocal: 3, golesVisitante: 0, resultado: "V" },
                { id: 202, jornada: 33, fecha: "2023-05-07", local: "Cultural Soria", visitante: "Villaferreira", golesLocal: 1, golesVisitante: 1, resultado: "E" },
                { id: 203, jornada: 32, fecha: "2023-04-30", local: "Villaferreira", visitante: "Zamora CF", golesLocal: 4, golesVisitante: 0, resultado: "V" },
                { id: 204, jornada: 31, fecha: "2023-04-23", local: "Unión Sur", visitante: "Villaferreira", golesLocal: 1, golesVisitante: 2, resultado: "V" },
                { id: 205, jornada: 30, fecha: "2023-04-16", local: "Villaferreira", visitante: "Deportivo Norte", golesLocal: 2, golesVisitante: 1, resultado: "V" }
            ]
        }
    },

    // ===================================
    // DATOS GENERALES
    // ===================================
    
    calendario: [
        { id: 1, jornada: 24, fecha: "2025-01-26", hora: "18:00", local: "Villaferreira", visitante: "UD Rosaleda", estadio: "Estadio Municipal", esProximo: true },
        { id: 2, jornada: 25, fecha: "2025-02-02", hora: "16:00", local: "Racing Ferrol", visitante: "Villaferreira", estadio: "A Fermín", esProximo: false },
        { id: 3, jornada: 26, fecha: "2025-02-09", hora: "17:00", local: "Villaferreira", visitante: "Cultural Soria", estadio: "Estadio Municipal", esProximo: false }
    ],

    noticias: [
        { id: 1, titulo: "El Villaferreira encadena cinco victorias consecutivas", resumen: "El equipo entra en puestos de playoff.", categoria: "Primer Equipo", fecha: "2025-01-24", imagen: "https://picsum.photos/seed/news1/800/500", esPrincipal: true },
        { id: 2, titulo: "Carlos Mendoza: \"El equipo muestra madurez táctica\"", resumen: "El técnico valora el momento del equipo.", categoria: "Prensa", fecha: "2025-01-23", imagen: "https://picsum.photos/seed/news2/400/300", esPrincipal: false },
        { id: 3, titulo: "El Juvenil A se clasifica para la fase nacional", resumen: "Histórica clasificación del Juvenil A.", categoria: "Cantera", fecha: "2025-01-22", imagen: "https://picsum.photos/seed/news3/400/300", esPrincipal: false },
        { id: 4, titulo: "El fútbol femenino sigue creciendo", resumen: "150 jugadoras en categorías base.", categoria: "Femenino", fecha: "2025-01-21", imagen: "https://picsum.photos/seed/news4/400/300", esPrincipal: false },
        { id: 5, titulo: "Iván Pacheco, nuevo jugador", resumen: "Fichaje hasta final de temporada.", categoria: "Fichajes", fecha: "2025-01-20", imagen: "https://picsum.photos/seed/news5/400/300", esPrincipal: false }
    ],

    patrocinadores: [
        { id: 1, nombre: "Grupo Norte" },
        { id: 2, nombre: "Cervezas del Valle" },
        { id: 3, nombre: "Ferrolider" },
        { id: 4, nombre: "Clínica Dental Sonrisa" }
    ],

    proximoPartido: {
        jornada: 24,
        competicion: "Primera RFEF",
        fecha: "2025-01-26",
        hora: "18:00",
        local: "Villaferreira",
        localSiglas: "CDV",
        visitante: "UD Rosaleda",
        visitanteSiglas: "UDR",
        estadio: "Estadio Municipal de Villaferreira"
    }
};

// ===================================
// FUNCIONES DE AYUDA
// ===================================

function getTemporada(seasonId) {
    return CLUB_DATA.temporadas[seasonId] || CLUB_DATA.temporadas[CLUB_DATA.temporadaActual];
}

function getJugadorById(id, seasonId) {
    const temporada = getTemporada(seasonId);
    return temporada.jugadores.find(j => j.id === parseInt(id));
}

function getJugadoresByPosicion(posicion, seasonId) {
    const temporada = getTemporada(seasonId);
    if (posicion === 'all') return temporada.jugadores;
    
    const posicionesMap = {
        'goalkeeper': ['Portero'],
        'defender': ['Lateral Derecho', 'Lateral Izquierdo', 'Central'],
        'midfielder': ['Mediocentro Defensivo', 'Centrocampista', 'Mediocentro', 'Mediapunta'],
        'forward': ['Delantero Centro', 'Extremo Derecho', 'Extremo Izquierdo', 'Delantero']
    };
    
    return temporada.jugadores.filter(j => posicionesMap[posicion]?.includes(j.posicion));
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return {
        dia: fecha.getDate(),
        mes: meses[fecha.getMonth()],
        mesCorto: meses[fecha.getMonth()].substring(0, 3).toUpperCase(),
        año: fecha.getFullYear(),
        completa: `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`
    };
}

// Exportar
window.CLUB_DATA = CLUB_DATA;
window.getTemporada = getTemporada;
window.getJugadorById = getJugadorById;
window.getJugadoresByPosicion = getJugadoresByPosicion;
window.formatearFecha = formatearFecha;
