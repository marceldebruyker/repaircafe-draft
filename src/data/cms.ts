import { sanityClient, isSanityConfigured } from '../lib/sanityClient';
import {
  eventsQuery,
  upcomingEventsQuery,
  postsQuery,
  galleryQuery,
  postBySlugQuery,
  heroGalleryQuery,
  teamVoicesQuery
} from '../lib/queries';

export interface EventItem {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  slug?: string;
}

export interface PostItem {
  _id: string;
  title: string;
  publishedAt: string;
  slug?: string;
  coverImage?: string;
  body?: any[];
  bodyPlain?: string;
}

export interface TeamVoice {
  _id: string;
  name: string;
  badge?: string;
  role?: string;
  quote?: string;
  description?: string;
  order?: number;
  portrait?: string;
  portraitAlt?: string;
}

const parseDateValue = (value?: string) => {
  if (!value) return 0;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return 0;
  return time;
};

const sortPostsByPublished = (items: PostItem[]): PostItem[] =>
  [...items].sort((a, b) => parseDateValue(b.publishedAt) - parseDateValue(a.publishedAt));

export interface GalleryItem {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  categories?: string[];
  layout?: 'standard' | 'wide' | 'tall';
  image?: string;
  alt?: string;
  order?: number;
}

const fallbackEvents: EventItem[] = [
  {
    _id: 'fallback-event-1',
    title: 'Tag der offenen Tür',
    date: '2025-09-27',
    startTime: '10:00',
    endTime: '14:00',
    location: 'VHS-Gebäude Leonberg',
    streetAddress: 'Wilhelmstraße 32',
    postalCode: '71229',
    city: 'Leonberg'
  },
  {
    _id: 'fallback-event-2',
    title: 'Repair Café & Näh-Workshop',
    date: '2025-11-08',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Bürgerzentrum Stadtmitte',
    streetAddress: 'Neuköllner Straße 5',
    postalCode: '71229',
    city: 'Leonberg'
  },
  {
    _id: 'fallback-event-3',
    title: 'Vorweihnachtliches Repair Café',
    date: '2025-12-13',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Gemeindehaus Eltingen',
    streetAddress: 'Kirchplatz 3',
    postalCode: '71229',
    city: 'Leonberg'
  }
];

const fallbackPosts: PostItem[] = [
  {
    _id: 'fallback-post-1',
    title: 'Rückblick: Repair Café Auftakt 2025',
    publishedAt: '2025-03-18',
    coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be8902?auto=format&fit=crop&w=900&q=80',
    slug: 'rueckblick-repair-cafe-auftakt-2025',
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: 'Unser Auftakt 2025 war ein voller Erfolg. Von Lötstation bis Nähwerkstatt – hier teilen wir die Highlights.' }
        ]
      }
    ],
    bodyPlain: 'Unser Auftakt 2025 war ein voller Erfolg. Von Lötstation bis Nähwerkstatt – hier teilen wir die Highlights.'
  },
  {
    _id: 'fallback-post-2',
    title: 'Neuer Schwerpunkt: Textil-Reparaturen im Fokus',
    publishedAt: '2025-04-22',
    coverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    slug: 'textil-reparaturen-im-fokus',
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: 'Unser Textil-Team hat neue Nähmaschinen, Stoffe und Know-how. Erfahren Sie, was Sie zum nächsten Repair Café mitbringen können.' }
        ]
      }
    ],
    bodyPlain: 'Unser Textil-Team hat neue Nähmaschinen, Stoffe und Know-how. Erfahren Sie, was Sie zum nächsten Repair Café mitbringen können.'
  },
  {
    _id: 'fallback-post-3',
    title: 'Workshop: Reparieren lernen in fünf Schritten',
    publishedAt: '2025-05-30',
    coverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    slug: 'workshop-reparieren-lernen',
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: 'In fünf Schritten durchs Reparieren: In unserem Workshop zeigen wir, wie Sie Fehler finden, Ersatzteile auswählen und sicher reparieren.' }
        ]
      }
    ],
    bodyPlain: 'In fünf Schritten durchs Reparieren: In unserem Workshop zeigen wir, wie Sie Fehler finden, Ersatzteile auswählen und sicher reparieren.'
  }
];

const fallbackGallery: GalleryItem[] = [
  {
    _id: 'fallback-gallery-1',
    title: 'Fehlerdiagnose',
    description: 'Feine Lötarbeiten und Multimeter-Messungen an Kleingeräten.',
    categories: ['elektronik-haushalt', 'lampen-licht'],
    layout: 'wide',
    order: 1,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Elektronik wird auf einer Werkbank geöffnet und vermessen'
  },
  {
    _id: 'fallback-gallery-2',
    title: 'Textil-Station',
    description: 'Reißverschlüsse wechseln und Lieblingsstücke retten.',
    categories: ['textil-naehen'],
    layout: 'standard',
    order: 2,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    alt: 'Nähmaschine bei einer Textilreparatur'
  },
  {
    _id: 'fallback-gallery-3',
    title: 'Bike-Werkstatt',
    description: 'Bremsen nachstellen und Schaltungen justieren.',
    categories: ['fahrrad'],
    layout: 'tall',
    order: 3,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    alt: 'Freiwillige reparieren ein Fahrrad'
  },
  {
    _id: 'fallback-gallery-4',
    title: 'Pause & Austausch',
    description: 'Neue Kontakte knüpfen bei Kaffee und Kuchen.',
    categories: ['kaffee-community'],
    layout: 'tall',
    order: 4,
    image: 'https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=900&q=80',
    alt: 'Besucher:innen trinken Kaffee bei einem Event'
  },
  {
    _id: 'fallback-gallery-5',
    title: 'Bürgerzentrum Stadtmitte',
    description: 'Eingang zum Veranstaltungsort des Repair Cafés.',
    categories: ['location'],
    layout: 'standard',
    order: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=1200&q=80',
    alt: 'Außenansicht eines modernen Bürgerzentrums'
  },
  {
    _id: 'fallback-gallery-6',
    title: 'Weg zwischen Leo-Center und Stadthalle',
    description: 'Beschilderung, die zum Repair Café führt.',
    categories: ['location'],
    layout: 'standard',
    order: 6,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Wegweiser im Stadtzentrum von Leonberg'
  }
];

const fallbackTeamVoices: TeamVoice[] = [
  {
    _id: 'fallback-voice-1',
    name: 'Alexander',
    badge: 'Elektrotechnik',
    role: 'Elektrotechniker & Ehrenamtlicher',
    quote:
      'Ich liebe es, wenn ein scheinbar verlorenes Gerät plötzlich wieder läuft. Im Repair Café kann ich mein Wissen teilen und gleichzeitig neue Tricks lernen – das motiviert mich jedes Mal aufs Neue.',
    description: 'Alexander engagiert sich seit 2023 im Elektronik-Team und unterstützt besonders bei kniffligen Fehlersuchen.'
  },
  {
    _id: 'fallback-voice-2',
    name: 'Sabine',
    badge: 'Textil & Nähen',
    role: 'Textilcoach & Gastgeberin',
    quote:
      'Für mich ist das Repair Café ein Ort, an dem aus Stoffresten neue Lieblingsstücke werden. Wir zeigen, dass Reparieren kreativ und unkompliziert sein kann.',
    description: 'Sabine betreut die Nähstation und kümmert sich um die herzliche Begrüßung der Gäste.'
  },
  {
    _id: 'fallback-voice-3',
    name: 'Jens',
    badge: 'Fahrrad-Werkstatt',
    role: 'Fahrradschrauber & Tüftler',
    quote:
      'Jedes reparierte Rad bedeutet mehr Mobilität im Alltag. Gemeinsam zu schrauben macht Spaß und schafft Bewusstsein für nachhaltige Fortbewegung.',
    description: 'Jens sorgt dafür, dass Bremsen greifen, Schaltungen schalten und Tipps zum Selbermachen mitgegeben werden.'
  }
];

export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  if (!isSanityConfigured || !sanityClient) {
    return typeof limit === 'number' ? fallbackEvents.slice(0, limit) : fallbackEvents;
  }
  const data = await sanityClient.fetch<EventItem[]>(upcomingEventsQuery);
  return typeof limit === 'number' ? data.slice(0, limit) : data;
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackEvents;
  return sanityClient.fetch<EventItem[]>(eventsQuery);
}

export async function getPosts(limit?: number): Promise<PostItem[]> {
  if (!isSanityConfigured || !sanityClient) {
    const sortedFallback = sortPostsByPublished(fallbackPosts);
    return typeof limit === 'number' ? sortedFallback.slice(0, limit) : sortedFallback;
  }
  const data = await sanityClient.fetch<PostItem[]>(postsQuery);
  const sortedData = sortPostsByPublished(data ?? []);
  return typeof limit === 'number' ? sortedData.slice(0, limit) : sortedData;
}

export async function getGalleryImages(): Promise<GalleryItem[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackGallery;
  return sanityClient.fetch<GalleryItem[]>(galleryQuery);
}

export async function getPostBySlug(slug: string): Promise<PostItem | null> {
  if (!slug) return null;
  if (!isSanityConfigured || !sanityClient) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
  const post = await sanityClient.fetch<PostItem>(postBySlugQuery, { slug });
  return post ?? null;
}

export async function getTeamVoices(): Promise<TeamVoice[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackTeamVoices;
  const data = await sanityClient.fetch<TeamVoice[] | null>(teamVoicesQuery);
  if (!data || data.length === 0) return fallbackTeamVoices;
  return data;
}

export interface HeroSlide {
  image?: string;
  alt?: string;
}

const fallbackHeroSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=960&q=80',
    alt: 'Freiwillige reparieren gemeinsam Geräte im Repair Café'
  },
  {
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=960&q=80',
    alt: 'Werkzeuge liegen bereit für Reparaturen'
  }
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackHeroSlides;
  const data = await sanityClient.fetch<Array<{ slides?: HeroSlide[] }> | null>(heroGalleryQuery);
  const slides = data
    ?.flatMap((doc) => doc.slides ?? [])
    .filter((slide) => slide?.image);
  return slides && slides.length ? slides : fallbackHeroSlides;
}
