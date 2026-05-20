function extractIdFromSlug(slug) {
    const match = slug.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/i);
    return match ? match[1] : slug;
}

const testSlugs = [
    "pizza-hut-123e4567-e89b-12d3-a456-426614174000",
    "kfc-b60b73fa-85f2-4e36-b605-df857ed8e580",
    "b60b73fa-85f2-4e36-b605-df857ed8e580"
];

for (const slug of testSlugs) {
    console.log(`${slug} -> ${extractIdFromSlug(slug)}`);
}
