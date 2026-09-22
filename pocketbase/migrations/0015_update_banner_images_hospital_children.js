migrate(
  (app) => {
    // Atualizar banner da Home do Projeto Abraço (substituindo a imagem que retornava o megafone inadequado por crianças em hospital / acolhimento infantil)
    try {
      const banners = app.findRecordsByFilter('banners', 'site = "abraco"', 'order', 10, 0)
      if (banners && banners.length > 0) {
        for (const b of banners) {
          const currentUrl = b.get('image_url') || ''
          // Se for o banner principal institucional ou tiver a query antiga
          if (
            b.get('order') === 1 ||
            currentUrl.includes('solidarity%20community%20charity%20hands') ||
            b.get('title') === 'FAÇA PARTE! VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!'
          ) {
            b.set(
              'image_url',
              'https://img.usecurling.com/p/1600/900?q=children%20hospital%20visit%20volunteers',
            )
            app.save(b)
          } else if (
            currentUrl.includes('volunteers%20helping%20families%20boxes') ||
            b.get('order') === 2
          ) {
            // Garantir que o segundo slide do carrossel institucional também tenha imagem segura e acolhedora de voluntariado e crianças
            b.set(
              'image_url',
              'https://img.usecurling.com/p/1600/900?q=volunteers%20hospitalized%20children%20smiling',
            )
            app.save(b)
          }
        }
      }
    } catch (err) {
      console.log('Error updating institutional banner images:', err)
    }
  },
  (app) => {
    // Reversão
  },
)
