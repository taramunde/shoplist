/* ===================================
   APLICACIÓN - RENDERIZADO DINÁMICO
   =================================== */

const App = {
    temporadaActiva: null,
    
    init: function() {
        this.temporadaActiva = CLUB_DATA.temporadaActual;
        this.renderClasificacion();
        this.renderCalendario();
        this.renderPlantillaHome();
        this.renderNoticias();
        this.renderPatrocinadores();
        this.renderProximoPartido();
        this.renderSeasonSelector();
        this.renderEstadisticasEquipo();
        this.renderPlantillaCompleta();
        this.renderCuerpoTecnico();
        this.renderFichaJugador();
    },

    // ===================================
    // SELECTOR DE TEMPORADA
    // ===================================
    renderSeasonSelector: function() {
        const container = document.getElementById('seasonSelector');
        if (!container) return;
        let html = '<div class="season-tabs">';
        CLUB_DATA.temporadasDisponibles.forEach(temp => {
            const activeClass = temp.id === this.temporadaActiva ? 'active' : '';
            const currentBadge = temp.actual ? '<span class="current-badge">Actual</span>' : '';
            html += `<button class="season-tab ${activeClass}" data-season="${temp.id}">${temp.nombre} ${currentBadge}</button>`;
        });
        html += '</div>';
        container.innerHTML = html;
        container.querySelectorAll('.season-tab').forEach(tab => {
            tab.addEventListener('click', (e) => { this.changeSeason(e.currentTarget.dataset.season); });
        });
    },

    changeSeason: function(seasonId) {
        this.temporadaActiva = seasonId;
        document.querySelectorAll('.season-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.season === seasonId);
        });
        this.renderEstadisticasEquipo();
        this.renderPlantillaCompleta();
        this.renderCuerpoTecnico();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ===================================
    // CLASIFICACIÓN
    // ===================================
    renderClasificacion: function() {
        const container = document.getElementById('clasificacionBody');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva || CLUB_DATA.temporadaActual);
        const filasVisibles = 5;
        let html = '';
        temporada.clasificacion.forEach((equipo, index) => {
            const highlightClass = equipo.destacado ? 'highlight' : '';
            const hiddenClass = index >= filasVisibles ? 'hidden-row' : '';
            const badgeHtml = equipo.logo ? `<img src="${equipo.logo}" alt="${equipo.siglas}" class="team-badge-img">` : `<span class="team-badge-text">${equipo.siglas}</span>`;
            html += `<tr class="${highlightClass} ${hiddenClass}"><td>${equipo.posicion}</td><td><div class="team-cell"><span class="team-badge">${badgeHtml}</span>${equipo.nombre}</div></td><td>${equipo.puntos}</td><td>${equipo.jugados}</td><td>${equipo.gfavor}</td><td>${equipo.gcontra}</td><td>${equipo.dg}</td></tr>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // CALENDARIO
    // ===================================
    renderCalendario: function() {
        const container = document.getElementById('calendarioList');
        if (!container) return;
        let html = '';
        CLUB_DATA.calendario.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            const nextClass = partido.esProximo ? 'next' : '';
            html += `<div class="match-item ${nextClass}"><div class="match-date-box"><span class="day">${fecha.dia}</span><span class="month">${fecha.mesCorto}</span></div><div class="match-detail"><div class="teams"><span class="home-team">${partido.local}</span><span class="vs">-</span><span class="away-team">${partido.visitante}</span></div><div class="match-meta"><span><i class="far fa-clock"></i> ${partido.hora}</span><span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span></div></div></div>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // PLANTILLA HOME
    // ===================================
    renderPlantillaHome: function() {
        const container = document.getElementById('plantillaHomeGrid');
        if (!container) return;
        const temporada = getTemporada(CLUB_DATA.temporadaActual);
        const posicionesMap = {
            'Portero': 'goalkeeper',
            'Lateral Derecho': 'defender', 'Lateral Izquierdo': 'defender', 'Central': 'defender',
            'Mediocentro Defensivo': 'midfielder', 'Centrocampista': 'midfielder', 'Mediocentro': 'midfielder', 'Mediapunta': 'midfielder',
            'Delantero Centro': 'forward', 'Extremo Derecho': 'forward', 'Extremo Izquierdo': 'forward', 'Delantero': 'forward'
        };
        let html = '';
        temporada.jugadores.slice(0, 8).forEach(jugador => {
            html += `<div class="player-card" data-position="${posicionesMap[jugador.posicion] || 'all'}"><a href="ficha-jugador.html?id=${jugador.id}&season=${CLUB_DATA.temporadaActual}"><div class="player-image"><img src="${jugador.imagen}" alt="${jugador.nombreCompleto}"><span class="player-number">${jugador.dorsal}</span></div><div class="player-info"><span class="player-position">${jugador.posicion}</span><h4 class="player-name">${jugador.nombreCompleto}</h4></div></a></div>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // NOTICIAS, PATROCINADORES, PROXIMO PARTIDO
    // ===================================
    renderNoticias: function() {
        const container = document.getElementById('noticiasGrid');
        if (!container) return;
        let html = '';
        CLUB_DATA.noticias.forEach(noticia => {
            const mainClass = noticia.esPrincipal ? 'main-news' : '';
            const fecha = formatearFecha(noticia.fecha);
            html += `<article class="news-card ${mainClass}"><a href="#" class="news-link"><div class="news-image"><img src="${noticia.imagen}" alt="${noticia.titulo}"><span class="news-category">${noticia.categoria}</span></div><div class="news-content"><h3>${noticia.titulo}</h3>${noticia.esPrincipal ? `<p>${noticia.resumen}</p>` : ''}<span class="news-date">${fecha.dia} ${fecha.mes} ${fecha.año}</span></div></a></article>`;
        });
        container.innerHTML = html;
    },
    
    renderPatrocinadores: function() {
        const container = document.getElementById('patrocinadoresGrid');
        if (!container) return;
        let html = '';
        CLUB_DATA.patrocinadores.forEach(pat => { html += `<div class="sponsor-item"><div class="sponsor-logo"><span>${pat.nombre}</span></div></div>`; });
        container.innerHTML = html;
    },

    renderProximoPartido: function() {
        const container = document.getElementById('heroMatch');
        if (!container) return;
        const partido = CLUB_DATA.proximoPartido;
        const fecha = formatearFecha(partido.fecha);
        container.innerHTML = `
            <div class="match-competition">
                <span class="competition-badge">${partido.competicion} - Jornada ${partido.jornada}</span>
                <span class="match-date"><i class="far fa-calendar"></i> Domingo ${fecha.dia} ${fecha.mes} ${fecha.año}<i class="far fa-clock"></i> ${partido.hora}h</span>
            </div>
            <div class="match-teams">
                <div class="team home"><div class="team-logo-large"><span>${partido.localSiglas}</span></div><span class="team-name-large">${partido.local}</span></div>
                <div class="match-vs"><span>VS</span></div>
                <div class="team away"><div class="team-logo-large away-logo"><span>${partido.visitanteSiglas}</span></div><span class="team-name-large">${partido.visitante}</span></div>
            </div>
            <div class="match-info"><p><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</p></div>
            <div class="match-actions"><a href="#" class="btn-primary"><i class="fas fa-ticket-alt"></i> Comprar Entradas</a><a href="#" class="btn-secondary"><i class="fas fa-tv"></i> Ver Directo</a></div>`;
    },

    // ===================================
    // ESTADISTICAS Y PLANTILLA COMPLETA
    // ===================================
    renderEstadisticasEquipo: function() {
        const container = document.getElementById('teamStatsGrid');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva);
        const stats = temporada.estadisticasEquipo;
        container.innerHTML = `
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-number">${stats.posicion}º</div><div class="stat-label">Posición</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-futbol"></i></div><div class="stat-number">${stats.golesFavor}</div><div class="stat-label">Goles Favor</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-shield-alt"></i></div><div class="stat-number">${stats.golesContra}</div><div class="stat-label">Goles Contra</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-number">${stats.victorias}</div><div class="stat-label">Victorias</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-handshake"></i></div><div class="stat-number">${stats.empates}</div><div class="stat-label">Empates</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-times-circle"></i></div><div class="stat-number">${stats.derrotas}</div><div class="stat-label">Derrotas</div></div>`;
    },

    renderPlantillaCompleta: function() {
        const container = document.getElementById('plantillaCompleta');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva);
        const posiciones = {'Porteros': ['Portero'], 'Defensas': ['Lateral Derecho', 'Lateral Izquierdo', 'Central'], 'Centrocampistas': ['Mediocentro Defensivo', 'Centrocampista', 'Mediocentro', 'Mediapunta'], 'Delanteros': ['Delantero Centro', 'Extremo Derecho', 'Extremo Izquierdo', 'Delantero']};
        const iconos = {'Porteros': 'fa-hand-paper', 'Defensas': 'fa-shield-alt', 'Centrocampistas': 'fa-sync-alt', 'Delanteros': 'fa-bullseye'};
        let html = '';
        for (const [nombrePosicion, posicionesLista] of Object.entries(posiciones)) {
            const jugadoresPosicion = temporada.jugadores.filter(j => posicionesLista.includes(j.posicion));
            if (jugadoresPosicion.length === 0) continue;
            html += `<div class="position-group"><h3 class="position-title"><span class="position-icon"><i class="fas ${iconos[nombrePosicion]}"></i></span>${nombrePosicion}</h3><div class="squad-grid">`;
            jugadoresPosicion.forEach(jugador => { html += this.renderJugadorCard(jugador); });
            html += `</div></div>`;
        }
        container.innerHTML = html;
    },

    renderJugadorCard: function(jugador) {
        return `<article class="squad-card"><a href="ficha-jugador.html?id=${jugador.id}&season=${this.temporadaActiva}" class="squad-link"><div class="squad-image"><img src="${jugador.imagen}" alt="${jugador.nombreCompleto}"><span class="squad-number">${jugador.dorsal}</span><div class="squad-overlay"><span class="view-profile">Ver ficha</span></div></div><div class="squad-info"><h4 class="squad-name">${jugador.nombreCompleto}</h4><span class="squad-position">${jugador.posicion}</span><div class="squad-meta"><span><i class="far fa-calendar"></i> ${jugador.edad} años</span><span><i class="fas fa-ruler-vertical"></i> ${jugador.altura}m</span></div><div class="squad-stats"><div class="mini-stat"><span class="mini-stat-value">${jugador.stats.partidos}</span><span class="mini-stat-label">Partidos</span></div><div class="mini-stat"><span class="mini-stat-value">${jugador.stats.goles}</span><span class="mini-stat-label">Goles</span></div></div></div></a></article>`;
    },

    renderCuerpoTecnico: function() {
        const container = document.getElementById('cuerpoTecnicoGrid');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva);
        let html = '';
        temporada.cuerpoTecnico.forEach(miembro => {
            const mainClass = miembro.esPrincipal ? 'main-coach' : '';
            html += `<article class="coach-card ${mainClass}"><div class="coach-image"><img src="${miembro.imagen}" alt="${miembro.nombre}"></div><div class="coach-info"><span class="coach-role">${miembro.cargo}</span><h3 class="coach-name">${miembro.nombre}</h3><p class="coach-bio">${miembro.descripcion}</p>${miembro.estadisticas ? `<div class="coach-stats"><div class="coach-stat"><span class="coach-stat-value">${miembro.estadisticas.partidos}</span><span class="coach-stat-label">Partidos</span></div><div class="coach-stat"><span class="coach-stat-value">${Math.round(miembro.estadisticas.victorias / miembro.estadisticas.partidos * 100)}%</span><span class="coach-stat-label">Victorias</span></div></div>` : ''}</div></article>`;
        });
        container.innerHTML = html;
    },

        // ===================================
    // FICHA JUGADOR (ACTUALIZADO)
    // ===================================
    renderFichaJugador: function() {
        const container = document.getElementById('fichaJugadorContent');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const jugadorId = urlParams.get('id') || 13;
        const seasonId = urlParams.get('season') || CLUB_DATA.temporadaActual;
        
        const jugador = getJugadorById(jugadorId, seasonId);
        if (!jugador) { container.innerHTML = '<p>Jugador no encontrado</p>'; return; }

        document.title = `${jugador.nombreCompleto} | ${CLUB_DATA.club.nombreCorto}`;
        
        // Actualizar Meta Tags para compartición (Open Graph)
        this.updateMetaTags(jugador);

        const breadcrumb = document.querySelector('.breadcrumb .current');
        if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;

        const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
        const haFallecido = jugador.fallecido === true;
        const fechaFallecimiento = jugador.fechaFallecimiento || null;

        let edadMostrar = jugador.edad;
        if (haFallecido && fechaFallecimiento && jugador.fechaNacimiento) {
            const nacimiento = new Date(jugador.fechaNacimiento);
            const muerte = new Date(fechaFallecimiento);
            let edadMuerte = muerte.getFullYear() - nacimiento.getFullYear();
            const m = muerte.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && muerte.getDate() < nacimiento.getDate())) edadMuerte--;
            edadMostrar = edadMuerte;
        }

        // Generar enlaces de compartir
        const pageUrl = window.location.href;
        const shareText = `Ficha de ${jugador.nombreCompleto} - ${CLUB_DATA.club.nombreCorto}`;
        
        const shareLinks = `
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}" target="_blank" class="player-social whatsapp" title="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social telegram" title="Compartir en Telegram"><i class="fab fa-telegram-plane"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social twitter" title="Compartir en Twitter"><i class="fab fa-twitter"></i></a>
        `;

        container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge"><span>${jugador.posicion}</span></div>
                    ${haFallecido ? '<div class="deceased-ribbon"></div>' : ''}
                </div>
            </div>
            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${jugador.posicion}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    <div class="player-social-links">
                        ${shareLinks}
                    </div>
                </div>
                <div class="player-quick-stats">
                    ${this.renderQuickStats(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual)}
                </div>
                <div class="player-season-stats">
                    <h3 class="stats-title">Temporada ${seasonId.replace('-', '/')}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-futbol"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.goles}</span><span class="season-stat-label">Goles</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.asistencias}</span><span class="season-stat-label">Asistencias</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-running"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.partidos}</span><span class="season-stat-label">Partidos</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-clock"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span><span class="season-stat-label">Minutos</span></div></div>
                    </div>
                </div>
            </div>
        `;

        this.renderFichaOverview(jugador);
        this.renderFichaMatches(jugador, seasonId);
        this.renderFichaCareerHistory(jugador, seasonId);
    },

    // Nueva función para actualizar Meta Tags
    updateMetaTags: function(jugador) {
        // Título
        let metaTitle = document.querySelector('meta[property="og:title"]');
        if (!metaTitle) {
            metaTitle = document.createElement('meta');
            metaTitle.setAttribute('property', 'og:title');
            document.head.appendChild(metaTitle);
        }
        metaTitle.setAttribute('content', `${jugador.nombreCompleto} - ${CLUB_DATA.club.nombreCorto}`);

        // Descripción
        let metaDesc = document.querySelector('meta[property="og:description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('property', 'og:description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Ficha del jugador ${jugador.nombreCompleto}, ${jugador.posicion}. Temporada actual y estadísticas.`);

        // Imagen (La importante para ver la foto al compartir)
        let metaImage = document.querySelector('meta[property="og:image"]');
        if (!metaImage) {
            metaImage = document.createElement('meta');
            metaImage.setAttribute('property', 'og:image');
            document.head.appendChild(metaImage);
        }
        metaImage.setAttribute('content', jugador.imagen);

        // URL
        let metaUrl = document.querySelector('meta[property="og:url"]');
        if (!metaUrl) {
            metaUrl = document.createElement('meta');
            metaUrl.setAttribute('property', 'og:url');
            document.head.appendChild(metaUrl);
        }
        metaUrl.setAttribute('content', window.location.href);
    },

    renderQuickStats: function(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual) {
        // ... (Mantener el código igual que en la respuesta anterior) ...
        const altura = jugador.altura ? `${jugador.altura}m` : 'Desconocida';
        let html = '';
        if (esTemporadaActual) {
            html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div>`;
        } else {
            if (haFallecido) {
                const fechaFormateada = fechaFallecimiento ? formatearFecha(fechaFallecimiento).completa : 'Fecha desconocida';
                html = `<div class="quick-stat"><span class="quick-stat-value deceased-text">${fechaFormateada}</span><span class="quick-stat-label">Fallecimiento</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div><div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div>`;
            } else {
                html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div>`;
            }
        }
        return html;
    },

    renderFichaOverview: function(jugador) {
        const container = document.getElementById('tabOverview');
        if (!container) return;
        const fechaNac = formatearFecha(jugador.fechaNacimiento);
        container.innerHTML = `
            <div class="overview-grid">
                <div class="performance-card">
                    <h3 class="card-title">Rendimiento Temporada</h3>
                    <div class="performance-stats">
                        <div class="performance-item"><div class="performance-header"><span>Goles por partido</span><span class="performance-value">${(jugador.stats.goles / jugador.stats.partidos).toFixed(2)}</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${(jugador.stats.goles / jugador.stats.partidos) * 100}%"></div></div></div>
                        <div class="performance-item"><div class="performance-header"><span>Minutos por partido</span><span class="performance-value">${Math.round(jugador.stats.minutos / jugador.stats.partidos)}'</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${(jugador.stats.minutos / jugador.stats.partidos / 90) * 100}%"></div></div></div>
                    </div>
                </div>
                <div class="personal-info-card">
                    <h3 class="card-title">Información Personal</h3>
                    <div class="personal-info-list">
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar"></i> Nacimiento</span><span class="info-value">${fechaNac.completa}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-map-marker-alt"></i> Lugar</span><span class="info-value">${jugador.lugarNacimiento}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-flag"></i> Nacionalidad</span><span class="info-value">${jugador.nacionalidad}</span></div>
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar-check"></i> En el club desde</span><span class="info-value">${jugador.enClubDesde}</span></div>
                    </div>
                </div>
                <div class="disciplinary-card">
                    <h3 class="card-title">Disciplina Temporada</h3>
                    <div class="cards-display">
                        <div class="card-item yellow"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.amarillas}</span><span class="card-label">Amarillas</span></div></div>
                        <div class="card-item red"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.rojas}</span><span class="card-label">Rojas</span></div></div>
                    </div>
                </div>
            </div>`;
    },

    renderFichaMatches: function(jugador, seasonId) {
        const container = document.getElementById('tabMatches');
        if (!container) return;
        const temporada = getTemporada(seasonId);
        if (!temporada.partidosJugados || temporada.partidosJugados.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#666; padding: 20px;">No hay datos de partidos para esta temporada.</p>';
            return;
        }
        let html = '<div class="matches-list">';
        temporada.partidosJugados.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            let resultClass = partido.resultado === 'V' ? 'win' : (partido.resultado === 'E' ? 'draw' : 'loss');
            html += `<article class="match-detail-card"><div class="match-detail-header"><div class="match-date-badge ${resultClass}"><span class="match-day">${fecha.dia}</span><span class="match-month">${fecha.mesCorto}</span></div><div class="match-competition-info"><span class="competition-name">${temporada.competicion} - Jornada ${partido.jornada}</span><div class="match-teams-result"><span class="team-home">${partido.local}</span><span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}</span><span class="team-away">${partido.visitante}</span></div></div></div></article>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    renderFichaCareerHistory: function(jugadorActual, currentSeasonId) {
        const container = document.getElementById('tabCareer');
        if (!container) return;
        const historial = [];
        let totales = { partidos: 0, goles: 0, asistencias: 0, amarillas: 0, rojas: 0, minutos: 0 };

        CLUB_DATA.temporadasDisponibles.forEach(temp => {
            const datosTemporada = CLUB_DATA.temporadas[temp.id];
            if (!datosTemporada) return;
            const jugadorEnTemporada = datosTemporada.jugadores.find(j => j.codigo === jugadorActual.codigo);
            if (jugadorEnTemporada) {
                historial.push({
                    temporada: temp.nombre,
                    temporadaId: temp.id,
                    equipo: CLUB_DATA.club.nombreCorto,
                    logo: datosTemporada.clasificacion.find(e => e.siglas === "SOC")?.logo || "https://picsum.photos/seed/real-oviedo-logo/60/60",
                    stats: jugadorEnTemporada.stats,
                    dorsal: jugadorEnTemporada.dorsal,
                    posicion: jugadorEnTemporada.posicion,
                    actual: temp.id === currentSeasonId
                });
                totales.partidos += jugadorEnTemporada.stats.partidos;
                totales.goles += jugadorEnTemporada.stats.goles;
                totales.asistencias += jugadorEnTemporada.stats.asistencias;
                totales.amarillas += jugadorEnTemporada.stats.amarillas;
                totales.rojas += jugadorEnTemporada.stats.rojas;
                totales.minutos += jugadorEnTemporada.stats.minutos;
            }
        });

        let timelineHtml = '';
        historial.forEach(h => {
            const currentClass = h.actual ? 'current' : '';
            const badgeHtml = h.logo ? `<img src="${h.logo}" alt="Logo" class="team-badge-img">` : `<span class="team-badge-text">SOC</span>`;
            timelineHtml += `<div class="timeline-item ${currentClass}"><div class="timeline-marker"></div><div class="timeline-content"><div class="timeline-header"><span class="timeline-club"><span class="team-badge">${badgeHtml}</span>${h.equipo}</span><span class="timeline-years">${h.temporada}</span></div><div class="timeline-position"><span class="pos-label"><i class="fas fa-tshirt"></i> #${h.dorsal}</span><span class="pos-name">${h.posicion}</span></div><div class="timeline-stats"><span><strong>${h.stats.partidos}</strong> Partidos</span><span><strong>${h.stats.goles}</strong> Goles</span><span><strong>${h.stats.asistencias}</strong> Asistencias</span></div></div></div>`;
        });

        let logrosHtml = '';
        if (jugadorActual.logros) jugadorActual.logros.forEach(l => { logrosHtml += `<div class="achievement"><i class="fas fa-trophy"></i><span>${l}</span></div>`; });

        container.innerHTML = `<div class="career-grid"><div class="career-timeline-card"><h3 class="card-title">Historial en el Club</h3><div class="timeline">${timelineHtml}</div></div><div class="career-totals-card"><h3 class="card-title">Totales en el Club</h3><div class="totals-grid"><div class="total-item"><span class="total-value">${totales.partidos}</span><span class="total-label">Partidos</span></div><div class="total-item highlight"><span class="total-value">${totales.goles}</span><span class="total-label">Goles</span></div><div class="total-item"><span class="total-value">${totales.asistencias}</span><span class="total-label">Asistencias</span></div></div>${logrosHtml ? `<div class="career-achievements"><h4>Logros</h4><div class="achievements-list">${logrosHtml}</div></div>` : ''}</div></div>`;
    }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
window.App = App;
