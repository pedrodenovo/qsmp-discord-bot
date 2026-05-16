const Database = require('better-sqlite3');
const path = require('path');

// Cria o arquivo do banco na raiz do projeto bot
const db = new Database(path.join(__dirname, 'bot_data.db'));

// Tabela de Infraestrutura: Guarda TUDO que o bot cria
db.exec(`
    CREATE TABLE IF NOT EXISTS infrastructure (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        entity_type TEXT NOT NULL, -- 'category', 'channel', 'role'
        entity_id TEXT NOT NULL,
        lang_group TEXT NOT NULL   -- 'core' (para welcome/settings) ou 'en', 'es', etc.
    );
`);

// Funções utilitárias para usarmos no bot
const dbManager = {
    // Salva uma nova entidade criada
    saveEntity: (guildId, entityType, entityId, langGroup) => {
        const stmt = db.prepare('INSERT INTO infrastructure (guild_id, entity_type, entity_id, lang_group) VALUES (?, ?, ?, ?)');
        stmt.run(guildId, entityType, entityId, langGroup);
    },

    // Verifica se a infraestrutura 'core' (welcome/settings) já existe no servidor
    hasCoreSetup: (guildId) => {
        const stmt = db.prepare('SELECT count(*) as count FROM infrastructure WHERE guild_id = ? AND lang_group = ?');
        const row = stmt.get(guildId, 'core');
        return row.count > 0;
    },

    // Busca uma entidade específica de um idioma (ex: pegar o ID da Categoria 'en')
    getEntity: (guildId, langGroup, entityType) => {
        const stmt = db.prepare('SELECT entity_id FROM infrastructure WHERE guild_id = ? AND lang_group = ? AND entity_type = ?');
        const row = stmt.get(guildId, langGroup, entityType);
        return row ? row.entity_id : null;
    },

    // Retorna todos os cargos de idioma que o bot já criou neste servidor
    getAllLanguageRoles: (guildId) => {
        const stmt = db.prepare("SELECT entity_id FROM infrastructure WHERE guild_id = ? AND entity_type = 'role' AND lang_group != 'core'");
        return stmt.all(guildId).map(row => row.entity_id);
    },

    getChannelInfo: (guildId, channelId) => {
        const stmt = db.prepare('SELECT entity_type, lang_group FROM infrastructure WHERE guild_id = ? AND entity_id = ?');
        return stmt.get(guildId, channelId);
    },

getTargetChannels: (guildId, entityType, sourceLang) => {
        // Correção: Aspas duplas por fora do JS, aspas simples por dentro no SQL ('core')
        const stmt = db.prepare("SELECT lang_group, entity_id FROM infrastructure WHERE guild_id = ? AND entity_type = ? AND lang_group != ? AND lang_group != 'core'");
        return stmt.all(guildId, entityType, sourceLang);
    },
    // Adicione no final do objeto dbManager (antes do module.exports):

    // Pega TODA a infraestrutura criada no servidor para podermos deletar
    getAllEntities: (guildId) => {
        const stmt = db.prepare('SELECT id, entity_type, entity_id FROM infrastructure WHERE guild_id = ?');
        return stmt.all(guildId);
    },

    // Apaga os registros do banco após a desinstalação
    deleteGuildData: (guildId) => {
        const stmt = db.prepare('DELETE FROM infrastructure WHERE guild_id = ?');
        stmt.run(guildId);
    },

    // --- SISTEMA DE BLOQUEIO DE PAÍSES ---
    // Cria uma tabela simples para bloqueios se ela não existir
    initBlocksTable: () => {
        db.exec('CREATE TABLE IF NOT EXISTS blocked_langs (guild_id TEXT, lang_group TEXT, PRIMARY KEY(guild_id, lang_group))');
    },

    toggleBlockLanguage: (guildId, langGroup) => {
        // Verifica se já está bloqueado
        const stmtCheck = db.prepare('SELECT * FROM blocked_langs WHERE guild_id = ? AND lang_group = ?');
        if (stmtCheck.get(guildId, langGroup)) {
            db.prepare('DELETE FROM blocked_langs WHERE guild_id = ? AND lang_group = ?').run(guildId, langGroup);
            return false; // Desbloqueou
        } else {
            db.prepare('INSERT INTO blocked_langs (guild_id, lang_group) VALUES (?, ?)').run(guildId, langGroup);
            return true; // Bloqueou
        }
    },

    isBlocked: (guildId, langGroup) => {
        const stmt = db.prepare('SELECT * FROM blocked_langs WHERE guild_id = ? AND lang_group = ?');
        return !!stmt.get(guildId, langGroup);
    },

    // --- SISTEMA DE SINCRONIZAÇÃO DE FÓRUNS (THREADS) ---
    initThreadTable: () => {
        db.exec('CREATE TABLE IF NOT EXISTS thread_sync (thread_id TEXT PRIMARY KEY, sync_id TEXT NOT NULL, lang_group TEXT NOT NULL)');
    },

    saveThreadSync: (threadId, syncId, langGroup) => {
        const stmt = db.prepare('INSERT OR IGNORE INTO thread_sync (thread_id, sync_id, lang_group) VALUES (?, ?, ?)');
        stmt.run(threadId, syncId, langGroup);
    },

    getThreadSync: (threadId) => {
        const stmt = db.prepare('SELECT sync_id, lang_group FROM thread_sync WHERE thread_id = ?');
        return stmt.get(threadId);
    },

    getTargetThreads: (syncId, sourceLang) => {
        const stmt = db.prepare('SELECT thread_id, lang_group FROM thread_sync WHERE sync_id = ? AND lang_group != ?');
        return stmt.all(syncId, sourceLang);
    }
};

dbManager.initBlocksTable();
dbManager.initThreadTable();

module.exports = dbManager;