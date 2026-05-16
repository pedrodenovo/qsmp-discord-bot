require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ChannelType, PermissionFlagsBits } = require('discord.js');
const dbManager = require('./database');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const languageConfig = {
    '🇺🇸': { 
        code: 'en', roleName: '[EN] Speaker', categoryName: '🌎 English Section',
        channels: [
            { name: '🌎-world-chat', type: ChannelType.GuildText, key: 'world' },
            { name: '🇺🇸-local-chat', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-media-chat', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-help-and-bugs', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-news-and-updates', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇧🇷': { 
        code: 'pt', roleName: '[PT] Speaker', categoryName: '🌎 Seção em Português',
        channels: [
            { name: '🌎-chat-global', type: ChannelType.GuildText, key: 'world' },
            { name: '🇧🇷-chat-local', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-chat-midia', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-ajuda-e-bugs', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-noticias-e-atualizacoes', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇪🇸': { 
        code: 'es', roleName: '[ES] Speaker', categoryName: '🌎 Sección en Español',
        channels: [
            { name: '🌎-mundo-chat', type: ChannelType.GuildText, key: 'world' },
            { name: '🇪🇸-chat-local', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-chat-multimedia', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-ayuda-y-bugs', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-noticias-y-actualizaciones', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇫🇷': { 
        code: 'fr', roleName: '[FR] Speaker', categoryName: '🌎 Section Française',
        channels: [
            { name: '🌎-chat-monde', type: ChannelType.GuildText, key: 'world' },
            { name: '🇫🇷-chat-local', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-chat-medias', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-aide-et-bugs', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-actus-et-maj', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇯🇵': { 
        code: 'ja', roleName: '[JA] Speaker', categoryName: '🌎 日本語セクション',
        channels: [
            { name: '🌎-ワールドチャット', type: ChannelType.GuildText, key: 'world' },
            { name: '🇯🇵-ローカルチャット', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-メディア', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-ヘルプとバグ', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-ニュースとアプデ', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇷🇺': { 
        code: 'ru', roleName: '[RU] Speaker', categoryName: '🌎 Русская секция',
        channels: [
            { name: '🌎-мировой-чат', type: ChannelType.GuildText, key: 'world' },
            { name: '🇷🇺-локальный-чат', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-медиа-чат', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-помощь-и-баги', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-новости-и-апдейты', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇨🇳': { 
        code: 'zh', roleName: '[ZH] Speaker', categoryName: '🌎 中文专区',
        channels: [
            { name: '🌎-世界聊天', type: ChannelType.GuildText, key: 'world' },
            { name: '🇨🇳-本地聊天', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-媒体聊天', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-帮助与bug', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-新闻与更新', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇩🇪': { 
        code: 'de', roleName: '[DE] Speaker', categoryName: '🌎 Deutscher Bereich',
        channels: [
            { name: '🌎-welt-chat', type: ChannelType.GuildText, key: 'world' },
            { name: '🇩🇪-lokaler-chat', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-medien-chat', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-hilfe-und-bugs', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-news-und-updates', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    },
    '🇰🇷': { 
        code: 'ko', roleName: '[KO] Speaker', categoryName: '🌎 한국어 섹션',
        channels: [
            { name: '🌎-월드-채팅', type: ChannelType.GuildText, key: 'world' },
            { name: '🇰🇷-로컬-채팅', type: ChannelType.GuildText, key: 'local' },
            { name: '🔗-미디어-채팅', type: ChannelType.GuildText, key: 'media' },
            { name: '📩-도움말-및-버그', type: ChannelType.GuildForum, key: 'help' },
            { name: '📺-뉴스-및-업데이트', type: ChannelType.GuildText, key: 'news', readOnly: true }
        ]
    }
};

// Função principal de inicialização da infraestrutura Base
async function initializeCoreInfrastructure(guild) {
    // Se já criamos a base (welcome e settings) neste servidor, ignoramos.
    if (dbManager.hasCoreSetup(guild.id)) {
        console.log(`[Setup] Infraestrutura base já existe no servidor: ${guild.name}`);
        return;
    }

    console.log(`[Setup] Iniciando criação da infraestrutura base para: ${guild.name}`);
    const adminRoleId = process.env.ADMIN_ROLE_ID;

    try {
        // 1. CRIANDO CANAL DE WELCOME
        const welcomeChannel = await guild.channels.create({
            name: '🌻welcome🌻',
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                    deny: [PermissionFlagsBits.SendMessages] // Apenas o bot fala aqui
                }
            ]
        });
        dbManager.saveEntity(guild.id, 'channel', welcomeChannel.id, 'core');

        // Envia a mensagem inicial
        const welcomeMsg = await welcomeChannel.send(
            "🌍 **Bem-vindo ao Servidor Multilíngue!** 🌍\n\n" +
            "Para acessar os chats, reaja abaixo com a bandeira do seu idioma nativo:\n" +
            "🇺🇸 English\n" +
            "🇪🇸 Español\n" +
            "🇧🇷 Português\n" +
            "🇫🇷 Français\n\n" +
            "*(Você só pode acessar um idioma por vez!)*"
        );
        // Adiciona reações base (você pode expandir depois)
        await welcomeMsg.react('🇺🇸');
        await welcomeMsg.react('🇪🇸');
        await welcomeMsg.react('🇧🇷');
        await welcomeMsg.react('🇫🇷');
        await welcomeMsg.react('🇯🇵');
        await welcomeMsg.react('🇷🇺');
        await welcomeMsg.react('🇨🇳');
        await welcomeMsg.react('🇩🇪');
        await welcomeMsg.react('🇰🇷');


        // 2. CRIANDO CATEGORIA SETTINGS (Invisível para todos, exceto Admin)
        const settingsCategory = await guild.channels.create({
            name: '⚙️ qsmp settings',
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel] // Bloqueia para todo mundo
                },
                {
                    id: adminRoleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] // Libera para Admin
                },
                {
                    id: client.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels] // Garante que o bot veja
                }
            ]
        });
        dbManager.saveEntity(guild.id, 'category', settingsCategory.id, 'core');

        // 3. CRIANDO CANAL DENTRO DA CATEGORIA SETTINGS
        const settingsChannel = await guild.channels.create({
            name: 'painel-de-controle',
            type: ChannelType.GuildText,
            parent: settingsCategory.id // Coloca o canal dentro da categoria
        });
        dbManager.saveEntity(guild.id, 'channel', settingsChannel.id, 'core');

        await settingsChannel.send("🛠️ **Painel de Controle do Bot**\nAqui você usará os comandos de Broadcast, Bloqueio de Países e Desinstalação.");

        console.log(`[Setup] Infraestrutura base concluída com sucesso!`);

    } catch (error) {
        console.error(`[Erro Crítico] Falha ao criar infraestrutura base:`, error);
    }
}

client.once('clientReady', async () => {
    console.log(`[Bot] Conectado como ${client.user.tag}`);
    
    // Varre todos os servidores em que o bot está para garantir que têm a estrutura
    for (const guild of client.guilds.cache.values()) {
        await initializeCoreInfrastructure(guild);
    }
});

client.on('guildCreate', async (guild) => {
    // Acionado assim que o bot é convidado para um servidor novo
    await initializeCoreInfrastructure(guild);
});

client.on('messageReactionAdd', async (reaction, user) => {
    // Ignora o próprio bot
    if (user.bot) return;

    // Resolve partials caso a mensagem seja antiga (antes do bot reiniciar)
    if (reaction.partial) {
        try { await reaction.fetch(); } 
        catch (error) { return console.error('[Erro] Falha ao buscar reação:', error); }
    }

    const guild = reaction.message.guild;
    if (!guild) return;

    // Garante que a reação ocorreu apenas no canal de welcome do bot
    const welcomeChannelId = dbManager.getEntity(guild.id, 'core', 'channel_welcome');
    // Obs: Ao salvar o welcomeChannel na etapa anterior, você pode ter salvo apenas como 'channel' genérico. 
    // Para ser preciso, se o canal se chama welcome, vamos assumir que apenas lá funcionam bandeiras válidas.
    
    const emoji = reaction.emoji.name;
    const langData = languageConfig[emoji];

    if (!langData) {
        // Remove reação se não for uma bandeira configurada
        await reaction.users.remove(user.id).catch(() => {});
        return;
    }

    const member = await guild.members.fetch(user.id);
    const langCode = langData.code;

    try {
        console.log(`[Reação] ${user.tag} solicitou acesso ao idioma: ${langCode}`);

        // ==========================================
        // 1. GARANTE A EXISTÊNCIA DA INFRAESTRUTURA
        // ==========================================
        let roleId = dbManager.getEntity(guild.id, langCode, 'role');
        
        if (!roleId) {
            console.log(`[Infra] Criando seção do zero para: ${langCode}`);
            
            // Cria o cargo do Idioma
            const role = await guild.roles.create({
                name: langData.roleName,
                color: 'Random',
                reason: `Setup do idioma ${langCode}`
            });
            roleId = role.id;
            dbManager.saveEntity(guild.id, 'role', roleId, langCode);

            // Cria a Categoria Bloqueada (Só quem tem o cargo vê)
            const category = await guild.channels.create({
                name: langData.categoryName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: roleId, allow: [PermissionFlagsBits.ViewChannel] }
                ]
            });
            dbManager.saveEntity(guild.id, 'category', category.id, langCode);

            // Cria os Canais dentro da Categoria
            for (const chData of langData.channels) {
                const channelOptions = {
                    name: chData.name,
                    type: chData.type,
                    parent: category.id
                };

                // Se for o canal de News, bloqueia mensagens normais para os membros
                if (chData.readOnly) {
                    channelOptions.permissionOverwrites = [
                        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: roleId, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                    ];
                }

                const newChannel = await guild.channels.create(channelOptions);
                // Salvamos o canal com uma chave extra para o bot saber quem é quem depois (ex: 'channel_media')
                dbManager.saveEntity(guild.id, `channel_${chData.key}`, newChannel.id, langCode);
            }
        }

        // ==========================================
        // 2. REGRA DE EXCLUSIVIDADE DE IDIOMA
        // ==========================================
        // Pega todos os cargos de idioma que o bot gerencia
        const allManagedRoles = dbManager.getAllLanguageRoles(guild.id);
        
        // Descobre quais desses cargos o usuário já possui
        const rolesToRemove = member.roles.cache.filter(r => allManagedRoles.includes(r.id));
        
        if (rolesToRemove.size > 0) {
            await member.roles.remove(rolesToRemove);
            console.log(`[Permissões] Cargos antigos removidos de ${user.tag}`);
        }

        // ==========================================
        // 3. CONCEDE O NOVO ACESSO
        // ==========================================
        await member.roles.add(roleId);
        console.log(`[Acesso] ${user.tag} agora tem acesso ao canal ${langCode}`);

        // Opcional: Remove a reação do usuário após processar, para manter o painel limpo
        // await reaction.users.remove(user.id).catch(() => {});

    } catch (error) {
        console.error(`[Erro] Falha ao configurar idioma para ${user.tag}:`, error);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    // ==========================================
    // 1. MÓDULO DE ADMINISTRAÇÃO (PAINEL DE CONTROLE)
    // ==========================================
    if (message.channel.name === 'painel-de-controle' && message.content.startsWith('!')) {
        
        if (!message.member.roles.cache.has(process.env.ADMIN_ROLE_ID)) {
            return message.reply("⛔ Você não tem permissão para usar comandos de administrador.");
        }

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'broadcast') {
            const textToBroadcast = args.join(' ');
            if (!textToBroadcast) return message.reply("Escreva uma mensagem! Ex: `!broadcast Manutenção hoje!`");

            await message.reply("📡 Iniciando transmissão para todos os canais de notícias...");
            const newsChannels = dbManager.getTargetChannels(message.guild.id, 'channel_news', 'none');
            if (newsChannels.length === 0) return message.channel.send("Nenhum canal de notícia foi criado ainda.");
            
            const targetLangs = newsChannels.map(n => n.lang_group);

            try {
                const apiRes = await axios.post(`${process.env.INTERNAL_API_URL}/translate`, {
                    text: textToBroadcast,
                    targetLanguages: targetLangs
                }, { headers: { 'Authorization': process.env.INTERNAL_API_SECRET } });

                const translations = apiRes.data.translations;
                for (const target of newsChannels) {
                    const channel = await message.guild.channels.fetch(target.entity_id).catch(() => null);
                    if (channel && translations[target.lang_group]) {
                        await channel.send(`📢 **COMUNICADO OFICIAL**\n\n${translations[target.lang_group]}`);
                    }
                }
                return message.channel.send("✅ Transmissão concluída com sucesso!");
            } catch (error) {
                return message.channel.send(`❌ Erro ao traduzir o broadcast: ${error.message}`);
            }
        }

        if (command === 'block') {
            const langToBlock = args[0]?.toLowerCase();
            if (!langToBlock) return message.reply("Especifique a sigla! Ex: `!block en`");
            const isNowBlocked = dbManager.toggleBlockLanguage(message.guild.id, langToBlock);
            return message.reply(isNowBlocked 
                ? `🔒 A entrada para a seção **${langToBlock.toUpperCase()}** foi BLOQUEADA.` 
                : `🔓 A entrada para a seção **${langToBlock.toUpperCase()}** foi DESBLOQUEADA.`);
        }

        if (command === 'uninstall') {
            await message.reply("⚠️ Iniciando a exclusão da infraestrutura em 5 segundos...");
            setTimeout(async () => {
                const entities = dbManager.getAllEntities(message.guild.id);
                for (const entity of entities) {
                    try {
                        if (entity.entity_type === 'role') {
                            const role = await message.guild.roles.fetch(entity.entity_id).catch(() => null);
                            if (role) await role.delete();
                        } else {
                            const channel = await message.guild.channels.fetch(entity.entity_id).catch(() => null);
                            if (channel) await channel.delete();
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay p/ Rate Limit
                    } catch (e) {}
                }
                dbManager.deleteGuildData(message.guild.id);
            }, 5000);
            return;
        }

        if (command === 'init') {
            await message.reply("🔄 Reconstruindo a infraestrutura base...");
            await initializeCoreInfrastructure(message.guild); 
            return;
        }
        return message.reply("Comando desconhecido. Use: `!broadcast`, `!block`, `!uninstall` ou `!init`.");
    }

    // ==========================================
    // 2. IDENTIFICAÇÃO DE CANAIS E FÓRUNS (THREADS)
    // ==========================================
    console.log(`[Rastreio] Mensagem de ${message.author.username} no ID: ${message.channel.id}`);
    
    // Note o 'let' em vez de 'const' para podermos alterar se for uma Thread
    let channelInfo = dbManager.getChannelInfo(message.guild.id, message.channel.id);
    let isForumThread = false;
    let threadSyncData = null;

    if (!channelInfo && message.channel.isThread()) {
        const parentInfo = dbManager.getChannelInfo(message.guild.id, message.channel.parentId);
        if (parentInfo && parentInfo.entity_type === 'channel_help') {
            channelInfo = parentInfo; // Substitui o ID da thread pelo ID do fórum nas regras
            isForumThread = true;
            threadSyncData = dbManager.getThreadSync(message.channel.id);
        } else {
            return; // É uma thread aleatória que não nos interessa
        }
    }

    if (!channelInfo) {
        console.log(`[Rastreio] Canal/Thread ignorado (Não está no BD)`);
        return; 
    }

    const { entity_type, lang_group } = channelInfo;
    console.log(`[Rastreio] Tipo: ${entity_type} | Idioma: ${lang_group} | É Fórum: ${isForumThread}`);

    // ==========================================
    // 3. REGRA DE NEGÓCIO: CHAT DE MÍDIA
    // ==========================================
    if (entity_type === 'channel_media') {
        const hasAttachment = message.attachments.size > 0;
        const hasLink = /https?:\/\/[^\s]+/.test(message.content);

        if (!hasAttachment && !hasLink) {
            await message.delete().catch(() => {});
            const warning = await message.channel.send(`<@${message.author.id}>, este canal é apenas para links e arquivos!`);
            setTimeout(() => warning.delete().catch(() => {}), 5000);
            return;
        }
    }

    // Chats não traduzidos
    if (entity_type === 'channel_local' || entity_type === 'channel_news') return;

    // ==========================================
    // 4. FLUXO DE TRADUÇÃO (MENSAGENS + FÓRUNS)
    // ==========================================
    if (entity_type === 'channel_world' || entity_type === 'channel_media' || entity_type === 'channel_help') {
        if (!message.content) return;

        const targets = dbManager.getTargetChannels(message.guild.id, entity_type, lang_group);
        if (targets.length === 0) return;

        const targetLangs = targets.map(t => t.lang_group);

        let textToTranslate = message.content;
        let isNewThread = isForumThread && !threadSyncData;

        // Anexa o título para a IA traduzir o nome do tópico junto
        if (isNewThread) {
            textToTranslate = `[TÓPICO]: ${message.channel.name}\n\n${message.content}`;
        }

        try {
            const apiRes = await axios.post(`${process.env.INTERNAL_API_URL}/translate`, {
                text: textToTranslate,
                targetLanguages: targetLangs
            }, { headers: { 'Authorization': process.env.INTERNAL_API_SECRET } });

            const translations = apiRes.data.translations;
            const currentSyncId = isNewThread ? Date.now().toString() : (threadSyncData?.sync_id);

            if (isNewThread) dbManager.saveThreadSync(message.channel.id, currentSyncId, lang_group);

            for (const target of targets) {
                const targetChannel = await message.guild.channels.fetch(target.entity_id).catch(() => null);
                if (!targetChannel) continue;

                const translatedText = translations[target.lang_group];
                if (!translatedText) continue;

                const webhooks = await targetChannel.fetchWebhooks();
                let webhook = webhooks.find(wh => wh.owner.id === client.user.id);
                if (!webhook) {
                    webhook = await targetChannel.createWebhook({ name: 'QSMP Translator', avatar: client.user.displayAvatarURL() });
                }

                const webhookPayload = {
                    content: translatedText,
                    username: message.member?.displayName || message.author.username,
                    avatarURL: message.author.displayAvatarURL(),
                    files: message.attachments.map(a => a.url)
                };

                // Lógica de distribuição para Fóruns vs Textos normais
                if (isForumThread) {
                    if (isNewThread) {
                        webhookPayload.threadName = translatedText.substring(0, 95).split('\n')[0].replace('[TÓPICO]:', '').trim();
                        const createdMessage = await webhook.send({ ...webhookPayload, wait: true });
                        dbManager.saveThreadSync(createdMessage.channelId, currentSyncId, target.lang_group);
                    } else {
                        const syncedThreads = dbManager.getTargetThreads(currentSyncId, lang_group);
                        const targetThread = syncedThreads.find(t => t.lang_group === target.lang_group);
                        if (targetThread) {
                            webhookPayload.threadId = targetThread.thread_id;
                            await webhook.send(webhookPayload);
                        }
                    }
                } else {
                    await webhook.send(webhookPayload);
                }
            }
        } catch (error) {
            console.error(`[Erro de Tradução] Falha ao processar:`, error?.response?.data || error.message);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);