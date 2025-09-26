import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'time',
      title: 'Uhrzeit',
      type: 'string'
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string'
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string'
    }),
    defineField({
      name: 'signupUrl',
      title: 'Anmelde-Link',
      type: 'url'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date'
    }
  }
});
