(function () {
    'use strict';

    const { createApp, ref, reactive, computed, watch, onMounted, nextTick } = Vue;

    // Everything lives on this device. Keys are prefixed so this app doesn't clash with the
    // Google Sheets version of Taboo if both are served from the same origin.
    const STORAGE = {
        cards: 'tabooGame.cards',
        settings: 'tabooGame.settings',
        players: 'tabooGame.players'
    };
    const DEFAULT_DECK = 'Standard';

    const translations = {
        en: {
            gameTitle: "Taboo",
            tabPlay: "Play",
            tabCards: "Cards",
            tabSettings: "Settings",
            chooseDeck: "Choose a deck",
            cards: "cards",
            noDecks: "No decks yet. Create one on the Cards tab, or import a JSON file in Settings.",
            options: "Game Options",
            uiLanguage: "Language",
            turnDuration: "Turn duration",
            breakDuration: "Pause after each card",
            untilContinue: "Until tap",
            returnSkipped: "Return skipped cards to deck",
            returnTaboo: "Return taboo cards to deck",
            soundEffects: "Countdown beeps and buzzer",
            rulesSummaryTurn: "{s}s turns",
            rulesSummaryPause: "{s}s pause",
            rulesSummaryTap: "tap to continue",
            change: "Change",
            addPlayers: "Players or teams",
            inputPlaceholder: "Add a player or team",
            addBtn: "Add",
            moveUp: "Move up",
            noPlayers: "Add at least one player or team.",
            startBtn: "Start Game",
            needDeck: "Choose a deck",
            needPlayers: "Add players",
            data: "Data",
            noDecksEditor: "No decks yet. Tap New to create one, or import a JSON file in Settings.",
            dataStoredLocally: "Your decks are saved on this device only. Export them to keep a backup or to move them to another device.",
            importDecks: "Import decks (JSON)",
            importTitle: "Import decks",
            importConfirm: "Import {n} cards in {decks} deck(s)? Cards that already exist in the same deck (same word) are replaced.",
            importBtn: "Import",
            importInvalid: "This file doesn't contain any Taboo cards.",
            imported: "Imported {n} cards",
            deleteDeck: "Delete deck",
            deleteDeckConfirm: "Delete the deck \"{deck}\" and its {n} cards? This can't be undone.",
            deckDeleted: "Deck deleted",
            storageFailed: "Couldn't save on this device. The browser's storage may be full or turned off.",
            exportDecks: "Export all decks (JSON)",
            exported: "Exported {n} cards",
            selectDeckLabel: "Select a deck",
            deckLabel: "Deck",
            newDeckOption: "New",
            newDeckNameLabel: "New deck",
            newDeckMessage: "The deck is saved when you add its first card.",
            newDeckPlaceholder: "e.g., Movies, Kids",
            deckExists: "A deck with this name already exists.",
            previewDeck: "Preview",
            searchPlaceholder: "Search cards",
            noCards: "No cards in this deck yet.",
            noMatches: "No matching cards.",
            addNewCardTitle: "New card",
            editCardTitle: "Edit card",
            targetWordLabel: "Target word",
            wordPlaceholder: "e.g., COMPUTER",
            difficultyLabel: "Difficulty",
            tabooWordsLabel: "Taboo words",
            tabooPlaceholder: "Taboo word",
            addTabooWord: "Add taboo word",
            saveCardBtn: "Save card",
            previewBtn: "Preview",
            deleteBtn: "Delete",
            deleteConfirm: "Delete the card \"{word}\"?",
            cardSaved: "Card saved",
            cardDeleted: "Card deleted",
            missingWord: "Please enter a target word.",
            duplicateWord: "This target word already exists in this deck.",
            duplicateTaboo: "Each taboo word must be unique.",
            errorTitle: "Something went wrong",
            cardOf: "Card {n} of {total}",
            draftPreview: "Preview",
            cardsRemaining: "Cards remaining:",
            passPhone: "Hand the phone to",
            tapWhenReady: "Tap when ready!",
            startTurn: "Start turn",
            tabooBtn: "Taboo −1",
            skipBtn: "Skip",
            correctBtn: "Correct!",
            timesUp: "Time's up!",
            endTurnText: "End of",
            passTo: "Pass to {name}",
            endGame: "End game",
            endGameConfirm: "End the game now and see the final scores?",
            gameEndedEarly: "Game ended.",
            gameOver: "Game over!",
            playAgain: "Play again",
            backToMenu: "Back to menu",
            diffEasy: "Easy",
            diffMed: "Medium",
            diffHard: "Hard",
            deckEmpty: "The card deck is completely empty!",
            allPlayed: "All cards have been played!",
            verifyAction: "Your last call:",
            actionCorrect: "Correct (+{n})",
            actionTaboo: "Taboo! (−1)",
            actionSkip: "Skipped (0)",
            actionUnfinished: "Time ran out",
            turnCards: "Cards this turn",
            lastTurnCards: "Last turn",
            hiddenCard: "Hidden card",
            backInDeck: "Back in the deck",
            confirmActionBtn: "Next card",
            changeActionBtn: "Undo",
            breakMessage: "Continuing in",
            ok: "OK",
            cancel: "Cancel",
            close: "Close",
            prev: "Prev",
            next: "Next"
        },
        es: {
            gameTitle: "Tabú",
            tabPlay: "Jugar",
            tabCards: "Cartas",
            tabSettings: "Ajustes",
            chooseDeck: "Elige un mazo",
            cards: "cartas",
            noDecks: "Aún no hay mazos. Crea uno en la pestaña Cartas o importa un archivo JSON en Ajustes.",
            options: "Opciones del juego",
            uiLanguage: "Idioma",
            turnDuration: "Duración del turno",
            breakDuration: "Pausa después de cada carta",
            untilContinue: "Hasta tocar",
            returnSkipped: "Devolver cartas omitidas al mazo",
            returnTaboo: "Devolver cartas tabú al mazo",
            soundEffects: "Pitidos de cuenta regresiva y timbre",
            rulesSummaryTurn: "Turnos de {s}s",
            rulesSummaryPause: "pausa de {s}s",
            rulesSummaryTap: "tocar para seguir",
            change: "Cambiar",
            addPlayers: "Jugadores o equipos",
            inputPlaceholder: "Agrega un jugador o equipo",
            addBtn: "Añadir",
            moveUp: "Subir",
            noPlayers: "Agrega al menos un jugador o equipo.",
            startBtn: "Comenzar juego",
            needDeck: "Elige un mazo",
            needPlayers: "Agrega jugadores",
            data: "Datos",
            noDecksEditor: "Aún no hay mazos. Toca Nuevo para crear uno o importa un archivo JSON en Ajustes.",
            dataStoredLocally: "Tus mazos se guardan solo en este dispositivo. Expórtalos para tener una copia de seguridad o pasarlos a otro dispositivo.",
            importDecks: "Importar mazos (JSON)",
            importTitle: "Importar mazos",
            importConfirm: "¿Importar {n} cartas en {decks} mazo(s)? Las cartas que ya existen en el mismo mazo (misma palabra) se reemplazan.",
            importBtn: "Importar",
            importInvalid: "Este archivo no contiene cartas de Tabú.",
            imported: "{n} cartas importadas",
            deleteDeck: "Eliminar mazo",
            deleteDeckConfirm: "¿Eliminar el mazo \"{deck}\" y sus {n} cartas? No se puede deshacer.",
            deckDeleted: "Mazo eliminado",
            storageFailed: "No se pudo guardar en este dispositivo. El almacenamiento del navegador puede estar lleno o desactivado.",
            exportDecks: "Exportar todos los mazos (JSON)",
            exported: "{n} cartas exportadas",
            selectDeckLabel: "Selecciona un mazo",
            deckLabel: "Mazo",
            newDeckOption: "Nuevo",
            newDeckNameLabel: "Nuevo mazo",
            newDeckMessage: "El mazo se guarda al agregar su primera carta.",
            newDeckPlaceholder: "ej., Películas, Niños",
            deckExists: "Ya existe un mazo con este nombre.",
            previewDeck: "Vista previa",
            searchPlaceholder: "Buscar cartas",
            noCards: "Este mazo aún no tiene cartas.",
            noMatches: "No hay cartas que coincidan.",
            addNewCardTitle: "Nueva carta",
            editCardTitle: "Editar carta",
            targetWordLabel: "Palabra objetivo",
            wordPlaceholder: "ej., COMPUTADORA",
            difficultyLabel: "Dificultad",
            tabooWordsLabel: "Palabras tabú",
            tabooPlaceholder: "Palabra tabú",
            addTabooWord: "Agregar palabra tabú",
            saveCardBtn: "Guardar carta",
            previewBtn: "Vista previa",
            deleteBtn: "Eliminar",
            deleteConfirm: "¿Eliminar la carta \"{word}\"?",
            cardSaved: "Carta guardada",
            cardDeleted: "Carta eliminada",
            missingWord: "Ingresa una palabra objetivo.",
            duplicateWord: "Esta palabra ya existe en este mazo.",
            duplicateTaboo: "Cada palabra tabú debe ser única.",
            errorTitle: "Algo salió mal",
            cardOf: "Carta {n} de {total}",
            draftPreview: "Vista previa",
            cardsRemaining: "Cartas restantes:",
            passPhone: "Pasa el teléfono a",
            tapWhenReady: "¡Toca cuando estés listo!",
            startTurn: "Comenzar turno",
            tabooBtn: "Tabú −1",
            skipBtn: "Omitir",
            correctBtn: "¡Correcto!",
            timesUp: "¡Se acabó el tiempo!",
            endTurnText: "Fin del turno de",
            passTo: "Pasar a {name}",
            endGame: "Terminar juego",
            endGameConfirm: "¿Terminar el juego ahora y ver los puntajes finales?",
            gameEndedEarly: "Juego terminado.",
            gameOver: "¡Juego terminado!",
            playAgain: "Jugar de nuevo",
            backToMenu: "Volver al menú",
            diffEasy: "Fácil",
            diffMed: "Medio",
            diffHard: "Difícil",
            deckEmpty: "¡El mazo de cartas está completamente vacío!",
            allPlayed: "¡Todas las cartas han sido jugadas!",
            verifyAction: "Tu última jugada:",
            actionCorrect: "Correcto (+{n})",
            actionTaboo: "¡Tabú! (−1)",
            actionSkip: "Omitida (0)",
            actionUnfinished: "Se acabó el tiempo",
            turnCards: "Cartas de este turno",
            lastTurnCards: "Último turno",
            hiddenCard: "Carta oculta",
            backInDeck: "Volvió al mazo",
            confirmActionBtn: "Siguiente carta",
            changeActionBtn: "Deshacer",
            breakMessage: "Continuando en",
            ok: "OK",
            cancel: "Cancelar",
            close: "Cerrar",
            prev: "Anterior",
            next: "Siguiente"
        },
        pt: {
            gameTitle: "Tabu",
            tabPlay: "Jogar",
            tabCards: "Cartas",
            tabSettings: "Ajustes",
            chooseDeck: "Escolha um baralho",
            cards: "cartas",
            noDecks: "Ainda não há baralhos. Crie um na aba Cartas ou importe um arquivo JSON em Ajustes.",
            options: "Opções do jogo",
            uiLanguage: "Idioma",
            turnDuration: "Duração do turno",
            breakDuration: "Pausa após cada carta",
            untilContinue: "Até tocar",
            returnSkipped: "Retornar cartas puladas ao monte",
            returnTaboo: "Retornar cartas tabu ao monte",
            soundEffects: "Bipes de contagem regressiva e buzina",
            rulesSummaryTurn: "Turnos de {s}s",
            rulesSummaryPause: "pausa de {s}s",
            rulesSummaryTap: "tocar para seguir",
            change: "Mudar",
            addPlayers: "Jogadores ou equipes",
            inputPlaceholder: "Adicione um jogador ou equipe",
            addBtn: "Adicionar",
            moveUp: "Subir",
            noPlayers: "Adicione pelo menos um jogador ou equipe.",
            startBtn: "Iniciar jogo",
            needDeck: "Escolha um baralho",
            needPlayers: "Adicione jogadores",
            data: "Dados",
            noDecksEditor: "Ainda não há baralhos. Toque em Novo para criar um ou importe um arquivo JSON em Ajustes.",
            dataStoredLocally: "Seus baralhos ficam salvos apenas neste dispositivo. Exporte-os para ter um backup ou passá-los para outro dispositivo.",
            importDecks: "Importar baralhos (JSON)",
            importTitle: "Importar baralhos",
            importConfirm: "Importar {n} cartas em {decks} baralho(s)? Cartas que já existem no mesmo baralho (mesma palavra) são substituídas.",
            importBtn: "Importar",
            importInvalid: "Este arquivo não contém cartas de Tabu.",
            imported: "{n} cartas importadas",
            deleteDeck: "Excluir baralho",
            deleteDeckConfirm: "Excluir o baralho \"{deck}\" e suas {n} cartas? Isso não pode ser desfeito.",
            deckDeleted: "Baralho excluído",
            storageFailed: "Não foi possível salvar neste dispositivo. O armazenamento do navegador pode estar cheio ou desativado.",
            exportDecks: "Exportar todos os baralhos (JSON)",
            exported: "{n} cartas exportadas",
            selectDeckLabel: "Selecione um baralho",
            deckLabel: "Baralho",
            newDeckOption: "Novo",
            newDeckNameLabel: "Novo baralho",
            newDeckMessage: "O baralho é salvo quando você adiciona a primeira carta.",
            newDeckPlaceholder: "ex., Filmes, Infantil",
            deckExists: "Já existe um baralho com este nome.",
            previewDeck: "Visualizar",
            searchPlaceholder: "Buscar cartas",
            noCards: "Este baralho ainda não tem cartas.",
            noMatches: "Nenhuma carta encontrada.",
            addNewCardTitle: "Nova carta",
            editCardTitle: "Editar carta",
            targetWordLabel: "Palavra alvo",
            wordPlaceholder: "ex., COMPUTADOR",
            difficultyLabel: "Dificuldade",
            tabooWordsLabel: "Palavras tabu",
            tabooPlaceholder: "Palavra tabu",
            addTabooWord: "Adicionar palavra tabu",
            saveCardBtn: "Salvar carta",
            previewBtn: "Visualizar",
            deleteBtn: "Excluir",
            deleteConfirm: "Excluir a carta \"{word}\"?",
            cardSaved: "Carta salva",
            cardDeleted: "Carta excluída",
            missingWord: "Digite uma palavra alvo.",
            duplicateWord: "Esta palavra já existe neste baralho.",
            duplicateTaboo: "Cada palavra tabu deve ser única.",
            errorTitle: "Algo deu errado",
            cardOf: "Carta {n} de {total}",
            draftPreview: "Visualizar",
            cardsRemaining: "Cartas restantes:",
            passPhone: "Passe o celular para",
            tapWhenReady: "Toque quando estiver pronto!",
            startTurn: "Iniciar turno",
            tabooBtn: "Tabu −1",
            skipBtn: "Pular",
            correctBtn: "Correto!",
            timesUp: "O tempo acabou!",
            endTurnText: "Fim do turno de",
            passTo: "Passar para {name}",
            endGame: "Encerrar jogo",
            endGameConfirm: "Encerrar o jogo agora e ver a pontuação final?",
            gameEndedEarly: "Jogo encerrado.",
            gameOver: "Fim de jogo!",
            playAgain: "Jogar novamente",
            backToMenu: "Voltar ao menu",
            diffEasy: "Fácil",
            diffMed: "Médio",
            diffHard: "Difícil",
            deckEmpty: "O monte de cartas está completamente vazio!",
            allPlayed: "Todas as cartas foram jogadas!",
            verifyAction: "Sua última jogada:",
            actionCorrect: "Correto (+{n})",
            actionTaboo: "Tabu! (−1)",
            actionSkip: "Pulada (0)",
            actionUnfinished: "Tempo esgotado",
            turnCards: "Cartas deste turno",
            lastTurnCards: "Último turno",
            hiddenCard: "Carta oculta",
            backInDeck: "Voltou ao monte",
            confirmActionBtn: "Próxima carta",
            changeActionBtn: "Desfazer",
            breakMessage: "Continuando em",
            ok: "OK",
            cancel: "Cancelar",
            close: "Fechar",
            prev: "Anterior",
            next: "Próxima"
        }
    };

    // ---------------------------------------------------------------- helpers

    function load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    // Returns false if the value couldn't be saved (storage full or disabled).
    function store(key, value) {
        try {
            if (value === null || value === undefined) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    function downloadJson(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Accepts this app's export ({ decks: [{ name, cards: [...] }] }), or a plain list of cards
    // that each have a `deck`. Returns clean cards; anything without a word is dropped.
    function parseCards(data) {
        let raw = [];
        if (Array.isArray(data)) raw = data;
        else if (data && Array.isArray(data.decks)) {
            data.decks.forEach(d => {
                if (d && Array.isArray(d.cards)) d.cards.forEach(c => raw.push(Object.assign({}, c, { deck: d.name })));
            });
        } else if (data && Array.isArray(data.cards)) raw = data.cards;

        const cards = new Map(); // later duplicates win
        raw.forEach(c => {
            if (!c || typeof c !== 'object') return;
            const word = String(c.word ?? '').trim();
            if (!word) return;
            const deck = String(c.deck ?? '').trim() || DEFAULT_DECK;
            const taboo = [];
            (Array.isArray(c.taboo) ? c.taboo : String(c.taboo ?? '').split(',')).forEach(w => {
                w = String(w ?? '').trim();
                if (w && !taboo.some(x => x.toLowerCase() === w.toLowerCase())) taboo.push(w);
            });
            const difficulty = Math.min(3, Math.max(1, parseInt(c.difficulty, 10) || 1));
            cards.set(deck.toLowerCase() + '\n' + word.toLowerCase(), { word, taboo, difficulty, deck });
        });
        return [...cards.values()];
    }

    function shuffle(list) {
        const a = [...list];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function downloadJson(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }

    // Sounds are synthesized with Web Audio, so there are no files to download or cache.
    const sounds = (() => {
        let ctx = null;
        const context = () => {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!ctx && AudioCtx) ctx = new AudioCtx();
            return ctx;
        };
        const tone = (freq, start, duration, type = 'sine', volume = 0.3) => {
            const c = context();
            if (!c) return;
            const t0 = c.currentTime + start;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, t0);
            gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
            osc.connect(gain).connect(c.destination);
            osc.start(t0);
            osc.stop(t0 + duration + 0.05);
        };
        return {
            // Browsers (iOS especially) only let audio start during a tap, so call this from tap handlers.
            unlock() {
                const c = context();
                if (c && c.state !== 'running') c.resume();
                tone(440, 0, 0.01, 'sine', 0.0001);
            },
            warning() { tone(880, 0, 0.3); },
            countdown(isLast) { tone(isLast ? 1320 : 880, 0, isLast ? 0.35 : 0.15); },
            buzzer() {
                tone(146, 0, 0.9, 'sawtooth', 0.2);
                tone(151, 0, 0.9, 'sawtooth', 0.2);
            }
        };
    })();

    // ---------------------------------------------------------------- app

    createApp({
        setup() {
            const tab = ref('play');
            const screen = ref(null); // null = tabs; otherwise a game screen
            const toast = ref('');

            const allCards = ref(parseCards(load(STORAGE.cards, [])));

            const settings = reactive(Object.assign({
                lang: 'en',
                deck: '',
                turnDuration: 60,
                breakDuration: 0,
                returnSkipped: false,
                returnTaboo: false,
                sound: true
            }, load(STORAGE.settings, {})));

            const players = ref(load(STORAGE.players, []));
            const newPlayerName = ref('');
            const playerInputRef = ref(null);

            // Card editor
            const editorDeck = ref('');
            const pendingDeck = ref(''); // a new deck that has no cards saved yet
            const searchQuery = ref('');
            const tabooInputRefs = ref([]);
            const importInputRef = ref(null);
            const cardSheet = reactive({ show: false, originalWord: null, word: '', difficulty: 1, taboo: [] });
            const preview = reactive({ show: false, title: '', cards: [], index: 0 });

            const dialog = reactive({ show: false, type: 'alert', title: '', message: '', inputValue: '', placeholder: '', okText: '', danger: false, resolve: null });
            const dialogInputRef = ref(null);

            // Game
            const gameDeck = ref([]);
            const currentPlayerIndex = ref(0);
            const currentCard = ref(null);
            const timeLeft = ref(0);
            const timeFraction = ref(1);
            const breakTimeLeft = ref(0);
            const turnScoreEarned = ref(0);
            // Every card seen this turn: { card, action, scoreChange, playerIndex, returned }.
            // `returned` cards went back into the deck, so their words stay hidden until the game ends.
            const turnHistory = ref([]);
            const gameOverReason = ref('');

            let turnDeadline = 0;
            let turnRemainingMs = 0;
            let lastBeepSecond = null;
            let turnTicker = null;
            let breakTicker = null;
            let wakeLock = null;
            let toastTimer = null;

            // ------------------------------------------------------------ i18n

            const t = (key, params) => {
                let text = translations[settings.lang]?.[key] ?? translations.en[key] ?? key;
                if (params) {
                    Object.keys(params).forEach(k => { text = text.replace(`{${k}}`, params[k]); });
                }
                return text;
            };

            const difficultyName = (d) => d === 3 ? t('diffHard') : d === 2 ? t('diffMed') : t('diffEasy');
            const formatDelta = (n) => (n > 0 ? '+' : '') + n;
            const initials = (name) => String(name || '?').trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();

            // ------------------------------------------------------------ dialogs

            const openDialog = (options) => new Promise(resolve => {
                Object.assign(dialog, { type: 'alert', title: '', message: '', inputValue: '', placeholder: '', okText: '', danger: false }, options, { show: true, resolve });
                if (dialog.type === 'prompt') nextTick(() => dialogInputRef.value?.focus());
            });
            const showAlert = (title, message) => openDialog({ type: 'alert', title, message });
            const showConfirm = (title, message, extra) => openDialog(Object.assign({ type: 'confirm', title, message }, extra));
            const showPrompt = (title, message, placeholder) => openDialog({ type: 'prompt', title, message, placeholder });

            const closeDialog = (result) => {
                const resolve = dialog.resolve;
                dialog.show = false;
                dialog.resolve = null;
                if (resolve) resolve(dialog.type === 'prompt' ? (result ? dialog.inputValue : null) : result);
            };

            const showToast = (message) => {
                toast.value = message;
                clearTimeout(toastTimer);
                toastTimer = setTimeout(() => { toast.value = ''; }, 2200);
            };

            // ------------------------------------------------------------ cards data

            const setCards = (cards) => {
                allCards.value = cards;
                if (!store(STORAGE.cards, cards)) showAlert(t('errorTitle'), t('storageFailed'));
            };

            const uniqueDecks = computed(() => {
                const counts = {};
                allCards.value.forEach(c => { counts[c.deck] = (counts[c.deck] || 0) + 1; });
                return Object.keys(counts).sort((a, b) => a.localeCompare(b)).map(name => ({ name, count: counts[name] }));
            });

            // Same format the Google Sheets version of Taboo exports.
            const exportDecks = () => {
                const decks = uniqueDecks.value.map(d => ({
                    name: d.name,
                    cards: allCards.value
                        .filter(c => c.deck === d.name)
                        .sort((a, b) => String(a.word).localeCompare(String(b.word)))
                        .map(c => ({ word: String(c.word), difficulty: c.difficulty, taboo: [...c.taboo] }))
                }));
                downloadJson(`taboo-decks-${new Date().toISOString().slice(0, 10)}.json`, {
                    format: 'taboo-decks',
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    decks
                });
                showToast(t('exported', { n: allCards.value.length }));
            };

            const chooseImportFile = () => importInputRef.value?.click();

            // Imported cards are merged in: a card with the same word in the same deck is replaced.
            const importDecks = async (event) => {
                const file = event.target.files[0];
                event.target.value = ''; // so picking the same file again still fires change
                if (!file) return;
                let cards = [];
                try {
                    cards = parseCards(JSON.parse(await file.text()));
                } catch (e) { /* not JSON */ }
                if (!cards.length) return showAlert(t('importTitle'), t('importInvalid'));

                // Match deck names case-insensitively so "movies" lands in an existing "Movies".
                const deckNames = {};
                uniqueDecks.value.forEach(d => { deckNames[d.name.toLowerCase()] = d.name; });
                cards.forEach(c => { c.deck = deckNames[c.deck.toLowerCase()] || c.deck; });

                const deckCount = new Set(cards.map(c => c.deck)).size;
                const ok = await showConfirm(t('importTitle'), t('importConfirm', { n: cards.length, decks: deckCount }), { okText: t('importBtn') });
                if (!ok) return;

                const key = (c) => c.deck + '\n' + String(c.word).toLowerCase();
                const merged = new Map(allCards.value.map(c => [key(c), c]));
                cards.forEach(c => merged.set(key(c), c));
                setCards([...merged.values()]);
                showToast(t('imported', { n: cards.length }));
            };

            // ------------------------------------------------------------ play tab

            const addPlayer = () => {
                const name = newPlayerName.value.trim();
                if (!name) return;
                players.value.push({ name, score: 0 });
                newPlayerName.value = '';
                nextTick(() => playerInputRef.value?.focus());
            };
            const removePlayer = (index) => players.value.splice(index, 1);
            const movePlayer = (index, delta) => {
                const target = index + delta;
                if (target < 0 || target >= players.value.length) return;
                const list = players.value;
                [list[index], list[target]] = [list[target], list[index]];
            };

            const canStart = computed(() => players.value.length > 0 && uniqueDecks.value.some(d => d.name === settings.deck));
            const startHint = computed(() => !uniqueDecks.value.some(d => d.name === settings.deck) ? t('needDeck') : t('needPlayers'));
            const rulesSummary = computed(() => {
                const parts = [t('rulesSummaryTurn', { s: settings.turnDuration })];
                parts.push(settings.breakDuration ? t('rulesSummaryPause', { s: settings.breakDuration }) : t('rulesSummaryTap'));
                return parts.join(' · ');
            });

            // ------------------------------------------------------------ cards tab

            const editorDecks = computed(() => {
                const names = uniqueDecks.value.map(d => d.name);
                if (pendingDeck.value && !names.includes(pendingDeck.value)) names.push(pendingDeck.value);
                return names;
            });

            const deckCards = computed(() => allCards.value.filter(c => c.deck === editorDeck.value));

            const editorCards = computed(() => {
                const q = searchQuery.value.trim().toLowerCase();
                const list = deckCards.value.filter(c => !q ||
                    String(c.word).toLowerCase().includes(q) ||
                    c.taboo.some(w => w.toLowerCase().includes(q)));
                return list.sort((a, b) => String(a.word).localeCompare(String(b.word)));
            });

            const createDeck = async () => {
                const name = ((await showPrompt(t('newDeckNameLabel'), t('newDeckMessage'), t('newDeckPlaceholder'))) || '').trim();
                if (!name) return;
                if (uniqueDecks.value.some(d => d.name.toLowerCase() === name.toLowerCase())) {
                    await showAlert(t('newDeckNameLabel'), t('deckExists'));
                    return;
                }
                pendingDeck.value = name;
                editorDeck.value = name;
                openCard(null);
            };

            const openCard = (card) => {
                tabooInputRefs.value = [];
                Object.assign(cardSheet, card
                    ? { originalWord: card.word, word: card.word, difficulty: card.difficulty, taboo: card.taboo.length ? [...card.taboo] : [''] }
                    : { originalWord: null, word: '', difficulty: 1, taboo: ['', '', ''] },
                    { show: true });
            };
            const closeCardSheet = () => { cardSheet.show = false; };

            const addTabooField = () => {
                if (cardSheet.taboo.length >= 5) return;
                cardSheet.taboo.push('');
                nextTick(() => tabooInputRefs.value[cardSheet.taboo.length - 1]?.focus());
            };

            const saveCard = () => {
                const word = String(cardSheet.word).trim();
                const taboo = cardSheet.taboo.map(w => String(w).trim()).filter(Boolean);
                if (!word) return showAlert(t('editCardTitle'), t('missingWord'));

                const original = cardSheet.originalWord ? String(cardSheet.originalWord).toLowerCase() : null;
                const duplicate = deckCards.value.some(c => {
                    const w = String(c.word).toLowerCase();
                    return w === word.toLowerCase() && w !== original;
                });
                if (duplicate) return showAlert(t('editCardTitle'), t('duplicateWord'));
                if (new Set(taboo.map(w => w.toLowerCase())).size !== taboo.length) {
                    return showAlert(t('editCardTitle'), t('duplicateTaboo'));
                }

                const card = { word, taboo, difficulty: cardSheet.difficulty, deck: editorDeck.value };
                const cards = [...allCards.value];
                const index = original === null ? -1
                    : cards.findIndex(c => c.deck === editorDeck.value && String(c.word).toLowerCase() === original);
                if (index >= 0) cards[index] = card;
                else cards.push(card);
                setCards(cards);
                cardSheet.show = false;
                showToast(t('cardSaved'));
            };

            const deleteCard = async () => {
                const word = String(cardSheet.originalWord);
                const ok = await showConfirm(t('deleteBtn'), t('deleteConfirm', { word: word.toUpperCase() }), { danger: true, okText: t('deleteBtn') });
                if (!ok) return;
                setCards(allCards.value.filter(c => !(c.deck === editorDeck.value && String(c.word).toLowerCase() === word.toLowerCase())));
                cardSheet.show = false;
                showToast(t('cardDeleted'));
            };

            const deleteDeck = async () => {
                const deck = editorDeck.value;
                if (deckCards.value.length) {
                    const ok = await showConfirm(t('deleteDeck'), t('deleteDeckConfirm', { deck, n: deckCards.value.length }), { danger: true, okText: t('deleteBtn') });
                    if (!ok) return;
                }
                if (pendingDeck.value === deck) pendingDeck.value = '';
                setCards(allCards.value.filter(c => c.deck !== deck));
                editorDeck.value = '';
                showToast(t('deckDeleted'));
            };

            // ------------------------------------------------------------ previews

            const previewCard = computed(() => preview.cards[preview.index] || { word: '', difficulty: 1, taboo: [] });

            const previewDraft = () => {
                Object.assign(preview, {
                    show: true,
                    title: t('draftPreview'),
                    index: 0,
                    cards: [{
                        word: cardSheet.word.trim() || t('targetWordLabel'),
                        difficulty: cardSheet.difficulty,
                        taboo: cardSheet.taboo.map((w, i) => w.trim() || `${t('tabooPlaceholder')} ${i + 1}`)
                    }]
                });
            };

            const previewDeck = () => {
                Object.assign(preview, { show: true, title: editorDeck.value, index: 0, cards: [...editorCards.value] });
            };

            const stepPreview = (delta) => {
                const n = preview.cards.length;
                preview.index = (preview.index + delta + n) % n;
            };

            let swipeStartX = null;
            const onSwipeStart = (e) => { swipeStartX = e.changedTouches[0].clientX; };
            const onSwipeEnd = (e) => {
                if (swipeStartX === null || preview.cards.length < 2) return;
                const dx = e.changedTouches[0].clientX - swipeStartX;
                swipeStartX = null;
                if (Math.abs(dx) > 50) stepPreview(dx < 0 ? 1 : -1);
            };

            // ------------------------------------------------------------ game

            const currentPlayer = computed(() => players.value[currentPlayerIndex.value] || { name: '' });
            const nextPlayerName = computed(() => {
                if (!players.value.length) return '';
                return players.value[(currentPlayerIndex.value + 1) % players.value.length].name;
            });
            const sortedPlayers = computed(() => [...players.value].sort((a, b) => b.score - a.score));
            const resultText = (entry) => {
                if (!entry) return '';
                if (entry.action === 'taboo') return t('actionTaboo');
                if (entry.action === 'skip') return t('actionSkip');
                if (entry.action === 'unfinished') return t('actionUnfinished');
                return t('actionCorrect', { n: entry.card.difficulty });
            };
            const lastAction = computed(() => turnHistory.value[turnHistory.value.length - 1] || null);
            const actionText = computed(() => resultText(lastAction.value));
            const isHidden = (entry) => entry.returned && screen.value !== 'game_over';

            const requestWakeLock = async () => {
                try {
                    if ('wakeLock' in navigator && !wakeLock) {
                        wakeLock = await navigator.wakeLock.request('screen');
                        wakeLock.addEventListener('release', () => { wakeLock = null; });
                    }
                } catch (e) { /* not supported or denied */ }
            };
            const releaseWakeLock = () => {
                if (wakeLock) wakeLock.release();
                wakeLock = null;
            };

            // The turn clock counts down from a deadline so it stays accurate if the phone lags.
            const tickTurn = () => {
                const ms = Math.max(0, turnDeadline - Date.now());
                const seconds = Math.ceil(ms / 1000);
                timeLeft.value = seconds;
                timeFraction.value = ms / (settings.turnDuration * 1000);
                // Beep once as the clock reaches 15, then 5, 4, 3, 2, 1. lastBeepSecond stops a
                // repeat when the clock resumes after a pause on the same second.
                if (seconds !== lastBeepSecond && (seconds === 15 || (seconds >= 1 && seconds <= 5))) {
                    lastBeepSecond = seconds;
                    if (settings.sound) seconds === 15 ? sounds.warning() : sounds.countdown(seconds === 1);
                }
                if (ms <= 0) endTurn();
            };
            const runTurnClock = (ms) => {
                clearInterval(turnTicker);
                turnDeadline = Date.now() + ms;
                tickTurn();
                turnTicker = setInterval(tickTurn, 200);
            };
            const pauseTurnClock = () => {
                clearInterval(turnTicker);
                turnTicker = null;
                turnRemainingMs = Math.max(0, turnDeadline - Date.now());
            };
            const stopClocks = () => {
                clearInterval(turnTicker);
                clearInterval(breakTicker);
                turnTicker = breakTicker = null;
            };

            const startGame = () => {
                if (!canStart.value) return;
                const filtered = allCards.value.filter(c => c.deck === settings.deck);
                if (!filtered.length) return showAlert(t('chooseDeck'), t('deckEmpty'));
                gameDeck.value = shuffle(filtered);
                players.value.forEach(p => { p.score = 0; });
                currentPlayerIndex.value = 0;
                turnScoreEarned.value = 0;
                turnHistory.value = [];
                screen.value = 'turn_intro';
                requestWakeLock();
            };

            const drawCard = () => {
                if (!gameDeck.value.length) {
                    triggerGameOver(t('allPlayed'));
                    return false;
                }
                currentCard.value = gameDeck.value.pop();
                return true;
            };

            const unlockSound = () => { if (settings.sound) sounds.unlock(); };
            const previewSound = () => {
                if (!settings.sound) return;
                sounds.unlock();
                sounds.countdown(false);
            };

            const startTurn = () => {
                unlockSound();
                lastBeepSecond = null;
                turnHistory.value = [];
                if (!drawCard()) return;
                screen.value = 'gameplay';
                runTurnClock(settings.turnDuration * 1000);
            };

            const handleCardAction = (action) => {
                unlockSound();
                pauseTurnClock();
                const card = currentCard.value;
                let scoreChange = 0;
                let returnedCard = false;

                if (action === 'correct') {
                    scoreChange = card.difficulty;
                    vibrate(40);
                } else if (action === 'taboo') {
                    scoreChange = -1;
                    returnedCard = settings.returnTaboo;
                    vibrate([60, 40, 60]);
                } else {
                    returnedCard = settings.returnSkipped;
                    vibrate(20);
                }
                players.value[currentPlayerIndex.value].score += scoreChange;
                turnScoreEarned.value += scoreChange;
                if (returnedCard) gameDeck.value.unshift(card);

                turnHistory.value.push({ card, action, scoreChange, playerIndex: currentPlayerIndex.value, returned: returnedCard });
                screen.value = 'break';

                if (settings.breakDuration > 0) {
                    const breakDeadline = Date.now() + settings.breakDuration * 1000;
                    breakTimeLeft.value = settings.breakDuration;
                    breakTicker = setInterval(() => {
                        const ms = breakDeadline - Date.now();
                        breakTimeLeft.value = Math.max(0, Math.ceil(ms / 1000));
                        if (ms <= 0) proceedFromBreak();
                    }, 200);
                }
            };

            const proceedFromBreak = () => {
                clearInterval(breakTicker);
                breakTicker = null;
                if (!gameDeck.value.length) {
                    triggerGameOver(t('deckEmpty'));
                    return;
                }
                // No point drawing a card nobody has time to try.
                if (turnRemainingMs < 500) {
                    endTurn(false);
                    return;
                }
                drawCard();
                screen.value = 'gameplay';
                runTurnClock(turnRemainingMs);
            };

            const undoLastAction = () => {
                const last = lastAction.value;
                if (screen.value !== 'break' || !last) return;
                clearInterval(breakTicker);
                breakTicker = null;
                players.value[last.playerIndex].score -= last.scoreChange;
                turnScoreEarned.value -= last.scoreChange;
                if (last.returned) gameDeck.value.shift();
                turnHistory.value.pop();
                currentCard.value = last.card;
                screen.value = 'gameplay';
                runTurnClock(turnRemainingMs);
            };

            const endTurn = (cardOnScreen = true) => {
                stopClocks();
                if (settings.sound) sounds.buzzer();
                vibrate([200, 100, 200]);
                if (cardOnScreen) {
                    // The card on screen wasn't finished, so it goes back to the bottom of the deck.
                    gameDeck.value.unshift(currentCard.value);
                    turnHistory.value.push({ card: currentCard.value, action: 'unfinished', scoreChange: 0, playerIndex: currentPlayerIndex.value, returned: true });
                }
                screen.value = 'turn_end';
            };

            // The turn history is kept until the next turn starts, so "End game" on the
            // next player's intro screen still shows the last turn's cards.
            const advanceToNextPlayer = () => {
                currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length;
                turnScoreEarned.value = 0;
                screen.value = 'turn_intro';
            };

            const triggerGameOver = (reason) => {
                stopClocks();
                releaseWakeLock();
                gameOverReason.value = reason;
                screen.value = 'game_over';
            };

            const confirmEndGame = async () => {
                const ok = await showConfirm(t('endGame'), t('endGameConfirm'), { danger: true, okText: t('endGame') });
                if (ok) triggerGameOver(t('gameEndedEarly'));
            };

            const exitGame = () => {
                stopClocks();
                releaseWakeLock();
                screen.value = null;
            };

            // ------------------------------------------------------------ lifecycle

            watch(settings, () => {
                store(STORAGE.settings, settings);
                document.documentElement.lang = settings.lang;
                document.title = t('gameTitle');
            }, { deep: true, immediate: true });
            watch(players, () => store(STORAGE.players, players.value.map(p => ({ name: p.name, score: 0 }))), { deep: true });
            watch(tab, () => {
                cardSheet.show = false;
                preview.show = false;
            });

            // Keep the editor pointed at a real deck (default to the deck chosen for play).
            watch(uniqueDecks, (decks) => {
                const names = decks.map(d => d.name);
                if (pendingDeck.value && names.includes(pendingDeck.value)) pendingDeck.value = '';
                if (!editorDeck.value || (!names.includes(editorDeck.value) && editorDeck.value !== pendingDeck.value)) {
                    editorDeck.value = names.includes(settings.deck) ? settings.deck : (names[0] || '');
                }
                if (settings.deck && !names.includes(settings.deck)) settings.deck = '';
            }, { immediate: true });
            watch(editorDeck, () => { searchQuery.value = ''; });

            onMounted(() => {
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible' && screen.value && screen.value !== 'game_over') requestWakeLock();
                });
                // The cards only exist on this device, so ask the browser not to clear them to free up space.
                if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
            });

            return {
                tab, screen, toast,
                allCards, uniqueDecks,
                settings, players, newPlayerName, playerInputRef,
                editorDeck, editorDecks, deckCards, editorCards, searchQuery, tabooInputRefs, cardSheet, preview, previewCard,
                dialog, dialogInputRef, closeDialog,
                gameDeck, currentPlayerIndex, currentPlayer, currentCard, timeLeft, timeFraction, breakTimeLeft,
                turnScoreEarned, turnHistory, gameOverReason, lastAction, actionText, resultText, isHidden, nextPlayerName, sortedPlayers,
                canStart, startHint, rulesSummary,
                t, difficultyName, formatDelta, initials,
                exportDecks, importInputRef, chooseImportFile, importDecks,
                addPlayer, removePlayer, movePlayer, previewSound,
                createDeck, deleteDeck, openCard, closeCardSheet, addTabooField, saveCard, deleteCard,
                previewDraft, previewDeck, stepPreview, onSwipeStart, onSwipeEnd,
                startGame, startTurn, handleCardAction, proceedFromBreak, undoLastAction,
                advanceToNextPlayer, confirmEndGame, exitGame
            };
        }
    }).mount('#app');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
})();
