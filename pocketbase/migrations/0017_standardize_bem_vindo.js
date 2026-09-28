migrate(
  (app) => {
    // Garantir que registros existentes tenham a grafia padronizada
    // Atualizar bloco ou texto institucional se houver
    const collectionsToCheck = [
      'content_blocks',
      'news',
      'volunteer_missions',
      'volunteer_badges',
      'volunteer_areas',
    ]

    for (const colName of collectionsToCheck) {
      try {
        const col = app.findCollectionByNameOrId(colName)
        if (!col) continue
        const records = app.findRecordsByFilter(colName, '', '-created', 100, 0)
        for (const rec of records) {
          let changed = false
          const fields = ['title', 'subtitle', 'body', 'description', 'requirements', 'summary']
          for (const f of fields) {
            try {
              const val = rec.getString(f)
              if (val && /\b[Bb]em\s+[Vv]indo\b/.test(val)) {
                const updatedVal = val.replace(/\b[Bb]em\s+[Vv]indo\b/g, 'Bem-vindo')
                rec.set(f, updatedVal)
                changed = true
              }
            } catch (_) {}
          }
          if (changed) {
            app.save(rec)
          }
        }
      } catch (_) {}
    }
  },
  (app) => {},
)
