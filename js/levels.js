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
    let image, playerName;
    
    if (index === 0) {
        // Personalizamos el nivel 1
        image = 'assets/JuanCruz.png';   // ← Pon el nombre que le hayas dado
        playerName = 'Juan Cruz';        // ← El nombre que se mostrará
    } else {
        // Para el resto, usamos el ciclo automático (1.jpg, 2.jpg, ...)
        image = `assets/${(index % 5) + 1}.jpg`;
        playerName = `Jugador ${index + 1}`;
    }

    LEVELS.push({
        id: index + 1,
        board: data,
        image: image,
        playerName: playerName
    });
});
