import {useEffect, useMemo} from 'react';
import {Card, Stack, Text} from '@sanity/ui';
import {set, type SlugInputProps, useClient, useFormValue} from 'sanity';

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

const buildSlugBase = (title?: string, date?: string, startTime?: string) => {
  if (!title) return '';
  const normalizedDate = date?.split('T')[0];
  const normalizedTime = startTime?.replace(':', '-');
  return slugify([title, normalizedDate, normalizedTime].filter(Boolean).join(' '));
};

const DEFAULT_API_VERSION = '2024-01-01';

export function AutoSlugInput(props: SlugInputProps) {
  const {value, onChange, documentId, schemaType} = props;
  const client = useClient({apiVersion: DEFAULT_API_VERSION});
  const title = useFormValue(['title']) as string | undefined;
  const date = useFormValue(['date']) as string | undefined;
  const startTime = useFormValue(['startTime']) as string | undefined;

  const currentSlug = value?.current ?? '';
  const baseId = useMemo(() => {
    if (!documentId) return undefined;
    return documentId.replace(/^drafts\./, '');
  }, [documentId]);
  const targetDocumentType =
    (schemaType?.options as {documentType?: string} | undefined)?.documentType ?? 'event';

  const base = buildSlugBase(title, date, startTime);
  const baseFromTitleOnly = title ? slugify(title) : '';

  useEffect(() => {
    const shouldGenerate = Boolean(base && (!currentSlug || currentSlug === baseFromTitleOnly));
    if (!shouldGenerate) return;

    let cancelled = false;

    const generate = async () => {
      let candidate = base;
      let suffix = 1;

      const isUnique = async (slugCandidate: string) => {
        if (!baseId) return true;
        const params = {
          type: targetDocumentType,
          slug: slugCandidate,
          draftId: `drafts.${baseId}`,
          publishedId: baseId
        };
        const query = `!defined(*[_type == $type && slug.current == $slug && !(_id in [$draftId, $publishedId])][0]._id)`;
        try {
          return await client.fetch<boolean>(query, params);
        } catch (err) {
          console.error('Failed to verify slug uniqueness', err);
          return true;
        }
      };

      let unique = await isUnique(candidate);
      while (!cancelled && !unique && suffix < 100) {
        candidate = `${base}-${suffix}`;
        unique = await isUnique(candidate);
        suffix += 1;
      }

      if (!cancelled && unique) {
        onChange(
          set({
            _type: 'slug',
            current: candidate
          }),
        );
      }
    };

    generate();

    return () => {
      cancelled = true;
    };
  }, [base, baseFromTitleOnly, currentSlug, targetDocumentType, baseId, client, onChange]);

  return (
    <Card padding={3} radius={2} shadow={0} tone="transparent">
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Slug
        </Text>
        <Text size={1} muted={!currentSlug}>
          {currentSlug
            ? currentSlug
            : 'Wird automatisch generiert, sobald ein Titel vorhanden ist (Datum/Beginn verfeinern ihn).'}
        </Text>
      </Stack>
    </Card>
  );
}
