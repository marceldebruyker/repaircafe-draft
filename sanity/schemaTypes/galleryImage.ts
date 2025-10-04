import { defineType, defineField } from 'sanity';

const galleryCategoryOptions = [
  { title: 'Elektronik & Haushalt', value: 'elektronik-haushalt' },
  { title: 'Lampen & Licht', value: 'lampen-licht' },
  { title: 'IT & Medien', value: 'it-medien' },
  { title: 'Fahrrad', value: 'fahrrad' },
  { title: 'Textil & Nähen', value: 'textil-naehen' },
  { title: 'Möbel & Holz', value: 'moebel-holz' },
  { title: 'Spielzeug & Sonstiges', value: 'spielzeug-sonstiges' },
  { title: 'Kaffee & Community', value: 'kaffee-community' },
  { title: 'Standort & Umgebung', value: 'location' },
  // Legacy Kategorien bleiben verfügbar, bis alle Einträge migriert wurden
  { title: 'Reparatur (alt)', value: 'repair' },
  { title: 'Workshops (alt)', value: 'workshop' },
  { title: 'Community (alt)', value: 'community' }
];

const categoryLabelMap = galleryCategoryOptions.reduce<Record<string, string>>((acc, option) => {
  acc[option.value] = option.title;
  return acc;
}, {});

export default defineType({
  name: 'galleryImage',
  title: 'Impression',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'alt',
      title: 'Alt-Text',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: galleryCategoryOptions,
        layout: 'radio'
      },
      description: 'Haupt-Kategorie für Filter & Darstellung (Pflichtfeld).',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'categories',
      title: 'Weitere Kategorien (optional)',
      type: 'array',
      of: [
        defineField({
          name: 'categoryItem',
          type: 'string',
          options: {
            list: galleryCategoryOptions,
            layout: 'tags'
          }
        })
      ],
      options: {
        layout: 'tags'
      },
      description: 'Nutze diese Tags für zusätzliche Zuordnungen (z. B. Standort & Umgebung).'
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Breit', value: 'wide' },
          { title: 'Hoch', value: 'tall' }
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 2
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      categories: 'categories',
      media: 'image'
    },
    prepare(selection) {
      const { title, subtitle, categories, media } = selection;
      const categoryList = Array.isArray(categories) && categories.length
        ? categories
        : subtitle
          ? [subtitle]
          : [];

      const readableSubtitle = categoryList
        .map((value) => categoryLabelMap[value] ?? value)
        .join(', ');

      return {
        title,
        subtitle: readableSubtitle || undefined,
        media
      };
    }
  }
});
