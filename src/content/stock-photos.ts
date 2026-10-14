/**
 * Fotografias de banco (Unsplash) ilustrativas, usadas enquanto não há fotografias reais da
 * Conexão Positiva. Nunca em equipa, clientes, testemunhos, eventos ou casos (seriam enganosas).
 * Servidas pelo CDN do Unsplash (licença Unsplash: uso livre; crédito mostrado nos heros).
 * Para trocar por fotografias reais: publicar a imagem no CMS ou retirar a chave daqui.
 */
export interface StockPhoto {
  /** Caminho no CDN, ex.: "photo-1573164574511-73c773193279". */
  path: string;
  alt: string;
  author: string;
  username: string;
}

export const stockPhotos: Record<string, StockPhoto> = {
  palestras: {
    path: "photo-1778877032995-4ab6cd8fe106",
    alt: "Oradora a discursar num púlpito com microfone perante o público",
    author: "Ufoma Ojo",
    username: "ladyufoma001",
  },
  formacoes: {
    path: "photo-1573496130103-a442a3754d0e",
    alt: "Formadora junto a um quadro branco durante uma sessão de formação",
    author: "Christina @ wocintechchat.com M",
    username: "wocintechchat",
  },
  workshops: {
    path: "photo-1573167474706-deb8c54d0bc7",
    alt: "Profissional a escrever ideias num quadro branco durante um workshop",
    author: "Christina @ wocintechchat.com M",
    username: "wocintechchat",
  },
  "team-building": {
    path: "photo-1639432037802-9c54dc6a2b05",
    alt: "Grupo de pessoas reunidas ao ar livre numa atividade de equipa",
    author: "Oscar Omondi",
    username: "xodusdigitals",
  },
  "desenvolvimento-de-lideranca": {
    path: "photo-1653669486491-4061c06f5029",
    alt: "Líder confiante de braços cruzados num escritório",
    author: "The Jopwell Collection",
    username: "jopwell",
  },
  "desenvolvimento-de-equipas": {
    path: "photo-1573497701240-345a300b8d36",
    alt: "Equipa reunida à volta de uma mesa a conversar e colaborar",
    author: "Christina @ wocintechchat.com M",
    username: "wocintechchat",
  },
  "bem-estar-corporativo": {
    path: "photo-1511945863317-d60e146e9016",
    alt: "Mulher serena de olhos fechados num momento de calma e respiração",
    author: "Diana Simumpande",
    username: "dianasimumpande",
  },
  "eventos-corporativos": {
    path: "photo-1778876088510-84d7d8defaaa",
    alt: "Plateia sentada num auditório a assistir a uma apresentação",
    author: "Ufoma Ojo",
    username: "ladyufoma001",
  },
  sobre: {
    path: "photo-1653565684985-0b1a64cf7afc",
    alt: "Pessoas a trabalhar em conjunto à volta de uma mesa",
    author: "UK Black Tech",
    username: "ukblacktech",
  },
  solucoes: {
    path: "photo-1573164574511-73c773193279",
    alt: "Grupo em discussão num escritório moderno e luminoso",
    author: "Christina @ wocintechchat.com M",
    username: "wocintechchat",
  },
  insights: {
    path: "photo-1516182823370-7a5fa91445c3",
    alt: "Mulher a ler um livro, sentada num banco, em momento de reflexão",
    author: "Gift Habeshaw",
    username: "gift_habeshaw",
  },
  contactos: {
    path: "photo-1739285452621-59d92842fcc8",
    alt: "Profissionais a cumprimentar-se com um aperto de mão cordial",
    author: "Ninthgrid",
    username: "ninthgrid_",
  },
  "cat-lideranca": {
    path: "photo-1613186145425-5bb4eca455d7",
    alt: "Mulher de blazer branco junto à janela, postura de liderança",
    author: "Natasha Hall",
    username: "ideanaire",
  },
  "cat-equipas": {
    path: "photo-1573497701240-345a300b8d36",
    alt: "Equipa reunida à volta de uma mesa a conversar e colaborar",
    author: "Christina @ wocintechchat.com M",
    username: "wocintechchat",
  },
  "cat-bem-estar": {
    path: "photo-1722094250550-4993fa28a51b",
    alt: "Mulher sentada num pontão diante de um lago tranquilo",
    author: "Sam Carter",
    username: "samdc",
  },
  "cat-metodo-centro": {
    path: "photo-1533630160910-65f5a1718c65",
    alt: "Pedras brancas empilhadas em equilíbrio à beira-mar",
    author: "Iva Rajović",
    username: "eklektikum",
  },
  "cat-desenvolvimento-pessoal": {
    path: "photo-1618850494491-18418e2b8a07",
    alt: "Jovem sorridente a escrever num diário",
    author: "Marleena Garris",
    username: "marleena_garris",
  },
};

export const stockUrl = (photo: StockPhoto, width: number) =>
  `https://images.unsplash.com/${photo.path}?auto=format&fit=crop&w=${width}&q=70`;

/** Fotografia no formato das imagens de conteúdo (cartões). */
export function stockImage(key: string, width = 1200) {
  const photo = stockPhotos[key];
  if (!photo) return undefined;
  return {
    src: stockUrl(photo, width),
    alt: photo.alt,
    width,
    height: Math.round((width * 2) / 3),
  };
}
