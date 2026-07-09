import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, ArrowLeft, Tag, Trophy } from 'lucide-react';

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

interface ArticleData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  category: string;
  tags: string[];
  imageAlt: string;
  author: string;
  publishedAt: string;
  views: number;
  readTime: number;
  league?: string;
  isBreaking?: boolean;
}

const ARTICLES: ArticleData[] = [
  {
    id: 'wc1', slug: 'england-france-qf-preview', isBreaking: true,
    title: 'England vs France: The Quarter-Final the World Has Been Waiting For',
    excerpt: "Mbappé vs the Three Lions. Bellingham vs the French midfield. The heavyweight clash of World Cup 2026 is here and it promises to be an instant classic.",
    paragraphs: [
      "Quarter-Final. MetLife Stadium. 82,000 fans, a global television audience north of 800 million, and the two nations who have defined modern football squaring off for everything. England versus France is not just a match — it is a civilisational event draped in football kit.",
      "Kylian Mbappé enters the clash as the tournament's leading scorer with six goals and two assists. The Real Madrid captain has been relentless — cutting inside with that signature lean, accelerating past defenders who have studied him for hundreds of hours and still cannot stop him. Gareth Southgate knows his game intimately. He will have built an entire tactical gameplan around preventing Mbappé from receiving the ball in the half-space. Whether it works is another matter.",
      "Harry Kane, with five goals to his name, has finally delivered the transformative international tournament performance that has eluded him since 2018. Jude Bellingham has been the most complete midfielder at this World Cup — creative, combative, decisive. Bukayo Saka has been England's most consistent performer. But France's defensive structure — Upamecano commanding the air, Camavinga winning every second ball — is the sternest examination this England side has faced.",
      "The tactical battle will centre on England's ability to pin France deep and prevent the counter-attack that has punished every team that has left space behind against Deschamps' side. Southgate will likely deploy a high press from the front three and lean on England's set-piece superiority — their greatest weapon and arguably the sharpest in international football.",
      "History says France. The odds say France. But 82,000 voices in East Rutherford and four decades of English hurt say something else entirely. The expanded 48-team format has given us many moments, but this is the match that justifies every single extra game. Kick-off cannot arrive soon enough."
    ],
    category: 'preview',
    tags: ['World Cup 2026', 'England', 'France', 'Quarter-Final', 'Mbappé', 'Bellingham'],
    imageAlt: 'England vs France World Cup 2026 Quarter-Final',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    views: 284000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc2', slug: 'yamal-masterclass-analysis', isBreaking: false,
    title: "Yamal is the Player of the Tournament — and He's Only 18",
    excerpt: "From Barcelona teenager to World Cup superstar. Lamine Yamal's masterclass in Spain's run has left even the world's greatest in awe. A tactical breakdown.",
    paragraphs: [
      "Seventeen years and 363 days old when Spain kicked off their World Cup campaign. Eighteen now, and already the undisputed best player in the tournament. Lamine Yamal is not merely good for his age — he is simply the finest player on the biggest stage in world football.",
      "Four goals. Six assists. An average rating of 9.3 across five matches. Numbers that would make any player proud, let alone a teenager making his first World Cup appearance. The Barcelona prodigy — who shares a birthday with Spain's iconic penalty triumph at Euro 2012 — has grown up in front of the entire world this summer, and the world has watched in stunned admiration.",
      "What separates Yamal from his contemporaries is not his pace, though he has plenty. It is not merely his technique, though it is already elite. It is his decision-making. Operating in tight spaces against senior defenders with decades of tournament experience, Yamal identifies and executes passes that simply do not appear to exist. In the press room after Spain's 2–0 victory over Japan, the Japanese manager sat in respectful silence for ten seconds before answering the question about Yamal. The pause said everything.",
      "Against Japan in the round of 16, he ran the show so completely that by the 60th minute, Japan's left back had simply stopped trying to engage him in one-on-ones. Yamal had beaten him eleven times. Instead, Japan began doubling up — and that created the space for Pedri and Morata to operate. Spain score because of Yamal. They also score because of the space Yamal creates.",
      "Pep Guardiola, watching from home, called Yamal 'different from anything football has produced before.' When Guardiola speaks in those terms — a man who has coached Messi, Iniesta, Xavi, De Bruyne — the world should listen very carefully. What we are witnessing at World Cup 2026 is not a prodigy having a good tournament. It is the emergence of the next great player."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Spain', 'Yamal', 'Analysis', 'Player of the Tournament'],
    imageAlt: 'Lamine Yamal World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    views: 198000, readTime: 8, league: 'World Cup 2026',
  },
  {
    id: 'wc3', slug: 'messi-farewell-world-cup', isBreaking: false,
    title: "The Last Dance: Is This Really Messi's Final World Cup Miracle?",
    excerpt: "Argentina's talisman continues to defy logic, age, and expectation. Six assists in five games — at 38 years old. We witness the impossible, yet again.",
    paragraphs: [
      "There are no words left for what Lionel Messi does to a football match. After twenty-two years at the highest level, after eight Ballon d'Or awards, after the 2022 World Cup in Qatar, after a season at Inter Miami that observers said might signal the gentle slow-down — here he is. At 38 years old. At the quarter-finals of the World Cup 2026. With six assists in five games.",
      "The mathematics of Messi's tournament are simply illogical. Six assists places him joint-first with Lamine Yamal. Four goals — one free-kick, two close-range finishes, one long-range effort against Morocco in extra time that silenced 75,000 people. Every time football decides it has found the limits of Messi's impact, he rewrites the rules.",
      "What is perhaps most remarkable in 2026 is not the numbers but the nature of the performances. In 2022, Messi occasionally drifted in and out of matches, saving himself for moments that mattered. In 2026, he is everywhere — pressing from the front, tracking back, demanding the ball in tight areas. The tactical intelligence has replaced the raw pace he once had. The result is the same.",
      "Argentina coach Lionel Scaloni has built the team around protecting Messi while also liberating him. Julián Álvarez and Rodrigo De Paul do the defensive work. Mac Allister provides the creative engine. And Messi operates as the orchestrator, the last pass, the decisive moment. Brazil await in the quarter-final. It may be Messi's last match at a World Cup. Nothing about his tournament suggests he is prepared to let it end there.",
      "After Argentina's extra-time victory over Morocco, Messi sat on the pitch for three minutes before getting up. When asked about it, he smiled: 'My legs needed a moment.' The world needed a moment too — to absorb what we had just seen."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Argentina', 'Messi', 'Analysis'],
    imageAlt: 'Lionel Messi Argentina World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    views: 421000, readTime: 7, league: 'World Cup 2026',
  },
  {
    id: 'wc4', slug: 'brazil-argentina-qf-preview', isBreaking: false,
    title: "Brazil vs Argentina: The Super Clásico That Shakes the World",
    excerpt: "For the first time since 2021's Copa América, the two South American giants collide. On the World Cup's biggest stage — at MetLife Stadium with everything on the line.",
    paragraphs: [
      "There is no rivalry in football quite like this one. Not El Clásico. Not the Old Firm. Not England vs Germany. Brazil versus Argentina is the axis around which South American football — and indeed the entire romantic mythology of the game — revolves. They have met 113 times. They are meeting for the 114th at the quarter-final stage of the 2026 World Cup. MetLife Stadium, 82,500 seats, and the highest stakes in football.",
      "Brazil arrive having been the most exciting team in the tournament. Sixteen goals scored. Vinícius Jr terrorising every defence he has encountered — five goals, four assists, a rating above nine in every match. Rodrygo, operating in the shadow of Vinícius, has contributed four goals of his own. Fernando Diniz has built a team of such fluid, joyous attacking football that neutrals have adopted them as favourites.",
      "Argentina arrive differently. Three of their five matches have required overtime or second-half comebacks. Messi has delivered magic in every one. Julián Álvarez has scored five goals. The Argentine defensive organisation — Romero, Otamendi, Tagliafico — has been disciplined and difficult to break. They do not have Brazil's front-foot energy. They have something arguably more dangerous: an ability to hurt you from any position on the pitch.",
      "The tactical battle will be between Brazil's expansive pressing structure and Argentina's ability to absorb pressure and counter-attack. Diniz's 4-2-3-1 invites wide players to crash forward and create overloads. Scaloni will station De Paul and Mac Allister centrally to prevent Vinícius from finding the ball in dangerous areas. The key man? Casemiro. If he can dominate the middle third, Brazil's build-up stalls.",
      "The last meeting between these nations at a World Cup was the 1990 Round of 16 — Caniggia's iconic header putting out Brazil. The nations have not met at a World Cup since. Until now. The build-up has been measured, respectful even. The match itself will be anything but."
    ],
    category: 'preview',
    tags: ['World Cup 2026', 'Brazil', 'Argentina', 'Quarter-Final', 'Super Clásico'],
    imageAlt: 'Brazil vs Argentina World Cup 2026 Quarter-Final',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    views: 376000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc5', slug: 'mbappe-golden-boot-race', isBreaking: false,
    title: "Mbappé vs Vinícius: The Golden Boot Race Is Getting Spicy",
    excerpt: "Six goals for France's captain. Five goals and four assists for Brazil's wizard. The award could be decided on Saturday in the most anticipated match of the tournament.",
    paragraphs: [
      "Six goals. That is where Kylian Mbappé sits at the top of the World Cup 2026 Golden Boot standings, one ahead of a three-way tie at five that includes Vinícius Jr, Julián Álvarez, and Harry Kane. But Mbappé's lead could mean nothing if France and Brazil take divergent paths to the final. The Golden Boot race and the tournament are, in this extraordinary World Cup, inseparably intertwined.",
      "Mbappé's six goals have come in five different styles: a penalty against Ecuador, a trademark cutting run and finish against Denmark, a brilliant free-kick against Portugal in the group stage, a composed header from a corner, and two goals in the round of 16 demolition of Poland. The range is what makes him extraordinary. He can score any type of goal, from any position, against any defence.",
      "Vinícius Jr has matched Mbappé's influence, if not his scoring rate. Five goals — but four assists to complement them, making Vinícius the most complete forward in the tournament by combined output. Against Mexico in the round of 16, his performance was simply otherworldly: two goals, one assist, twelve dribbles completed. The Mexican full-back was substituted at half-time. Not due to injury.",
      "The race will almost certainly be decided by what happens in the quarter-finals on Saturday. If France beat England and Brazil beat Argentina, we get a potential Mbappé-Vinícius semi-final duel. If both score, the drama only intensifies. At the end of five tournaments and 97 World Cup goals, this may be the most compelling Golden Boot race since Gary Lineker in 1986."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Mbappé', 'Vinícius Jr', 'Golden Boot', 'France', 'Brazil'],
    imageAlt: 'Golden Boot race World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    views: 232000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc6', slug: 'usa-surprise-package', isBreaking: false,
    title: "USA's Stunning Run: How America Became the Tournament's Biggest Story",
    excerpt: "Nobody predicted this. The host nation topping Group H, beating Iran, and now a QF clash with Portugal. A generation of talent — and 80,000 home fans — making history.",
    paragraphs: [
      "Nobody predicted this. Not the pundits who dismissed USA as a group-stage story. Not the analysts who said their back four would be exposed by the pressure of knockout football. Not the betting markets, which had the USA at 40/1 when the tournament began. Three weeks later, Christian Pulisic is leading the most surprising quarter-final run in World Cup history.",
      "The numbers tell an extraordinary story. Group H winners with seven points. A 2–1 victory over Iran in the round of 16 — a match with an entirely separate geopolitical backdrop that the players handled with remarkable composure and professionalism. Four goals from Pulisic. Three from Gio Reyna, who has finally fulfilled the vast potential that made him one of the most hyped teenagers in American football history.",
      "What makes USA's run fascinating is the tactical evolution under Gregg Berhalter. In the 2022 World Cup, USA were defensively solid but toothless. In 2026, playing in front of 80,000 home fans at venues including MetLife, AT&T Stadium, and Levi's, they have been genuinely threatening. The crowd factor is real — every USA match has the atmosphere of a Super Bowl combined with the passion of a Copa América.",
      "The quarter-final against Portugal presents a different kind of challenge. Cristiano Ronaldo's final World Cup, a team ranked 6th in the world, and a squad depth USA simply cannot match. But Pulisic has been here before. Reyna has been here before. And no team in this tournament has had the home advantage USA brings. If the United States can reach the semi-final on their home soil, it will change American football permanently."
    ],
    category: 'match-report',
    tags: ['World Cup 2026', 'USA', 'Pulisic', 'Quarter-Final'],
    imageAlt: 'USA at World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    views: 189000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc7', slug: 'transfer-window-post-wc', isBreaking: false,
    title: "Summer 2026 Transfer Window: Which Stars Will Move After the World Cup?",
    excerpt: "The tournament has created new value and new buyers. Wirtz to Real Madrid, Osimhen to Liverpool, Yamal's new deal — the summer is already moving.",
    paragraphs: [
      "The summer 2026 transfer window has not officially opened — that comes on July 21 — but the market has been moving for weeks. Every outstanding World Cup performance creates a new valuation, a new buyer, a new leverage point. The agents are busy. The club directors are scrambling.",
      "The most significant deal already agreed in principle is Victor Osimhen to Liverpool for a reported £85 million. The Nigerian striker, who had a resurgent Napoli season, has been the subject of Liverpool interest for over a year. The World Cup did not feature Osimhen — Nigeria did not qualify — but his club form convinced Anfield to move. The deal is expected to be confirmed by July 25.",
      "The biggest transfer saga of the summer involves Florian Wirtz. Three goals, three assists, and a man-of-the-match performance in Germany's round of 16 victory over Belgium. Real Madrid were already in discussions before the tournament. Now the asking price has jumped from €100 million to €130 million. Bayern Munich, aware they cannot hold him against his will, are negotiating a sell-on clause. The move appears inevitable.",
      "The most watched player at the tournament is the one who will not be moving anywhere. Lamine Yamal, who has emerged as the world's most exciting footballer after this World Cup, has signed a new six-year contract extension with Barcelona. The release clause? A reported €1 billion. It is, for now, the largest in football history. Real Madrid have the money, but they cannot afford the clause."
    ],
    category: 'transfer',
    tags: ['Transfers', 'Summer 2026', 'World Cup 2026', 'Wirtz', 'Osimhen', 'Yamal'],
    imageAlt: 'Summer 2026 Transfer Window',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    views: 155000, readTime: 7,
  },
  {
    id: 'wc8', slug: 'ronaldo-last-dance-portugal', isBreaking: false,
    title: "Ronaldo's Last Dance: Four Goals, One Final Chance at Glory",
    excerpt: "At 41, he's still on the scoresheet. Portugal's captain has defied every prediction. A QF against USA stands between him and a semi-final — and perhaps his ultimate legacy.",
    paragraphs: [
      "He said the 2022 World Cup might be his last. He said the same after Euro 2024. Now, at 41, after a Saudi Pro League season that critics said had slowed him irrevocably, Cristiano Ronaldo is at the World Cup 2026 quarter-finals with four goals and the full weight of Portuguese football on his shoulders — exactly where he has always wanted to be.",
      "The four goals have all been vintage Ronaldo: two headers from set-pieces exploiting his still-extraordinary leap and timing, a penalty dispatched with ice-cold precision, and — most memorably — a left-foot volley against Morocco in the group stage that will feature in highlight reels for decades. The Saudi League may have reduced some of his raw pace, but the technique, the positioning, the finishing: those have never left.",
      "Roberto Martínez has managed Ronaldo magnificently throughout this tournament, resting him during low-intensity moments, protecting him in the final minutes of comfortable victories, and ensuring his body arrives at the knockout stages in the best possible condition. The result is a Ronaldo who has been lethal in precisely the moments that matter, rather than chasing every game.",
      "The quarter-final against USA is the match Ronaldo — and the entire Portuguese squad — has been building towards. A semi-final berth would make him the oldest outfield player to reach the World Cup's final four. The final would make him the oldest finalist in history. Ronaldo does not talk in terms of records. He talks in terms of winning. One last chance. He intends to take it."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Portugal', 'Ronaldo', 'Quarter-Final'],
    imageAlt: 'Cristiano Ronaldo Portugal World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    views: 341000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc9', slug: 'germany-dark-horses', isBreaking: false,
    title: "Germany: The Dark Horses Nobody Is Talking About Enough",
    excerpt: "Wirtz pulling the strings. Havertz leading the line. Nagelsmann's men have quietly assembled the most balanced squad in the tournament. Spain better be ready.",
    paragraphs: [
      "While Spain, France, Brazil, and Argentina have occupied the pre-tournament headlines, Julian Nagelsmann's Germany have quietly assembled the most complete squad at World Cup 2026. Balanced in every position, dangerous from all areas of the pitch, and with the tactical flexibility to adapt to any opponent — Germany are the team nobody is talking about enough, and Spain should be very worried.",
      "The key to Germany's run has been Florian Wirtz. Twenty-three years old, operating as the number ten in Nagelsmann's 4-2-3-1, Wirtz has contributed four goals and three assists — numbers that place him in the elite company of Mbappé and Yamal in terms of direct involvement. His performance in the round of 16 victory over Belgium — a goal, an assist, and the complete domination of the Belgian midfield — was one of the tournament's finest individual showings.",
      "Kai Havertz has finally found his ideal position in the national team at the age of 27. Leading the line for Germany with four goals, his intelligent movement, technical quality, and composure in front of goal have been the target that Wirtz aims for. Behind them, Joshua Kimmich has been the tournament's best defensive midfielder — aggressive in the press, precise in distribution, the engine that runs the Nagelsmann machine.",
      "The quarter-final against Spain is Germany's sternest test. Spain have the best possession stats in the tournament. But Germany have the counter-attack to punish any team that leaves space behind. Wirtz vs Yamal. Havertz vs the Spanish centre-backs. Kimmich vs Pedri. Every individual battle is compelling. The collective battle will determine whether Germany are genuine contenders or quarter-final exits."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Germany', 'Wirtz', 'Quarter-Final', 'Analysis'],
    imageAlt: 'Germany World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    views: 127000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc10', slug: 'metlife-stadium-final-venue', isBreaking: false,
    title: "MetLife Stadium: The Cathedral That Will Host Football's Greatest Moment",
    excerpt: "On July 19, 82,500 fans will witness the World Cup Final at East Rutherford, New Jersey. A look inside the stadium set to host the most-watched sporting event in history.",
    paragraphs: [
      "At 82,500 seats, MetLife Stadium in East Rutherford, New Jersey, is the largest stadium at World Cup 2026 and will host the final on July 19. It is the home of the NFL's Giants and Jets, a retractable-roof arena of staggering scale, and on the night of the final, it will host the most-watched sporting event in human history.",
      "The stadium has already hosted five World Cup matches including the round of 16 thriller between Spain and Japan. The noise levels during the USA vs Iran match — which was held at MetLife and drew 80,000 fans — reportedly broke the ground's decibel record set during a 2011 Giants playoff game. Football has arrived in New Jersey in a way that nobody entirely predicted.",
      "The infrastructure surrounding MetLife — a 15-minute train ride from Penn Station in Midtown Manhattan — has made it the most accessible major stadium in the United States. FIFA commandeered 3,000 hotel rooms across the tristate area for the tournament. Tickets for the final on the secondary market currently list for upwards of $15,000.",
      "Ten days from now, two nations will walk out of that tunnel onto the MetLife turf with the World Cup trophy waiting. The stadium's enormous screens will broadcast every moment to those 82,500 fans and to a television audience estimated at 1.2 billion. Football's biggest night will happen here. New Jersey will remember it forever."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'MetLife Stadium', 'Final', 'USA'],
    imageAlt: 'MetLife Stadium World Cup Final 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    views: 98000, readTime: 4,
  },
  {
    id: 'wc11', slug: 'spain-possession-stats', isBreaking: false,
    title: "Spain by the Numbers: The Most Dominant Team at World Cup 2026",
    excerpt: "64% average possession. 14 goals in 5 games. 3 conceded. Tiki-taka reimagined — Spain under De la Fuente is a football masterclass distilled into statistics.",
    paragraphs: [
      "Every World Cup has a team that makes football look easy. In 1974 it was the Netherlands. In 2010 it was Xavi's Spain. In 2026, it is De la Fuente's Spain — a team so technically superior to every opponent they have faced that 64% possession has become their floor, not their ceiling.",
      "Fourteen goals in five matches. Three conceded — two in the 3–1 group stage win over New Zealand where De la Fuente was rotating his squad. In the four matches with first-choice selection, Spain have conceded once. Their 2–0 victory over Japan in the round of 16 featured 71% possession and 24 shots — a performance so complete that the Japan manager afterwards simply said, 'They were perfect.'",
      "The engine of Spain's dominance is the midfield triangle of Pedri, Rodri, and Dani Olmo. Rodri wins the ball. Pedri moves it. Olmo creates. Above them, Yamal and Morata play in a system so fluid that it is difficult to identify where it begins or ends. The ball finds space that the human eye cannot anticipate.",
      "De la Fuente's most significant tactical innovation is the role of the full-backs. Carvajal and Cucurella are not wide defenders in the traditional sense — they are deep creators who invert into the midfield when Spain build from the back, creating a 5-v-3 numerical overload in the central zones before the ball reaches Yamal's feet. It is a beautiful and maddening system to play against. Germany will try in the quarter-final. They will almost certainly fail."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'Spain', 'Stats', 'Analysis', 'Tactics'],
    imageAlt: 'Spain statistics World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    views: 88000, readTime: 4, league: 'World Cup 2026',
  },
  {
    id: 'wc12', slug: '48-team-format-verdict', isBreaking: false,
    title: "48 Teams: Was the Expanded Format a Success? The Verdict After 5 Weeks",
    excerpt: "More upsets. More nations. More stories. The 48-team World Cup delivered drama at every stage. But critics still have a point about the early group-stage bloat.",
    paragraphs: [
      "When FIFA announced the expanded 48-team format in 2017, the reaction from the football world was predominantly negative. More teams, critics argued, meant more mismatches. More group-stage matches meant more fatigue. A bigger competition did not automatically mean a better one. Five weeks into World Cup 2026, with eight teams remaining, it is time to deliver an honest verdict — and the result is more nuanced than either side predicted.",
      "The first round of group games was, as feared, occasionally grinding. New Zealand 1–0 Fiji. Ecuador 5–0 El Salvador. Panama 0–4 Brazil. The matches that produced early mismatches were numerous, and the scheduling of three simultaneous games per evening created a fragmented viewing experience unlike anything previous World Cups had offered.",
      "But by the second round of group games, something shifted. The 48-team format generated genuine footballing stories that a 32-team competition would never have created. Morocco's run from qualification through the group stage represented an entire continent's pride. Iran's dramatic qualification for the knockout stages from Group D brought a different dimension to Pulisic's eventual match-winning goal against them in the round of 16.",
      "The knockout stages have been magnificent. Sixteen matches. Eleven decided by a single goal. Three going to extra time. The quality of football in the round of 16 arguably surpassed previous tournaments precisely because sixteen nations arrived with more recent match experience and sharper tactical preparation. The eight remaining teams are eight of the best football nations on earth. Nobody serious is arguing the wrong teams are left. The format worked."
    ],
    category: 'analysis',
    tags: ['World Cup 2026', 'FIFA', '48-team format', 'Analysis'],
    imageAlt: '48 team World Cup format analysis',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
    views: 75000, readTime: 8,
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtViews(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return { title: 'Article Not Found | GoalRush Global' };
  return {
    title: `${article.title} | GoalRush Global`,
    description: article.excerpt,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt },
  };
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article = ARTICLES.find(a => a.slug === slug) ?? null;

  try {
    const res = await fetch(`${BASE}/news/${slug}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const { data } = await res.json();
      if (data?.title) {
        article = { ...article, ...data, paragraphs: article?.paragraphs ?? [] };
      }
    }
  } catch {}

  if (!article) notFound();

  const related = ARTICLES
    .filter(a => a.slug !== slug && a.tags.some(t => article!.tags.includes(t)))
    .slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    url: `https://www.goalrushglobal.com/news/${slug}`,
    keywords: article.tags.join(', '),
    articleSection: article.category,
    author: { '@type': 'Organization', name: article.author, url: 'https://www.goalrushglobal.com' },
    publisher: {
      '@type': 'Organization',
      name: 'GoalRush Global',
      logo: { '@type': 'ImageObject', url: 'https://www.goalrushglobal.com/og-image.jpg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.goalrushglobal.com/news/${slug}` },
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/news" className="text-brand-gray hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />News
          </Link>
          <span className="text-brand-muted">/</span>
          <span className="text-brand-gray capitalize">{article.category.replace(/-/g, ' ')}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {article.isBreaking && (
              <span className="inline-flex items-center bg-brand-red/10 text-brand-red-light text-xs font-bold px-2.5 py-1 rounded-full">
                BREAKING
              </span>
            )}
            {article.league && (
              <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Trophy className="w-3 h-3" />{article.league}
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-display tracking-wider text-white leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-brand-gray text-lg leading-relaxed mb-5">{article.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-brand-gray text-xs border-t border-brand-border pt-4">
            <span className="text-brand-gold font-semibold">{article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />{fmtViews(article.views)} views
            </span>
            <span>{article.readTime} min read</span>
          </div>
        </header>

        {/* Hero image placeholder */}
        <div className="aspect-[16/9] bg-gradient-to-br from-brand-card via-brand-dark to-brand-black rounded-xl mb-8 flex items-center justify-center overflow-hidden border border-brand-border">
          <div className="text-center px-4">
            <Trophy className="w-16 h-16 text-yellow-400/20 mx-auto mb-3" />
            <span className="text-brand-muted text-sm">{article.imageAlt}</span>
          </div>
        </div>

        {/* Article body */}
        <div className="mb-10 space-y-5">
          {article.paragraphs.map((para, i) => (
            <p key={i} className={`leading-relaxed text-base ${i === 0 ? 'text-white text-lg font-medium' : 'text-brand-gray'}`}>
              {para}
            </p>
          ))}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 border-t border-brand-border pt-6">
            <Tag className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" />
            {article.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-brand-card border border-brand-border rounded-full text-xs text-brand-gray"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="gr-section-title mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(a => (
                <Link
                  key={a.slug}
                  href={`/news/${a.slug}`}
                  className="gr-card p-4 hover:border-brand-red/40 transition-all group"
                >
                  <div className="text-brand-gold text-[10px] font-bold uppercase tracking-wider mb-2">
                    {a.category.replace(/-/g, ' ')}
                  </div>
                  <h3 className="text-white text-sm font-semibold group-hover:text-brand-gold transition-colors line-clamp-3 mb-2 leading-snug">
                    {a.title}
                  </h3>
                  <div className="text-brand-gray text-xs">{timeAgo(a.publishedAt)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-brand-border pt-6">
          <Link href="/news" className="gr-btn-ghost flex items-center gap-2 w-fit">
            <ArrowLeft className="w-4 h-4" />Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
