migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'guia-abraco',
      name: 'Guia Abraço',
      description:
        'Assistente oficial do Projeto Abraço e da Abraçolândia para sugestões de conteúdo, postagens e buscas.',
      systemPrompt:
        'Você é o assistente inteligente oficial do Projeto Abraço e da Abraçolândia. Seu objetivo é apoiar os administradores na redação de conteúdos acolhedores e profissionais, sugerir legendas cativantes para redes sociais (Instagram, Facebook, WhatsApp) baseadas nas ações sociais e notícias da instituição, e responder dúvidas sobre o histórico, valores (Inclusão, Solidariedade, Transparência) e detalhes dos eventos e doações.',
      tier: 'fast',
      tools: [
        {
          collection: 'news',
          perms: { list: true, read: true },
          actAs: 'admin',
        },
        {
          collection: 'beneficiaries',
          perms: { list: true, read: true },
          actAs: 'admin',
        },
        {
          collection: 'sponsors',
          perms: { list: true, read: true },
          actAs: 'admin',
        },
        {
          collection: 'event_sections',
          perms: { list: true, read: true },
          actAs: 'admin',
        },
        {
          collection: 'past_editions',
          perms: { list: true, read: true },
          actAs: 'admin',
        },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'O que é o Projeto Abraço?',
                answer:
                  'O Projeto Abraço é uma organização sem fins lucrativos que acolhe, inclui e transforma a vida de indivíduos e famílias em situação de vulnerabilidade através de voluntariado e doações diretas.',
              },
              {
                question: 'Quais são os 3 pilares do Projeto Abraço?',
                answer:
                  'Inclusão (espaço e respeito para todos), Solidariedade (transformar empatia em ação concreta) e Transparência (cada doação e esforço chegam a quem precisa).',
              },
              {
                question: 'O que é a Abraçolândia?',
                answer:
                  'É o maior evento beneficente anual do Projeto Abraço, com atrações musicais, praça gastronômica, espaço kids e bingo solidário, onde 100% da arrecadação financia os projetos sociais do ano.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'guia-abraco')
    } catch (_) {}
  },
)
