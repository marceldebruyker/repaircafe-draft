import { defineType, defineField } from 'sanity';

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
        list: [
          { title: 'Reparatur', value: 'repair' },
          { title: 'Workshops', value: 'workshop' },
          { title: 'Community', value: 'community' }
        ]
      },
      validation: (rule) => rule.required()
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
      media: 'image'
    }
  }
});
