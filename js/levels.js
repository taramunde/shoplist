// levels.js
const LEVELS = [];

// Definición de niveles (matrices 6x6)
// 0=vacío, 1=arriba, 2=abajo, 3=izquierda, 4=derecha
const levelData = [
    // Nivel 1 (Fácil)
    [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,1,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    // Nivel 2
    [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,1,4,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    // Nivel 3
    [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,3,1,4,0,0],
        [0,0,0,2,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    // Nivel 4
    [
        [0,0,0,0,0,0],
        [0,0,3,0,0,0],
        [0,4,1,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ],
    // Nivel 5
    [
        [0,0,0,0,0,0],
        [0,0,4,0,0,0],
        [0,3,1,0,0,0],
        [0,0,2,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ]
];

// Generar los niveles con metadatos
levelData.forEach((data, index) => {
    LEVELS.push({
        id: index + 1,
        board: data,
        // Asigna una imagen de jugador (cambia los nombres según tus archivos)
        image: `assets/${(index % 5) + 1}.jpg`,
        playerName: `Jugador ${index + 1}`
    });
});
