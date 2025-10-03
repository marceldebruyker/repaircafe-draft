import groq from 'groq';

export const eventsQuery = groq`
  *[_type == "event" && defined(date)] | order(date asc) {
    _id,
    title,
    date,
    startTime,
    endTime,
    location,
    streetAddress,
    postalCode,
    city,
    "slug": slug.current
  }
`;

export const upcomingEventsQuery = groq`
  *[_type == "event" && defined(date) && dateTime(date) >= dateTime(now())] | order(date asc) {
    _id,
    title,
    date,
    startTime,
    endTime,
    location,
    streetAddress,
    postalCode,
    city,
    "slug": slug.current
  }
`;

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    publishedAt,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    "bodyPlain": pt::text(body)
  }
`;

export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc, _createdAt asc) {
    _id,
    title,
    description,
    category,
    layout,
    order,
    "image": image.asset->url,
    alt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    publishedAt,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    "bodyPlain": pt::text(body),
    body[] {
      ...,
      _type == 'image' => {
        ...,
        "url": asset->url,
        "alt": coalesce(alt, asset->altText)
      }
    }
  }
`;

export const heroGalleryQuery = groq`
  *[_type == "heroGallery"] {
    slides[] {
      "image": image.asset->url,
      alt
    }
  }
`;

export const teamVoicesQuery = groq`
  *[_type == "teamVoice"] | order(order asc, _createdAt asc) {
    _id,
    name,
    badge,
    role,
    quote,
    description,
    order,
    "portrait": portrait.asset->url,
    portraitAlt
  }
`;
