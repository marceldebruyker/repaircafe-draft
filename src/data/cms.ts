import { sanityClient, isSanityConfigured } from '../lib/sanityClient';
import { eventsQuery, upcomingEventsQuery, postsQuery, galleryQuery, postBySlugQuery, heroGalleryQuery } from '../lib/queries';

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
  excerpt?: string;
  publishedAt: string;
  slug?: string;
  coverImage?: string;
  body?: any[];
}

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
    excerpt: 'Volle Werkbänke, gute Laune und viele gerettete Geräte – unser Saisonstart war ein voller Erfolg.',
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
    ]
  },
  {
    _id: 'fallback-post-2',
    title: 'Neuer Schwerpunkt: Textil-Reparaturen im Fokus',
    excerpt: 'Unser Näh-Team wächst und bietet jetzt spezielle Slots für Kleidung, Taschen und Zelte an.',
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
    ]
  },
  {
    _id: 'fallback-post-3',
    title: 'Workshop: Reparieren lernen in fünf Schritten',
    excerpt: 'Nachhaltig leben? Wir zeigen Ihnen, wie Sie Alltagsgeräte selbst reparieren können – mit Praxisübungen.',
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
    ]
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
    return typeof limit === 'number' ? fallbackPosts.slice(0, limit) : fallbackPosts;
  }
  const data = await sanityClient.fetch<PostItem[]>(postsQuery);
  return typeof limit === 'number' ? data.slice(0, limit) : data;
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
