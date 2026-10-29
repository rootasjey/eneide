export type PresentationPost = {
  slug: string
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  tag: { fr: string; en: string }
  image: string
  publishedAt: string
  paragraphs: { fr: string[]; en: string[] }
  isProject?: boolean
}

export const PRESENTATION_POSTS: PresentationPost[] = [
  {
    slug: 'getting-started-nuxt',
    title: { fr: 'Un blog moderne pour vos idées', en: 'A modern blog for your ideas' },
    description: {
      fr: 'Une plateforme d’écriture pensée pour rester simple, rapide et agréable à parcourir.',
      en: 'A writing space designed to stay simple, fast, and pleasant to explore.',
    },
    tag: { fr: 'Minimalisme', en: 'Minimalism' },
    image: '/images/presentation/esc.webp',
    publishedAt: '2026-10-28',
    paragraphs: {
      fr: [
        'Corpinot rassemble des notes, des essais et des projets dans un espace volontairement calme. La lecture reste au centre, sans détour ni élément superflu.',
        'Cette démonstration présente la navigation éditoriale du site. Les contenus réels apparaîtront ici dès qu’ils seront publiés depuis l’éditeur.',
        'Un article commence par une idée, puis trouve son rythme au fil des paragraphes. Une introduction pose le contexte, les titres donnent des repères et les images viennent soutenir le propos. Cette structure rend la lecture plus fluide, que l’on découvre un texte depuis la page d’accueil ou que l’on y revienne plus tard.',
        'Les pages de Corpinot sont conçues pour accompagner ce parcours. La typographie garde une bonne lisibilité, les marges laissent respirer les contenus et les liens indiquent clairement où poursuivre. Sur un écran étroit, la mise en page s’adapte sans retirer les commandes essentielles ni raccourcir le texte.',
        'La barre de lecture suit maintenant l’avancée dans l’article. Elle indique le temps estimé, montre la progression et ouvre un sommaire lorsque plusieurs sections sont disponibles. Ces repères restent discrets pendant la lecture, mais permettent de retrouver rapidement un passage ou de comprendre la longueur du texte.',
        'Le contenu peut aussi accueillir des citations, des listes ou une galerie. Chaque format répond à une intention précise et conserve assez d’espace pour être compris. Un bloc visuel ne sert pas seulement à remplir la page : il complète une idée, donne un exemple ou invite à regarder autrement.',
        'En bas de l’article, les informations d’auteur et les recommandations prolongent la découverte. Elles proposent une suite liée au sujet, sans détourner le lecteur avant la fin. Le parcours reste ouvert : on peut refermer la page, revenir au journal ou choisir un autre texte.',
        'Cette version de présentation permet de parcourir plusieurs états et plusieurs langues. Les exemples sont fictifs, mais la structure reprend celle des articles du site. Elle sert à montrer comment un texte long, une image et les outils de navigation peuvent cohabiter sans se gêner.',
      ],
      en: [
        'Corpinot brings notes, essays, and projects together in a deliberately quiet space. Reading stays at the center, without detours or unnecessary clutter.',
        'This preview demonstrates the site’s editorial navigation. Published content from the editor will appear here as it becomes available.',
        'An article starts with an idea and finds its rhythm through a sequence of paragraphs. An introduction sets the context, headings offer landmarks, and images support the argument. This structure makes it easier to read a story from the homepage or return to it later.',
        'Corpinot’s pages are designed to support that journey. Clear typography keeps the text legible, margins give each section room, and links show where to continue. On a narrow screen, the layout adapts without removing useful controls or shortening the article.',
        'A reading indicator follows your progress through the article. It shows an estimated reading time, tracks how far you have travelled, and opens a contents list when the story has several sections. These cues stay quiet while you read, but make it easier to revisit a passage or understand the length of the piece.',
        'An article may also include quotations, lists, or a gallery. Each format has a purpose and gets enough room to be understood. A visual block is not there simply to fill the page: it adds context, gives an example, or offers a different way to look at an idea.',
        'At the end, the author details and recommendations offer a natural next step. They suggest related reading without pulling attention away before the story is finished. The path stays open: readers can return to the journal, choose another article, or leave the page.',
        'This preview makes several page states and languages available to explore. The examples are fictional, but the structure follows the site’s articles. It shows how a longer text, an image, and reading controls can share the page without getting in one another’s way.',
      ],
    },
  },
  {
    slug: 'all-the-necessary-parts',
    title: { fr: 'Les pièces essentielles', en: 'All the necessary parts' },
    description: {
      fr: 'Une interface éditoriale tient à quelques détails bien choisis : une bonne hiérarchie, des repères nets et de l’espace.',
      en: 'An editorial interface depends on a few thoughtful details: clear hierarchy, useful signposts, and room to breathe.',
    },
    tag: { fr: 'Design', en: 'Design' },
    image: '/images/presentation/turning-page.webp',
    publishedAt: '2026-09-18',
    paragraphs: {
      fr: [
        'Une page se parcourt plus facilement quand chaque élément indique clairement son rôle. Le titre annonce le sujet, les sous-titres découpent le raisonnement et les images donnent une forme concrète aux idées. Cette hiérarchie aide le lecteur à comprendre où il se trouve, sans ajouter de consignes autour du texte.',
        'Les marges donnent du rythme aux sections, tandis que des liens visibles rendent la suite évidente. Elles séparent les temps de lecture sans enfermer chaque passage dans une carte. Le regard peut ainsi se poser sur un paragraphe, puis reprendre naturellement le fil quelques lignes plus bas.',
        'Les petits détails comptent autant que la composition générale. Une date lisible situe l’article, une catégorie le replace dans son contexte et une image cohérente prépare le ton. Quand ces éléments sont placés avec mesure, ils orientent la lecture sans rivaliser avec le contenu principal.',
        'La navigation reste accessible à chaque étape. Le sommaire permet de rejoindre une section précise, tandis que les liens vers d’autres textes ouvrent des pistes complémentaires. Chaque commande répond à un besoin identifiable et garde une apparence discrète tant qu’elle n’est pas sollicitée.',
        'Ces repères doivent rester cohérents d’une page à l’autre. Le même style de lien indique la même action, et les menus conservent un comportement prévisible. Une personne qui arrive pour la première fois comprend ainsi comment parcourir le site sans devoir apprendre une nouvelle interface à chaque étape.',
        'Les contenus les plus denses demandent parfois une autre organisation. Une liste peut résumer plusieurs options, une citation marquer une idée et une image documenter un résultat. Le choix dépend du sujet : chaque élément doit rendre le propos plus clair ou plus facile à retenir.',
        'Enfin, une bonne hiérarchie n’est pas figée. Elle se vérifie sur téléphone, au clavier et avec un texte de longueur différente. Quand un titre déborde ou qu’un lien disparaît dans la composition, l’interface doit s’adapter plutôt que demander au lecteur de compenser.',
      ],
      en: [
        'A page is easier to explore when each element makes its role clear. The title introduces the subject, subheadings shape the argument, and images give ideas a concrete form. This hierarchy helps readers understand where they are without surrounding the text with extra instructions.',
        'Space gives sections rhythm, while visible links make the next step obvious. Margins separate moments in the reading without placing every passage inside a card. The eye can pause on one paragraph, then naturally pick up the thread a few lines later.',
        'Small details matter as much as the overall composition. A readable date places the article in time, a category gives it context, and a fitting image sets the tone. When these elements are used with care, they guide the reader without competing with the main story.',
        'Navigation stays available throughout the journey. A contents list leads to a specific section, while links to other stories open useful paths to explore. Each control answers a clear need and remains quiet until someone chooses to use it.',
        'These signposts should stay consistent from one page to the next. The same link style signals the same action, and menus behave in familiar ways. Someone visiting for the first time can learn how to explore the site without having to relearn the interface on every step.',
        'Dense content may call for a different arrangement. A list can summarize several options, a quotation can mark an idea, and an image can document a result. The choice depends on the subject: each element should make the argument clearer or easier to remember.',
        'A useful hierarchy is never fixed. It should be checked on a phone, with a keyboard, and with content of different lengths. When a heading wraps awkwardly or a link disappears in the layout, the interface should adapt instead of asking readers to compensate.',
      ],
    },
  },
  {
    slug: 'customize-your-experience',
    title: { fr: 'Une expérience à votre mesure', en: 'Customize your experience' },
    description: {
      fr: 'Thème, langue et recherche accompagnent la lecture sans détourner l’attention des textes.',
      en: 'Theme, language, and search support reading without drawing attention away from the writing.',
    },
    tag: { fr: 'Créativité', en: 'Creative' },
    image: '/images/presentation/thelma-et-louise.webp',
    publishedAt: '2026-08-07',
    paragraphs: {
      fr: [
        'Les préférences de lecture restent accessibles depuis la navigation. Le choix du thème, de la langue ou d’une recherche se fait sans perdre le fil de l’article. Les commandes sont regroupées là où on les attend et leurs libellés décrivent directement leur effet.',
        'Chaque commande conserve une fonction simple et une réponse visible. Un état actif confirme la sélection, un menu ouvert montre les options disponibles et un lien mène vers la page annoncée. Ces retours évitent de se demander si l’action a été prise en compte.',
        'L’expérience doit rester confortable dans des situations différentes. Certaines personnes lisent sur un grand écran, d’autres consultent quelques paragraphes sur leur téléphone. La mise en page s’ajuste à la largeur disponible tout en gardant une longueur de ligne agréable et des contrôles faciles à atteindre.',
        'Les raccourcis de lecture complètent ces réglages sans s’imposer. La progression permet d’évaluer ce qu’il reste à lire et le sommaire donne accès aux sections principales. On peut suivre le texte dans l’ordre ou rejoindre directement un passage précis.',
        'Le thème clair ou sombre modifie l’ambiance, mais ne change pas les repères. Le contraste doit rester suffisant, les liens doivent être identifiables et les états actifs visibles. Une préférence visuelle n’a de valeur que si elle préserve la compréhension du contenu.',
        'Le choix de langue suit le même principe. Les titres, les descriptions et les commandes doivent former un ensemble cohérent, sans mélange inattendu. Les formulations peuvent changer pour rester naturelles, tandis que la structure garde sa logique et ses points de repère.',
        'La personnalisation n’exige donc pas une multitude d’options. Quelques réglages bien placés couvrent les besoins courants et laissent la page respirer. Si une nouvelle commande ne répond pas à une demande claire, elle risque davantage d’interrompre la lecture que de l’améliorer.',
      ],
      en: [
        'Reading preferences stay close at hand in the navigation. Choosing a theme, language, or search does not interrupt the article. Controls appear where readers expect them, and their labels explain what each action will do.',
        'Each control has one clear purpose and a visible response. An active state confirms a selection, an open menu reveals its options, and a link leads to the page it names. These cues remove the guesswork about whether an action worked.',
        'The experience should remain comfortable in different situations. Some people read on a large display; others open a few paragraphs on their phone. The layout adapts to the available width while keeping line lengths comfortable and controls easy to reach.',
        'Reading shortcuts complement these settings without getting in the way. Progress helps readers see how much remains, and a contents list gives direct access to the main sections. They can follow the story in order or jump to a passage that matters to them.',
        'Light or dark themes change the mood, but should not change the signposts. Contrast needs to remain strong, links must be recognizable, and active states should be easy to find. A visual preference only helps when it preserves the meaning of the content.',
        'Language selection follows the same principle. Titles, descriptions, and controls should form a coherent whole instead of switching unexpectedly between languages. Wording can change to sound natural while the structure keeps its familiar logic and landmarks.',
        'Personalization does not require a long list of options. A few well-placed settings cover common needs and leave the page uncluttered. If a new control does not answer a clear request, it is more likely to interrupt reading than improve it.',
      ],
    },
  },
  {
    slug: 'the-place-for-quiet',
    title: { fr: 'La place du silence', en: 'The Place for Quiet' },
    description: {
      fr: 'Un peu d’espace aide les idées importantes à se faire entendre.',
      en: 'A little room helps the important ideas come through.',
    },
    tag: { fr: 'Culture numérique', en: 'Digital Culture' },
    image: '/images/presentation/rain-heart-duo.webp',
    publishedAt: '2026-04-03',
    paragraphs: {
      fr: [
        'Le vide n’est pas une zone à remplir. Il organise la lecture, donne du rythme et laisse respirer le contenu. Entre deux sections, une pause peut signaler un changement de sujet ou laisser une image prendre sa place. L’espace devient alors un repère, au même titre qu’un titre ou une légende.',
        'Chaque retrait doit aider le lecteur à comprendre ce qui compte. Si tout est mis en avant, plus rien ne ressort. Une composition mesurée donne plus de poids aux images importantes et aux phrases qui portent le propos, sans ajouter de décoration pour elle-même.',
        'La densité varie selon le type de page. Une archive rassemble beaucoup d’articles et doit permettre de les parcourir rapidement. Un essai, lui, peut prendre le temps de développer une idée. Le dessin de la page accompagne cette différence plutôt que d’imposer un seul rythme partout.',
        'L’espace s’ajuste aussi à l’écran. Une grande marge sur ordinateur peut devenir un intervalle plus court sur mobile, où la largeur est limitée. Le principe reste le même : séparer les idées assez pour les distinguer, sans allonger inutilement le trajet de lecture.',
        'Le silence visuel se mesure aussi à la qualité des transitions. Un titre peut annoncer une nouvelle idée sans être suivi d’un grand panneau coloré. Une image peut prendre toute sa place, puis laisser le texte reprendre naturellement. Les changements de rythme deviennent plus lisibles quand ils sont peu nombreux.',
        'La sobriété ne signifie pas que toutes les pages doivent se ressembler. Une archive peut être dense, un portfolio très visuel et un essai presque entièrement typographique. Leur cohérence vient de choix partagés sur la clarté, l’espace et la place accordée à chaque contenu.',
        'Il reste utile d’observer la page dans son ensemble. Un bloc isolé peut sembler élégant, mais déplacer l’équilibre du parcours lorsqu’il est répété. Le rythme se construit entre les éléments : ce qui précède prépare, ce qui suit prolonge, et chaque pause garde une raison d’être.',
      ],
      en: [
        'Empty space is not a gap to fill. It organizes the reading, sets a rhythm, and lets content breathe. A pause between sections can signal a change in subject or give an image room to stand on its own. Space then becomes a signpost, much like a heading or caption.',
        'Every pause should help readers see what matters. When everything is emphasized, nothing stands out. A measured composition gives more weight to important images and sentences without adding decoration for its own sake.',
        'Density changes with the kind of page. An archive gathers many stories and should make them easy to scan. An essay can take more time to develop an idea. The layout should support this difference instead of imposing one reading pace everywhere.',
        'Space also adjusts to the screen. A broad margin on desktop may become a shorter interval on mobile, where width is limited. The principle stays the same: separate ideas enough to distinguish them without making the reading journey longer than it needs to be.',
        'Visual quiet also depends on the transitions between sections. A heading can introduce a new thought without a large colored panel beneath it. An image can hold the page, then let the text resume naturally. Changes in pace become clearer when there are only a few of them.',
        'Restraint does not mean every page should look alike. An archive may be dense, a portfolio highly visual, and an essay almost entirely typographic. Their coherence comes from shared choices about clarity, space, and the attention each piece of content deserves.',
        'It helps to look at the page as a whole. A single block may look elegant yet shift the rhythm when repeated. Pace is built between elements: what comes before prepares the reader, what follows extends the idea, and each pause has a reason to be there.',
      ],
    },
  },
  {
    slug: 'a-closer-look',
    title: { fr: 'Regarder de plus près', en: 'A Closer Look' },
    description: {
      fr: 'Une étude de cas commence par l’observation : comprendre le contexte avant de dessiner une solution.',
      en: 'A case study starts with observation: understand the context before sketching a solution.',
    },
    tag: { fr: 'Études de cas', en: 'Case Studies' },
    image: '/images/presentation/thelma-et-louise.webp',
    publishedAt: '2026-03-16',
    paragraphs: {
      fr: [
        'Avant de concevoir, il faut regarder ce qui existe déjà et écouter les personnes qui s’en servent. Les habitudes révèlent les points d’appui, les hésitations et les attentes qui ne ressortent pas toujours dans un brief. Les observer permet de partir d’un problème réel, plutôt que d’une solution imaginée trop tôt.',
        'Cette étude de cas rassemble les décisions et les détails qui ont donné forme au résultat. Chaque choix est relié à une contrainte ou à un objectif : clarifier une étape, réduire une friction ou rendre une information plus visible. Le résultat se comprend mieux quand le raisonnement qui l’a guidé reste lisible.',
        'Les premiers essais servent à comparer plusieurs directions. Une maquette peut révéler un titre trop discret, une image qui détourne le regard ou une action difficile à repérer. Les retours permettent ensuite d’ajuster la composition avant que ces défauts ne deviennent coûteux à corriger.',
        'La version finale garde une trace de ces arbitrages. Elle montre comment le contexte, le contenu et les retours des utilisateurs se rejoignent dans une interface cohérente. L’étude ne cherche pas à présenter une recette universelle, mais à expliquer pourquoi cette réponse convenait à ce projet.',
        'Le résultat se juge ensuite sur des tâches concrètes. Peut-on trouver rapidement la bonne information ? L’action principale reste-t-elle évidente ? Le parcours garde-t-il son sens quand l’écran rétrécit ? Ces questions simples révèlent souvent plus qu’une longue liste de préférences esthétiques.',
        'Une fois la direction choisie, les détails sont repris avec méthode. Les espacements sont harmonisés, les composants partagés sont vérifiés et les états interactifs sont comparés à la maquette. Cette étape réduit les écarts et transforme une bonne intention en interface fiable.',
        'La mise en ligne ne termine pas l’observation. Les usages réels peuvent faire apparaître un besoin oublié ou un point de friction inattendu. Une étude utile explique donc aussi ce qui peut évoluer et les signes qui permettront de décider de la suite.',
      ],
      en: [
        'Before designing, look at what already exists and listen to the people who use it. Habits reveal points of support, moments of hesitation, and expectations that may not appear in a brief. Observing them helps start with a real problem instead of a solution imagined too early.',
        'This case study gathers the decisions and details that shaped the result. Each choice responds to a constraint or goal: clarify a step, reduce friction, or make information easier to find. The outcome is easier to understand when the reasoning behind it remains visible.',
        'Early explorations help compare several directions. A mockup may reveal a heading that is too quiet, an image that pulls focus, or an action that is difficult to spot. Feedback makes it possible to adjust the composition before these issues become costly to change.',
        'The final version keeps a trace of those trade-offs. It shows how context, content, and user feedback come together in a coherent interface. This study does not offer a universal recipe; it explains why this response fit this particular project.',
        'The result is then judged through concrete tasks. Can people find the right information quickly? Does the main action remain obvious? Does the journey still make sense when the screen gets smaller? These simple questions often reveal more than a long list of aesthetic preferences.',
        'Once a direction is selected, details are reviewed methodically. Spacing is brought into alignment, shared components are checked, and interactive states are compared with the design. This step closes the gap between a good intention and a dependable interface.',
        'Launching the work does not end the observation. Real use may reveal an overlooked need or an unexpected point of friction. A useful case study also explains what could change and which signs will help decide what to do next.',
      ],
    },
  },
  {
    slug: 'notes-in-the-margins',
    title: { fr: 'Notes dans les marges', en: 'Notes in the Margins' },
    description: {
      fr: 'Un essai visuel autour des traces, des gestes et des histoires discrètes.',
      en: 'A visual essay about traces, gestures, and quiet stories.',
    },
    tag: { fr: 'Essais visuels', en: 'Visual Essays' },
    image: '/images/presentation/rain-heart-duo.webp',
    publishedAt: '2026-02-11',
    paragraphs: {
      fr: [
        'Les images racontent parfois ce que les mots laissent de côté. Un détail dans une marge, une lumière sur une surface ou le mouvement d’une main peuvent donner une autre épaisseur à une histoire. L’image ne remplace pas le texte : elle propose un angle que le texte ne peut pas toujours atteindre.',
        'Cet essai rassemble quelques observations et les laisse dialoguer entre elles. Chaque visuel conserve sa singularité, mais leur rapprochement fait apparaître des motifs communs. Le lecteur peut suivre l’ordre proposé ou s’arrêter sur l’image qui retient son attention.',
        'La mise en page relie ces fragments sans les uniformiser. Une légende apporte le contexte nécessaire, tandis que l’espace autour de l’image préserve ses détails. Les tailles et les rythmes changent lorsque le contenu l’exige, afin que la série ne devienne pas une grille mécanique.',
        'Regarder prend du temps, et le parcours doit pouvoir ralentir. Les repères de navigation facilitent le retour à une section sans détourner l’attention de l’image en cours. L’essai se découvre alors comme une suite de notes : certaines se répondent tout de suite, d’autres continuent de résonner après la lecture.',
        'Les détails se révèlent souvent à la seconde lecture. Une forme qui paraissait décorative reprend un motif déjà aperçu, ou une couleur relie deux scènes éloignées. Les légendes donnent juste assez de contexte pour aider à voir ces correspondances sans expliquer chaque image à la place du lecteur.',
        'Le noir et blanc réduit la palette, mais ouvre d’autres possibilités. Le contraste structure le regard, les textures suggèrent une matière et les lignes dessinent une direction. En retirant la couleur, chaque décision de cadrage et de valeur devient plus apparente.',
        'L’ordre des images compte, sans enfermer l’interprétation. Une séquence peut installer une attente puis la déplacer, mais le lecteur garde la liberté de revenir en arrière. L’essai conserve ainsi une trame lisible tout en laissant de la place à des associations personnelles.',
      ],
      en: [
        'Images can tell what words leave aside. A detail in a margin, light across a surface, or the motion of a hand can add another layer to a story. An image does not replace the text; it offers an angle the text may not reach on its own.',
        'This essay brings a few observations together and lets them speak to one another. Each image keeps its own character, while their proximity reveals recurring patterns. Readers can follow the suggested order or pause at the image that catches their attention.',
        'The layout connects these fragments without making them uniform. A caption gives the necessary context, while space around each image preserves its details. Sizes and rhythms change when the content calls for it, so the sequence never feels like a mechanical grid.',
        'Looking takes time, and the journey should allow readers to slow down. Navigation cues make it easy to return to a section without pulling attention away from the image at hand. The essay unfolds like a series of notes: some answer one another immediately, while others linger after the reading ends.',
        'Details often appear on a second look. A shape that seemed decorative may echo an earlier motif, or a color may connect two distant scenes. Captions offer just enough context to help readers notice these relationships without explaining every image for them.',
        'Black and white narrows the palette while opening other possibilities. Contrast directs the eye, texture suggests material, and lines create movement. Without color, decisions about framing and value become easier to see.',
        'The sequence matters without fixing the interpretation. A series may build an expectation and then shift it, while readers remain free to look back. The essay keeps a clear thread and still leaves room for personal associations.',
      ],
    },
  },
  {
    slug: 'small-signals',
    title: { fr: 'Les petits signaux', en: 'Small Signals' },
    description: {
      fr: 'Quelques repères pour lire les usages numériques sans perdre de vue les personnes.',
      en: 'A few ways to read digital habits without losing sight of the people behind them.',
    },
    tag: { fr: 'Analytique', en: 'Analytics' },
    image: '/images/presentation/esc.webp',
    publishedAt: '2026-01-22',
    paragraphs: {
      fr: [
        'Les chiffres éclairent une situation quand on les replace dans leur contexte. Un pic de visites peut signaler un article partagé, une campagne ou un besoin ponctuel. Sans cette histoire, le nombre reste isolé et pousse facilement à tirer une conclusion trop rapide.',
        'Le bon indicateur aide à poser une meilleure question, pas à remplacer le jugement. Il montre une tendance, puis invite à regarder ce qui l’explique : le type de contenu, la saison ou le chemin emprunté par les visiteurs. Les mesures prennent leur sens dans cette conversation avec le réel.',
        'Une interface analytique gagne à distinguer les signaux utiles du bruit. Des chiffres arrondis, des comparaisons cohérentes et des périodes clairement nommées facilitent la lecture. Trop de précision apparente peut donner une confiance injustifiée à des données qui restent partielles.',
        'Les petits changements méritent aussi une observation attentive. Un titre plus clair peut augmenter les ouvertures sans améliorer la lecture jusqu’au bout. En suivant plusieurs signaux ensemble, on évite de confondre visibilité et utilité, puis on peut décider de la prochaine expérience à mener.',
        'Le contexte change la manière de lire une mesure. Une semaine de lancement, une période de vacances ou une publication partagée par un partenaire ne sont pas directement comparables. Noter ces événements permet d’interpréter une variation avant de modifier la stratégie.',
        'Les tableaux de bord les plus utiles montrent peu de données, mais les rendent faciles à relier à une décision. Une courbe seule décrit un mouvement ; une annotation, une comparaison ou une segmentation peut en expliquer la portée. Le lecteur doit pouvoir passer du signal à la question suivante.',
        'Enfin, les indicateurs sont des outils collectifs. Ils servent à discuter des priorités avec l’équipe éditoriale, pas à distribuer des notes aux textes. Une mesure bien choisie permet d’apprendre, de reconnaître ses limites et de faire évoluer une hypothèse plutôt que de la défendre à tout prix.',
      ],
      en: [
        'Numbers clarify a situation when placed in context. A rise in visits may point to a shared article, a campaign, or a temporary need. Without that story, the number stays isolated and makes it easy to draw a conclusion too quickly.',
        'A useful measure helps us ask a better question; it does not replace judgment. It shows a trend, then invites us to look for what explains it: the kind of content, the season, or the path visitors took. Metrics gain meaning through this conversation with reality.',
        'An analytics interface benefits from separating useful signals from noise. Rounded numbers, fair comparisons, and clearly named time periods make patterns easier to read. Too much apparent precision can create unjustified confidence in data that remains incomplete.',
        'Small changes deserve careful observation too. A clearer headline might increase opens without helping readers finish the story. By following several signals together, we avoid confusing visibility with usefulness and can choose the next experiment with more care.',
        'Context changes how a metric should be read. A launch week, a holiday period, or a story shared by a partner are not directly comparable. Recording these events helps explain a shift before changing the strategy.',
        'The most useful dashboards show little data but make it easy to connect that data to a decision. A line describes movement; an annotation, comparison, or segment can explain its meaning. Readers should be able to move from a signal to the next question.',
        'Metrics are also tools for a team. They help people discuss priorities with editors instead of assigning scores to stories. A well-chosen measure makes room for learning, acknowledges its limits, and helps update a hypothesis rather than defend it at all costs.',
      ],
    },
  },
  {
    slug: 'a-recognizable-voice',
    title: { fr: 'Une voix reconnaissable', en: 'A Recognizable Voice' },
    description: {
      fr: 'Une identité se construit dans les choix répétés, des mots aux images.',
      en: 'An identity takes shape through repeated choices, from words to images.',
    },
    tag: { fr: 'Identité de marque', en: 'Brand' },
    image: '/images/presentation/turning-page.webp',
    publishedAt: '2025-12-08',
    paragraphs: {
      fr: [
        'Une identité forte reste cohérente sans devenir rigide. Elle se reconnaît dans les choix qui reviennent — une façon de titrer, un équilibre entre texte et image, une palette mesurée — plutôt que dans un effet isolé. Cette continuité aide les lecteurs à retrouver un espace familier.',
        'Elle donne des repères et laisse assez de place aux idées nouvelles. Les règles doivent soutenir le contenu, pas l’obliger à se répéter. Un projet peut demander une composition plus dense ou une image plus expressive tout en gardant le même soin porté à la lisibilité et aux détails.',
        'Le ton participe lui aussi à la reconnaissance. Des phrases directes et des libellés cohérents créent une expérience plus prévisible. Lorsque les mots changent de registre à chaque écran, les lecteurs doivent réapprendre les mêmes actions ; une voix stable leur permet plutôt de se concentrer sur le sujet.',
        'Construire une identité consiste donc à choisir ce qui mérite de rester constant et ce qui peut évoluer. La structure, la typographie et le langage posent des bases ; les histoires, les images et les projets leur donnent de nouvelles formes. La cohérence devient une manière de faire, pas un décor figé.',
        'Cette voix se construit aussi dans les choix éditoriaux. Les sujets retenus, la profondeur des explications et la façon de créditer les images disent quelque chose du projet. Une identité crédible se reconnaît à ces décisions répétées autant qu’à son apparence.',
        'La cohérence facilite les changements futurs. Quand les principes sont compris, de nouvelles pages peuvent rejoindre le site sans copier exactement une composition existante. Les règles communes servent de point de départ, puis le contenu indique où il faut s’en écarter.',
        'L’identité s’entretient dans le temps. Les mots évoluent, les images changent et les usages se déplacent, mais certains engagements peuvent rester stables : rendre les contenus accessibles, traiter les personnes avec soin et donner aux idées l’espace qu’elles demandent.',
      ],
      en: [
        'A strong identity stays consistent without becoming rigid. It is recognized through recurring choices — a way of writing headlines, a balance between text and image, a measured palette — rather than a single effect. This continuity helps readers return to a familiar space.',
        'It offers familiar cues while leaving room for new ideas. Rules should support the content, not force it to repeat itself. A project may call for a denser composition or a more expressive image while keeping the same care for legibility and detail.',
        'Tone also contributes to recognition. Direct sentences and consistent labels make the experience easier to predict. When wording changes register on every screen, readers must relearn familiar actions; a stable voice lets them focus on the subject instead.',
        'Building an identity means choosing what should stay consistent and what can evolve. Structure, typography, and language set the foundation; stories, images, and projects give them new forms. Coherence becomes a way of working, not a fixed decoration.',
        'Editorial choices also shape this voice. The subjects selected, the depth of explanation, and the way images are credited all say something about a project. A credible identity is recognized through repeated decisions as much as through its appearance.',
        'Coherence makes future changes easier. Once the principles are understood, new pages can join the site without copying an existing composition exactly. Shared rules provide a starting point, then the content shows where they should bend.',
        'Identity is maintained over time. Words evolve, images change, and habits shift, while some commitments can remain steady: make content accessible, treat people with care, and give ideas the room they need.',
      ],
    },
  },
  {
    slug: 'rain-heart',
    title: { fr: 'Rain Heart', en: 'Rain Heart' },
    description: {
      fr: 'Une illustration autour des gestes simples et des histoires partagées.',
      en: 'An illustration about small gestures and the stories people share.',
    },
    tag: { fr: 'Illustration', en: 'Illustration' },
    image: '/images/presentation/rain-heart-duo.webp',
    publishedAt: '2026-07-12',
    paragraphs: {
      fr: ['Rain Heart explore la tendresse à travers deux petites scènes dessinées.', 'Cette page de démonstration présente le visuel et son intention.'],
      en: ['Rain Heart explores tenderness through two small illustrated scenes.', 'This preview introduces the artwork and its intent.'],
    },
    isProject: true,
  },
  {
    slug: 'thelma-et-louise',
    title: { fr: 'Thelma & Louise', en: 'Thelma & Louise' },
    description: {
      fr: 'Une composition en noir et blanc inspirée par la route et les récits d’émancipation.',
      en: 'A black-and-white composition inspired by the open road and stories of independence.',
    },
    tag: { fr: 'Affiche', en: 'Poster' },
    image: '/images/presentation/thelma-et-louise.webp',
    publishedAt: '2026-06-20',
    paragraphs: {
      fr: ['Le dessin travaille le contraste, la perspective et les grands espaces du paysage.', 'Cette page de démonstration rassemble l’affiche et quelques notes sur sa composition.'],
      en: ['The drawing works with contrast, perspective, and the open spaces of the landscape.', 'This preview brings the poster together with a few notes on its composition.'],
    },
    isProject: true,
  },
]

export function localizedPath(path: string, locale: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return locale === 'en' ? normalizedPath : `/${locale}${normalizedPath}`
}
