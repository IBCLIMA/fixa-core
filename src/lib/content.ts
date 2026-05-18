// @ts-nocheck - Velite generates .velite at build time
import { posts, features, cities, comparisons } from "#site/content";

export { posts, features, cities, comparisons };

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getFeatureBySlug(slug: string) {
  return features.find((f) => f.slug === slug);
}

export function getCityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function getComparisonBySlug(slug: string) {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllPosts() {
  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllFeatures() {
  return features.sort((a, b) => a.order - b.order);
}

export function getAllCities() {
  return cities.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
}

export function getAllComparisons() {
  return comparisons;
}
