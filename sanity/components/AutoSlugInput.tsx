import {useEffect, useMemo} from 'react';
import {Card, Stack, Text} from '@sanity/ui';
import {
  set,
  type SlugInputProps,
  useClient,
  useDocumentId,
  useFormValue
} from 'sanity';

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

const DEFAULT_API_VERSION = '2024-01-01';

export function AutoSlugInput(props: SlugInputProps) {
  const {value, onChange} = props;
  const client = useClient({apiVersion: DEFAULT_API_VERSION});
  const documentId = useDocumentId();
  const documentType = useFormValue(['_type']) as string | undefined;
  const title = useFormValue(['title']) as string | undefined;

  const currentSlug = value?.current ?? '';
  const baseId = useMemo(() => {
    if (!documentId) return undefined;
    return documentId.replace(/^drafts\./, '');
  }, [documentId]);

  useEffect(() => {
    const shouldGenerate = Boolean(title && !currentSlug && documentType && baseId);
    if (!shouldGenerate) return;

    let cancelled = false;

    const generate = async () => {
      const base = slugify(title || '');
      if (!base) return;

      let candidate = base;
      let suffix = 1;

      const isUnique = async (slugCandidate: string) => {
        if (!documentType || !baseId) return true;
        const params = {
          type: documentType,
          slug: slugCandidate,
          draftId: `drafts.${baseId}`,
          publishedId: baseId
        };
        const query = `!defined(*[_type == $type && slug.current == $slug && !(_id in [$draftId, $publishedId])][0]._id)`;
        try {
          return await client.fetch<boolean>(query, params);
        } catch (err) {
          console.error('Failed to verify slug uniqueness', err);
          return false;
        }
      };

      let unique = await isUnique(candidate);
      while (!cancelled && !unique && suffix < 100) {
        candidate = `${base}-${suffix}`;
        unique = await isUnique(candidate);
        suffix += 1;
      }

      if (!cancelled && unique) {
        onChange(set({current: candidate}));
      }
    };

    generate();

    return () => {
      cancelled = true;
    };
  }, [title, currentSlug, documentType, baseId, client, onChange]);

  return (
    <Card padding={3} radius={2} shadow={0} tone="transparent">
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Slug
        </Text>
        <Text size={1} muted={!currentSlug}>
          {currentSlug ? currentSlug : 'Wird automatisch generiert, sobald ein Titel vorhanden ist.'}
        </Text>
      </Stack>
    </Card>
  );
}
