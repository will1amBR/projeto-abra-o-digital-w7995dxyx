migrate(
  (app) => {
    try {
      const banners = app.findRecordsByFilter(
        'banners',
        'cta_link = "/abracolandia/festa"',
        '',
        50,
        0,
      )
      for (const b of banners) {
        b.set('cta_link', '/abracolandia/a-festa')
        app.save(b)
      }
    } catch (_) {}
  },
  (app) => {
    try {
      const banners = app.findRecordsByFilter(
        'banners',
        'cta_link = "/abracolandia/a-festa"',
        '',
        50,
        0,
      )
      for (const b of banners) {
        b.set('cta_link', '/abracolandia/festa')
        app.save(b)
      }
    } catch (_) {}
  },
)
