migrate(
  (app) => {
    // 1. volunteer_profiles
    const volunteerProfiles = new Collection({
      name: 'volunteer_profiles',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'display_name', type: 'text', required: true },
        { name: 'phone', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'bio', type: 'text' },
        { name: 'points', type: 'number', min: 0 },
        { name: 'level_name', type: 'text' },
        { name: 'referral_code', type: 'text', required: true },
        { name: 'referred_by_code', type: 'text' },
        { name: 'total_actions_completed', type: 'number', min: 0 },
        { name: 'total_donations_value', type: 'number', min: 0 },
        { name: 'total_volunteers_invited', type: 'number', min: 0 },
        { name: 'avatar_url', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_vp_user_id ON volunteer_profiles (user_id)',
        'CREATE UNIQUE INDEX idx_vp_ref_code ON volunteer_profiles (referral_code)',
        'CREATE INDEX idx_vp_points ON volunteer_profiles (points DESC)',
      ],
    })
    app.save(volunteerProfiles)

    // 2. volunteer_missions
    const volunteerMissions = new Collection({
      name: 'volunteer_missions',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'editor', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['Indicação', 'Doação', 'Ação Social', 'Divulgação', 'Especial'],
          maxSelect: 1,
        },
        { name: 'points_reward', type: 'number', required: true, min: 1 },
        { name: 'icon_name', type: 'text' },
        { name: 'badge_reward_id', type: 'text' },
        { name: 'active', type: 'bool' },
        { name: 'deadline', type: 'text' },
        {
          name: 'difficulty',
          type: 'select',
          required: true,
          values: ['Fácil', 'Médio', 'Avançado', 'Épico'],
          maxSelect: 1,
        },
        { name: 'instructions', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_vm_category ON volunteer_missions (category)',
        'CREATE INDEX idx_vm_active ON volunteer_missions (active)',
      ],
    })
    app.save(volunteerMissions)

    // 3. volunteer_badges
    const volunteerBadges = new Collection({
      name: 'volunteer_badges',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'icon_name', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['Geral', 'Indicações', 'Doações', 'Presença', 'Destaque'],
          maxSelect: 1,
        },
        { name: 'points_required', type: 'number', min: 0 },
        { name: 'color', type: 'text' },
        {
          name: 'rarity',
          type: 'select',
          required: true,
          values: ['Comum', 'Raro', 'Lendário', 'Mestre'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(volunteerBadges)

    const vpColId = app.findCollectionByNameOrId('volunteer_profiles').id
    const vbColId = app.findCollectionByNameOrId('volunteer_badges').id
    const vmColId = app.findCollectionByNameOrId('volunteer_missions').id

    // 4. volunteer_earned_badges
    const volunteerEarnedBadges = new Collection({
      name: 'volunteer_earned_badges',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'volunteer_profile_id',
          type: 'relation',
          required: true,
          collectionId: vpColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'badge_id',
          type: 'relation',
          required: true,
          collectionId: vbColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'earned_at', type: 'text', required: true },
        { name: 'reason', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_veb_vp ON volunteer_earned_badges (volunteer_profile_id)'],
    })
    app.save(volunteerEarnedBadges)

    // 5. volunteer_actions
    const volunteerActions = new Collection({
      name: 'volunteer_actions',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'volunteer_profile_id',
          type: 'relation',
          required: true,
          collectionId: vpColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'mission_id',
          type: 'relation',
          collectionId: vmColId,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'action_type',
          type: 'select',
          required: true,
          values: ['indicacao', 'doacao', 'acao_social', 'divulgacao', 'outro'],
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'proof_url', type: 'text' },
        { name: 'proof_file', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'points_claimed', type: 'number', required: true, min: 1 },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'approved', 'rejected'],
          maxSelect: 1,
        },
        { name: 'admin_feedback', type: 'text' },
        { name: 'reviewed_by', type: 'text' },
        { name: 'reviewed_at', type: 'text' },
        { name: 'donation_value', type: 'number', min: 0 },
        { name: 'invited_email', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_va_vp ON volunteer_actions (volunteer_profile_id)',
        'CREATE INDEX idx_va_status ON volunteer_actions (status)',
      ],
    })
    app.save(volunteerActions)
  },
  (app) => {
    const tryDelete = (name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
    tryDelete('volunteer_actions')
    tryDelete('volunteer_earned_badges')
    tryDelete('volunteer_badges')
    tryDelete('volunteer_missions')
    tryDelete('volunteer_profiles')
  },
)
