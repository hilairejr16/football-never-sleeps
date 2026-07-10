/**
 * DB seed — WC 2026 articles + transfers
 * Run once: node apps/api/src/scripts/seed.js
 * Or via Railway console: node src/scripts/seed.js
 */
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const q = (sql, params = []) => pool.query(sql, params);

// ── Schema ──────────────────────────────────────────────────────────────────

async function createTables() {
  await q(`
    CREATE TABLE IF NOT EXISTS articles (
      id            SERIAL PRIMARY KEY,
      slug          TEXT UNIQUE NOT NULL,
      title         TEXT NOT NULL,
      excerpt       TEXT,
      content       TEXT,
      category      TEXT DEFAULT 'analysis',
      tags          JSONB DEFAULT '[]',
      image_url     TEXT,
      image_alt     TEXT,
      author        TEXT DEFAULT 'GoalRush AI',
      seo_title     TEXT,
      seo_description TEXT,
      read_time     INT DEFAULT 4,
      views         BIGINT DEFAULT 0,
      is_breaking   BOOLEAN DEFAULT false,
      published     BOOLEAN DEFAULT true,
      published_at  TIMESTAMPTZ DEFAULT NOW(),
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      league        TEXT
    )
  `);

  await q(`
    CREATE TABLE IF NOT EXISTS transfers (
      id            SERIAL PRIMARY KEY,
      player_name   TEXT NOT NULL,
      player_age    INT,
      position      TEXT,
      nationality   TEXT,
      from_club     TEXT,
      to_club       TEXT,
      fee           TEXT,
      status        TEXT DEFAULT 'rumour',
      source        TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await q(`
    CREATE TABLE IF NOT EXISTS players (
      id            SERIAL PRIMARY KEY,
      slug          TEXT UNIQUE NOT NULL,
      name          TEXT NOT NULL,
      team          TEXT,
      nationality   TEXT,
      position      TEXT,
      age           INT,
      goals         INT DEFAULT 0,
      assists       INT DEFAULT 0,
      rating        NUMERIC(3,1),
      bio           TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log('✅ Tables created');
}

// ── Articles ─────────────────────────────────────────────────────────────────

const img = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const ARTICLES = [
  {
    slug: 'france-morocco-qf-preview',
    title: 'France vs Morocco: Mbappé Eyes Semi-Final as Atlas Lions Aim for History Again',
    excerpt: "Morocco shocked the world in 2022. They're doing it again in 2026. But Mbappé and a full-strength France stand in the way.",
    content: `France and Morocco meet in one of the most eagerly anticipated quarter-finals of World Cup 2026. Morocco, who stunned the football world by reaching the semi-finals in Qatar, have gone one better on home soil — or rather, on North American soil — by surging into the last eight once more.\n\nKylian Mbappé has been in scintillating form throughout the tournament, with six goals to his name and the full-time captaincy sitting comfortably on his shoulders. France's depth is unrivalled: Griezmann, Dembélé, Camavinga, Tchouaméni — this is a squad built to win a World Cup.\n\nFor Morocco, Hakim Ziyech and Youssef En-Nesyri lead a side that is tactically astute, physically formidable, and driven by a sense of destiny. Coach Walid Regragui has drilled his team to defend deep and counter with devastating speed.\n\nThe match takes place at Gillette Stadium, Boston, on July 9. Kick-off: 4pm local time.`,
    category: 'preview',
    tags: JSON.stringify(['World Cup 2026', 'France', 'Morocco', 'Quarter-Final', 'Mbappé']),
    image_url: img('1574629810360-7efbbe195018'),
    image_alt: 'France vs Morocco World Cup Quarter-Final',
    is_breaking: true,
    views: 1920000,
    read_time: 5,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    slug: 'spain-belgium-qf-preview',
    title: 'Spain vs Belgium: Yamal vs De Bruyne — The QF That Has Everything',
    excerpt: "Belgium's Golden Generation vs Spain's next one. Yamal vs De Bruyne at SoFi Stadium, Inglewood — July 10.",
    content: `When the quarter-final draw was made, this was the fixture everyone circled. Spain vs Belgium — the most technically gifted nations left in the tournament, with a combined playing IQ that makes this an unmissable tactical contest.\n\nLamine Yamal, just 18, has been the player of the tournament. Six assists, four goals, and a fearlessness on the ball that belongs to another era. De Bruyne, 34, is answering every question about his age with seven assists of his own — the most of any player at the tournament.\n\nSpain's 4-3-3 presses with intensity and moves the ball with a rhythm and fluency that is simply beautiful to watch. Belgium, meanwhile, are dangerous on the counter and lethal from set pieces. Lukaku's physicality could be the difference if Belgium can get the ball to him quickly.\n\nSoFi Stadium, Inglewood. July 10, 8pm ET.`,
    category: 'preview',
    tags: JSON.stringify(['World Cup 2026', 'Spain', 'Belgium', 'Quarter-Final', 'Yamal', 'De Bruyne']),
    image_url: img('1560272564-c83b66b1ad12'),
    image_alt: 'Spain vs Belgium World Cup Quarter-Final',
    is_breaking: false,
    views: 1080000,
    read_time: 5,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    slug: 'norway-england-qf-preview',
    title: 'Norway vs England: Haaland Hunts His Greatest Prize — Miami, Jul 11',
    excerpt: "Eight goals. Five matches. Erling Haaland is unstoppable. England's golden generation must stop him at Hard Rock Stadium.",
    content: `Eight goals in five matches. Erling Haaland has done things at World Cup 2026 that belong in the company of Gerd Müller, Just Fontaine, and Ronaldo — the original. Norway's emergence as a genuine World Cup contender is the story of the tournament, and it is built entirely around their 25-year-old striker.\n\nEngland, meanwhile, have been effective if not beautiful. Bellingham's three goals and four assists make him one of England's best ever tournament performers. Harry Kane has also found his World Cup level at last — five goals, including the winner against Mexico. Gareth Southgate's side are organised, dangerous from set pieces, and improving with every game.\n\nThe question is simple: can England stop Haaland? No team has managed it yet. Paraguay, Saudi Arabia, Brazil (conceding three to him in a 4-3 thriller) and South Korea have all tried and failed.\n\nHard Rock Stadium, Miami. July 11, 6pm ET.`,
    category: 'preview',
    tags: JSON.stringify(['World Cup 2026', 'Norway', 'England', 'Quarter-Final', 'Haaland', 'Bellingham', 'Kane']),
    image_url: img('1531415074968-036ba1b575da'),
    image_alt: 'Norway vs England World Cup Quarter-Final Miami',
    is_breaking: false,
    views: 1340000,
    read_time: 6,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 100),
  },
  {
    slug: 'argentina-switzerland-qf-preview',
    title: "Argentina vs Switzerland: Can the Champions Survive the Penalty Kings?",
    excerpt: "Messi and the reigning champions vs Switzerland's penalty specialists at Arrowhead Stadium, Kansas City.",
    content: `Argentina arrive at the quarter-finals as reigning champions and, despite the advancing years of their talisman, as genuine contenders to retain the trophy. Lionel Messi, 38, has six assists in this tournament — joint-top with De Bruyne — and continues to operate on a plane that defies normal football logic. Julián Álvarez, with five goals, provides the finishing threat that Messi no longer needs to provide himself.\n\nSwitzerland are the dark horses left in the draw. Organised, technically excellent, and dangerous from set pieces, Murat Yakin's side beat Germany on penalties in the Round of 16 and have not lost a knockout game in their last four World Cup appearances.\n\nIf this goes to penalties, Switzerland must be considered favourites. But Argentina with Messi in full flow in normal time is a different proposition entirely.\n\nArrowhead Stadium, Kansas City. July 9, 8pm ET.`,
    category: 'preview',
    tags: JSON.stringify(['World Cup 2026', 'Argentina', 'Switzerland', 'Quarter-Final', 'Messi']),
    image_url: img('1560272564-c83b66b1ad12'),
    image_alt: 'Argentina vs Switzerland World Cup Quarter-Final',
    is_breaking: false,
    views: 1150000,
    read_time: 6,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 140),
  },
  {
    slug: 'lamine-yamal-wc-2026-masterclass',
    title: "Yamal is the Player of the Tournament — and He's Only 18",
    excerpt: "From Barcelona teenager to World Cup superstar. A tactical breakdown of how Yamal has dismantled every defence he has faced.",
    content: `There are players who arrive at a World Cup with a reputation to live up to. And then there is Lamine Yamal, who arrived in North America virtually unknown outside of Spain and Spain-adjacent football circles, and left the group stage as the most talked-about player on earth.\n\nAt 18 years and 26 days, he is the youngest player ever to score at a World Cup knockout stage. His six assists are the most of any non-midfielder in the tournament. He has created 31 chances — more than any other player.\n\nWhat makes Yamal so difficult to defend is his ambidexterity. He can cut inside onto his left and curl one into the far corner, or burst down the line on his right and deliver a ball that lands perfectly on a striker's head. He doesn't telegraph his intentions. He makes the decision at the last possible moment, which means defenders have to commit to one option — and they always choose wrong.\n\nCoach De la Fuente has given him licence to roam, which means Yamal appears in pockets of space across the entire front third. He's not just a right winger — he's a destabiliser of defensive shapes.\n\nAt 18. Spain may have found their best player since Xavi.`,
    category: 'analysis',
    tags: JSON.stringify(['World Cup 2026', 'Spain', 'Yamal', 'Analysis', 'Tactics']),
    image_url: img('1551958219-acbc45e32bdf'),
    image_alt: 'Lamine Yamal World Cup 2026 masterclass',
    is_breaking: false,
    views: 198000,
    read_time: 8,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    slug: 'messi-farewell-world-cup',
    title: "The Last Dance: Is This Really Messi's Final World Cup Miracle?",
    excerpt: "Argentina's talisman continues to defy logic, age, and expectation. Six assists in five games — at 38 years old.",
    content: `There is a moment in every sporting legend's career when sentiment turns into something more complicated: the tension between wanting them to go on forever and knowing they shouldn't have to. With Lionel Messi at World Cup 2026, we are living that tension in real time.\n\nAt 38, Messi doesn't press, doesn't track back, and doesn't need to. He plays where he has always played — in the spaces between lines — but those spaces are now chosen with even more precision, because he has less energy to spend reaching them.\n\nWhat he still has is everything that cannot be taught. The vision. The weight of pass. The ability to still a press with a single touch. The free-kick that curls past walls as if they aren't there.\n\nSix assists in five games. At 38. In the heat of a North American summer. Against some of the best-organised defences in the world.\n\nWhen Argentina's campaign ends — in the quarter-final or, perhaps, much later — there will be tears. But they won't be tears of sadness. They'll be the tears of people who watched something they know they will never see again, and who feel lucky to have been watching.`,
    category: 'analysis',
    tags: JSON.stringify(['World Cup 2026', 'Argentina', 'Messi', 'Analysis']),
    image_url: img('1574629810360-7efbbe195018'),
    image_alt: 'Messi final World Cup 2026',
    is_breaking: false,
    views: 421000,
    read_time: 7,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 150),
  },
  {
    slug: 'haaland-golden-boot-race',
    title: 'Haaland at 8: The Golden Boot Race Is Already Over',
    excerpt: 'With eight goals in five games, Erling Haaland has turned the Golden Boot into a one-horse race.',
    content: `The Golden Boot at World Cup 2026 was supposed to be a five-way race between Mbappé, Haaland, Yamal, Kane, and Vinícius. It is now a one-horse race, and the horse's name is Erling Haaland.\n\nEight goals in five games. A hat-trick against Brazil in the Round of 16 that included a 95th-minute winner. A brace against South Korea in the group stage. A header against Saudi Arabia that traveled at 94 km/h.\n\nHaaland's relationship with the goal is unlike anything in the modern game. He doesn't think about scoring — he exists in a state of pure goalscoring instinct. When the ball is in the box, he is already in the right place. Always.\n\nFor Norway, a nation that has never won a major international trophy and has never before reached the World Cup quarter-finals, Haaland is not just their best player. He is their entire tournament.`,
    category: 'analysis',
    tags: JSON.stringify(['World Cup 2026', 'Norway', 'Haaland', 'Golden Boot']),
    image_url: img('1531415074968-036ba1b575da'),
    image_alt: 'Haaland Golden Boot race World Cup 2026',
    is_breaking: false,
    views: 567000,
    read_time: 5,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 200),
  },
  {
    slug: 'transfer-window-post-wc',
    title: 'Summer 2026 Transfer Window: Which Stars Will Move After the World Cup?',
    excerpt: "The tournament has created new value and new buyers. Wirtz to Real Madrid, Osimhen to Liverpool, Yamal's new deal — the summer is already moving.",
    content: `Every World Cup reshapes the transfer market. A player who was worth €60m in March is worth €120m in July. Clubs who were happy with their squads are suddenly desperate. The summer of 2026 is shaping up to be one of the most expensive in history.\n\nFlorian Wirtz (Germany, Bayern Munich) is the most coveted player not already at a Champions League-winning club. Real Madrid have been tracking him all season and a fee in the region of €150m is being discussed.\n\nVictor Osimhen's Nigeria exit in the group stage has not dimmed his market value. Liverpool, who missed out on him last summer, are back with a revised offer. A fee of €90m is expected.\n\nYamal's Barcelona contract situation is the most watched negotiation in world football. Barça want to tie him down to 2031 with a release clause of €1bn. Yamal's camp are in no rush.\n\nThese are the movements to watch as the tournament enters its final stages.`,
    category: 'transfer',
    tags: JSON.stringify(['Transfers', 'Summer 2026', 'World Cup 2026', 'Wirtz', 'Osimhen', 'Yamal']),
    image_url: img('1551958219-acbc45e32bdf'),
    image_alt: 'Transfer window summer 2026',
    is_breaking: false,
    views: 155000,
    read_time: 7,
    published_at: new Date(Date.now() - 1000 * 60 * 500),
  },
  {
    slug: 'spain-possession-stats',
    title: 'Spain by the Numbers: The Most Dominant Team at World Cup 2026',
    excerpt: '64% average possession. 14 goals. 3 conceded. Tiki-taka reimagined — Spain under De la Fuente is a masterclass.',
    content: `Spain have been the most complete team at World Cup 2026. The numbers tell one story; watching them tells another. Together, they make a compelling case for a team on the verge of something historic.\n\n64.3% — Spain's average possession across five games. No other team is above 58%.\n\n14 — Goals scored. Only Norway (also 14) match them, and Norway needed a 95th-minute winner against Brazil to get there.\n\n3 — Goals conceded. All came in the group stage after Spain had already qualified.\n\n401 — Passes per game by Kevin De Bruyne? No — that's Pedri's number for Spain's midfield general.\n\nWhat De la Fuente has built is a system that doesn't just keep the ball — it suffocates opponents with it. By the time other teams get possession, they're so tired from chasing that Spain simply press them back into mistakes.\n\nIf this is tiki-taka reimagined, it's tiki-taka with teeth.`,
    category: 'analysis',
    tags: JSON.stringify(['World Cup 2026', 'Spain', 'Stats', 'Analysis', 'Tactics']),
    image_url: img('1574629810360-7efbbe195018'),
    image_alt: 'Spain World Cup 2026 statistics',
    is_breaking: false,
    views: 88000,
    read_time: 4,
    league: 'World Cup 2026',
    published_at: new Date(Date.now() - 1000 * 60 * 900),
  },
  {
    slug: '48-team-format-verdict',
    title: '48 Teams: Was the Expanded Format a Success? The Verdict After 5 Weeks',
    excerpt: 'More upsets. More nations. More stories. The 48-team World Cup delivered drama at every stage.',
    content: `When FIFA announced the expansion to 48 teams, the purists howled. More teams meant more mismatches, more dead rubbers, more dilution of the sport's greatest event. Five weeks into World Cup 2026, the verdict is in — and the purists were wrong.\n\nYes, there were mismatches in the group stage. Some of them were spectacular. Morocco 7-0 El Salvador was not a classic. But the ripple effects of 48 nations competing at a World Cup are being felt in places that have never before experienced this level of football visibility.\n\nFour African teams reached the Round of 32. Three Asian teams made it to the Round of 16 for the first time in history. Panama, making their second World Cup appearance, beat Italy 2-1 in what will be remembered as one of the great upsets.\n\nThe format works. Football is bigger for it.`,
    category: 'analysis',
    tags: JSON.stringify(['World Cup 2026', 'FIFA', '48-team format', 'Analysis']),
    image_url: img('1560272564-c83b66b1ad12'),
    image_alt: '48 team World Cup format 2026',
    is_breaking: false,
    views: 75000,
    read_time: 8,
    published_at: new Date(Date.now() - 1000 * 60 * 1000),
  },
];

// ── Transfers ─────────────────────────────────────────────────────────────────

const TRANSFERS = [
  { player_name: 'Florian Wirtz',    player_age: 23, position: 'Attacking Midfielder', nationality: 'Germany',   from_club: 'Bayer Leverkusen', to_club: 'Real Madrid',  fee: '€150M',  status: 'rumour',    source: 'Fabrizio Romano' },
  { player_name: 'Victor Osimhen',   player_age: 27, position: 'Striker',              nationality: 'Nigeria',   from_club: 'Galatasaray',      to_club: 'Liverpool',    fee: '€90M',   status: 'rumour',    source: 'The Athletic' },
  { player_name: 'Rúben Neves',      player_age: 27, position: 'Central Midfielder',   nationality: 'Portugal',  from_club: 'Al-Hilal',         to_club: 'Barcelona',    fee: '€45M',   status: 'confirmed', source: 'Fabrizio Romano' },
  { player_name: 'Evan Ferguson',    player_age: 21, position: 'Striker',              nationality: 'Ireland',   from_club: 'Brighton',         to_club: 'Arsenal',      fee: '€70M',   status: 'rumour',    source: 'Sky Sports' },
  { player_name: 'Gavi',            player_age: 22, position: 'Central Midfielder',   nationality: 'Spain',     from_club: 'Barcelona',        to_club: 'Barcelona',    fee: 'Contract Extension', status: 'confirmed', source: 'Barcelona FC' },
  { player_name: 'Randal Kolo Muani', player_age: 25, position: 'Striker',            nationality: 'France',   from_club: 'Juventus',         to_club: 'PSG',          fee: '€70M',   status: 'rumour',    source: 'L\'Equipe' },
  { player_name: 'Jonathan Tah',    player_age: 28, position: 'Centre-Back',          nationality: 'Germany',   from_club: 'Bayer Leverkusen', to_club: 'Bayern Munich', fee: 'Free',  status: 'completed', source: 'Fabrizio Romano' },
  { player_name: 'Marcus Rashford', player_age: 28, position: 'Forward',              nationality: 'England',   from_club: 'Man United',       to_club: 'Aston Villa',  fee: '€40M',   status: 'rumour',    source: 'The Guardian' },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seedArticles() {
  let inserted = 0;
  let skipped = 0;
  for (const a of ARTICLES) {
    try {
      await q(
        `INSERT INTO articles
           (slug, title, excerpt, content, category, tags, image_url, image_alt,
            author, read_time, views, is_breaking, published, published_at, league)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         ON CONFLICT (slug) DO NOTHING`,
        [
          a.slug, a.title, a.excerpt, a.content, a.category, a.tags,
          a.image_url, a.image_alt, 'GoalRush AI', a.read_time, a.views,
          a.is_breaking, true, a.published_at, a.league || null,
        ],
      );
      inserted++;
    } catch (e) {
      console.error(`  ✗ ${a.slug}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`✅ Articles: ${inserted} inserted, ${skipped} skipped`);
}

async function seedTransfers() {
  let inserted = 0;
  for (const t of TRANSFERS) {
    try {
      await q(
        `INSERT INTO transfers (player_name, player_age, position, nationality, from_club, to_club, fee, status, source)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [t.player_name, t.player_age, t.position, t.nationality, t.from_club, t.to_club, t.fee, t.status, t.source],
      );
      inserted++;
    } catch (e) {
      console.error(`  ✗ ${t.player_name}: ${e.message}`);
    }
  }
  console.log(`✅ Transfers: ${inserted} inserted`);
}

async function main() {
  console.log('🌱 Starting seed...');
  try {
    await createTables();
    await seedArticles();
    await seedTransfers();
    console.log('🎉 Seed complete!');
  } catch (e) {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
