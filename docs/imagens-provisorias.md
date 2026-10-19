# Imagens provisórias

Imagens ilustrativas geradas por IA, autorizadas para a apresentação provisória do site.
Não representam colaboradores, clientes, participantes ou eventos reais da Conexão Positiva.

Os ficheiros WebP estão em `public/images/provisorias/` e as referências e textos alternativos
em `src/content/provisional-images.ts`:

- `colaboracao.webp`: Desenvolvimento de Equipas e conteúdos de exemplo sobre comunicação.
- `formacao.webp`: Formações e conteúdos de exemplo sobre formação.
- `bem-estar.webp`: experiências e conteúdos de exemplo sobre bem-estar.
- `palestra.webp`: palestras, eventos e respetivas páginas de solução.
- `equipa.webp`: Sobre Nós, Team Building e Experiências.
- `mentoria.webp`: liderança, Insights, Contactos e uma secção de Sobre Nós.

Os destaques exclusivos da Home, os cartões das oito soluções e os cabeçalhos das páginas
principais, categorias de Insights e ofertas do Método mostram estas imagens também sem CMS. As imagens de
eventos, experiências e artigos pertencem aos exemplos de `src/content/fixtures.ts`,
ativados apenas por `CONTENT_PREVIEW=1`. Conteúdos reais do CMS mantêm as suas imagens.

As imagens provisórias mostram a legenda “Fotografia ilustrativa”; o rodapé identifica
a origem por IA. Os exemplos de números, clientes, testemunhos, equipa e história ficam
ocultos até existirem conteúdos reais. Para a substituição
final, usar fotografias autorizadas, atualizar as referências e os textos alternativos e
retirar a marca `provisional` apenas das imagens substituídas. A fotografia do Método
C.E.N.T.R.O. já existente no repositório mantém-se.

## Distribuição sem repetições nos destaques

O slideshow, a introdução e o contacto final da Home têm fotografias exclusivas,
agrupadas em `homeImages`. O cabeçalho de Soluções tem uma imagem própria; cada um
dos oito serviços tem uma fotografia diferente. Workshops e Eventos Corporativos
já não reutilizam as imagens de Formações e Palestras.

O bloco final partilhado deixou de inserir automaticamente a fotografia de mentoria.
Só apresenta imagem quando a página fornece explicitamente uma. Os testes unitários
validam a separação entre os destaques da Home e os cartões das soluções.

Novas imagens exclusivas: `hero-pessoas.webp`, `hero-equipas.webp`,
`hero-equilibrio.webp`, `home-sobre.webp`, `home-contacto.webp`,
`solucoes-introducao.webp`, `workshop-criativo.webp` e `evento-corporativo.webp`.
