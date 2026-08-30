migrate(
  (app) => {
    // Update users collection with role field
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['admin', 'editor'],
          maxSelect: 1,
        }),
      )
      app.save(users)
    }

    // 1. Settings / Config collection (social links, contact info, general config)
    const settings = new Collection({
      name: 'site_settings',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_settings_key ON site_settings (key)'],
    })
    app.save(settings)

    // 2. Banners collection (Banners da Home do Projeto Abraço e Hotsite Abraçolândia)
    const banners = new Collection({
      name: 'banners',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'site',
          type: 'select',
          values: ['abraco', 'abracolandia'],
          required: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'cta_text', type: 'text' },
        { name: 'cta_link', type: 'text' },
        { name: 'badge', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'active', type: 'bool' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_banners_site ON banners (site, active, order)'],
    })
    app.save(banners)

    // 3. News / Notícias (com tags, eventos passados/futuros, autor, galeria e vídeos)
    const news = new Collection({
      name: 'news',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'summary', type: 'text', required: true },
        { name: 'content', type: 'editor' },
        {
          name: 'category',
          type: 'select',
          values: ['Geral', 'Evento', 'Ação Social', 'Voluntariado', 'Transparência'],
          maxSelect: 1,
        },
        { name: 'event_date', type: 'text' },
        { name: 'is_event', type: 'bool' },
        {
          name: 'event_status',
          type: 'select',
          values: ['upcoming', 'past', 'none'],
          maxSelect: 1,
        },
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'video_url', type: 'text' },
        { name: 'gallery', type: 'json' }, // array of image urls or captions
        { name: 'published_at', type: 'text' },
        { name: 'featured', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_news_slug ON news (slug)',
        'CREATE INDEX idx_news_featured ON news (featured, created DESC)',
      ],
    })
    app.save(news)

    // 4. Beneficiados (ações de entregas, cestas, atendimentos, beneficiados da festa)
    const beneficiaries = new Collection({
      name: 'beneficiaries',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'site',
          type: 'select',
          values: ['abraco', 'abracolandia', 'both'],
          required: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'type', type: 'text', required: true }, // ex: "Cestas Básicas", "Atendimento Médico", "Família Acolhida", "Reforma Comunitária"
        { name: 'recipient_name', type: 'text' },
        { name: 'quantity', type: 'text' }, // ex: "350 Cestas", "120 Famílias"
        { name: 'location', type: 'text' },
        { name: 'date', type: 'text' },
        { name: 'summary', type: 'text' },
        { name: 'description', type: 'editor' },
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'video_url', type: 'text' },
        { name: 'gallery', type: 'json' },
        { name: 'impact_stats', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_beneficiaries_slug ON beneficiaries (slug)',
        'CREATE INDEX idx_beneficiaries_site ON beneficiaries (site)',
      ],
    })
    app.save(beneficiaries)

    // 5. Sponsors / Patrocinadores (categorias Diamante, Ouro, Prata, Bronze para Hotsite e Institucional)
    const sponsors = new Collection({
      name: 'sponsors',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        {
          name: 'site',
          type: 'select',
          values: ['abraco', 'abracolandia', 'both'],
          required: true,
          maxSelect: 1,
        },
        {
          name: 'tier',
          type: 'select',
          values: ['Diamante', 'Ouro', 'Prata', 'Bronze', 'Apoiador'],
          required: true,
          maxSelect: 1,
        },
        { name: 'logo_url', type: 'text' },
        { name: 'logo', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'website', type: 'text' },
        { name: 'description', type: 'editor' },
        { name: 'since_year', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'featured', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_sponsors_slug ON sponsors (slug)',
        'CREATE INDEX idx_sponsors_tier ON sponsors (tier, order)',
      ],
    })
    app.save(sponsors)

    // 6. Volunteer Opportunities & Areas (Voluntariado - Geral e Abraçolândia)
    const volunteerAreas = new Collection({
      name: 'volunteer_areas',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'site',
          type: 'select',
          values: ['abraco', 'abracolandia', 'both'],
          required: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'editor' },
        { name: 'requirements', type: 'text' },
        { name: 'time_commitment', type: 'text' },
        { name: 'spots_available', type: 'number' },
        { name: 'icon_name', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'testimonials', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_volunteer_slug ON volunteer_areas (slug)'],
    })
    app.save(volunteerAreas)

    // 7. Abraçolândia Event Sections (A Festa: Programação/Atrações, Gastronomia, Área Infantil, Bingo, Estacionamento)
    const eventSections = new Collection({
      name: 'event_sections',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'section_type',
          type: 'select',
          values: ['geral', 'atracoes', 'gastronomia', 'espaco_kids', 'bingo', 'estacionamento'],
          required: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'content', type: 'editor' },
        { name: 'items', type: 'json' }, // list of attractions, food options, bingo prizes, schedule, etc.
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_event_section_type ON event_sections (section_type)'],
    })
    app.save(eventSections)

    // 8. Tickets / Convites / Pontos de Venda (PDVs físicos e online)
    const ticketOutlets = new Collection({
      name: 'ticket_outlets',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          values: ['Físico', 'Online'],
          required: true,
          maxSelect: 1,
        },
        { name: 'city', type: 'text', required: true },
        { name: 'address', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'opening_hours', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'price_info', type: 'text' },
        { name: 'available', type: 'bool' },
        { name: 'description', type: 'editor' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_tickets_city ON ticketOutlets (city)'],
    })
    app.save(ticketOutlets)

    // 9. Past Editions / Festas Anteriores
    const pastEditions = new Collection({
      name: 'past_editions',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'theme', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'summary', type: 'text' },
        { name: 'description', type: 'editor' },
        { name: 'raised_amount', type: 'text' },
        { name: 'attendance', type: 'text' },
        { name: 'benefited_families', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'video_url', type: 'text' },
        { name: 'gallery', type: 'json' }, // array of photos/videos with captions
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_past_editions_year ON past_editions (year)',
        'CREATE UNIQUE INDEX idx_past_editions_slug ON past_editions (slug)',
      ],
    })
    app.save(pastEditions)

    // 10. Content Blocks & Institutional Pages (Nossa História, Origens, etc.)
    const contentBlocks = new Collection({
      name: 'content_blocks',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'site',
          type: 'select',
          values: ['abraco', 'abracolandia', 'both'],
          required: true,
          maxSelect: 1,
        },
        { name: 'slug', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'body', type: 'editor' },
        { name: 'image_url', type: 'text' },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'video_url', type: 'text' },
        { name: 'metadata', type: 'json' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_blocks_slug ON content_blocks (slug)',
        'CREATE INDEX idx_blocks_site ON content_blocks (site, order)',
      ],
    })
    app.save(contentBlocks)

    // 11. Volunteer Inscriptions (Formulário de inscrição de voluntários)
    const volunteerInscriptions = new Collection({
      name: 'volunteer_inscriptions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'city', type: 'text' },
        { name: 'area_interest', type: 'text', required: true },
        {
          name: 'environment',
          type: 'select',
          values: ['abraco', 'abracolandia', 'both'],
          required: true,
          maxSelect: 1,
        },
        { name: 'availability', type: 'text' },
        { name: 'message', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['pending', 'contacted', 'approved', 'archived'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(volunteerInscriptions)
  },
  (app) => {
    const collections = [
      'volunteer_inscriptions',
      'content_blocks',
      'past_editions',
      'ticket_outlets',
      'event_sections',
      'volunteer_areas',
      'sponsors',
      'beneficiaries',
      'news',
      'banners',
      'site_settings',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
