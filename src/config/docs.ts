import { getDocsData, type DocCategory as DocCategoryType } from '../lib/docs-loader';

export type DocCategory = DocCategoryType;

export const DOCS_CONFIG: DocCategory[] = getDocsData();
