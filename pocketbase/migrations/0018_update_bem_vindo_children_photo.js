migrate(
  (app) => {
    // Atualizar / Inserir content_block 'bem-vindo' com imagem de crianças e acolhimento
    const contentBlocksCol = app.findCollectionByNameOrId('content_blocks')
    const childrenPhotoUrl =
      'https://img.usecurling.com/p/600/600?q=smiling%20children%20volunteers%20hug%20solidarity'

    try {
      const rec = app.findFirstRecordByData('content_blocks', 'slug', 'bem-vindo')
      rec.set('image_url', childrenPhotoUrl)
      rec.set('title', 'Bem-vindo')
      rec.set('site', 'abraco')
      app.save(rec)
    } catch (_) {
      const newRec = new Record(contentBlocksCol)
      newRec.set('slug', 'bem-vindo')
      newRec.set('title', 'Bem-vindo')
      newRec.set('subtitle', 'Faça da diversão uma boa ação')
      newRec.set(
        'body',
        '<p>Somos uma organização sem fins lucrativos e temos como missão engajar pessoas para o trabalho voluntário com o objetivo de promover ações sociais que mobilizam recursos para instituições assistenciais e comunidades carentes.</p>',
      )
      newRec.set('image_url', childrenPhotoUrl)
      newRec.set('site', 'abraco')
      newRec.set('order', 0)
      app.save(newRec)
    }

    // Se houver qualquer outro bloco com a imagem de idosos na URL, substituir pela foto de crianças
    try {
      const allBlocks = app.findRecordsByFilter('content_blocks', '', '-created', 100, 0)
      for (const blk of allBlocks) {
        const url = blk.getString('image_url') || ''
        if (url.includes('elderly') || url.includes('homeless')) {
          blk.set('image_url', childrenPhotoUrl)
          app.save(blk)
        }
      }
    } catch (_) {}
  },
  (app) => {
    // Reversão
  },
)
