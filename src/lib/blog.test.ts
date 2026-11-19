import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts, getRelatedPosts } from "./blog.ts";
import { en } from "./i18n-en.ts";

test("every blog post has its text and valid related posts", () => {
  const slugs = new Set(blogPosts.map((p) => p.slug));
  assert.equal(slugs.size, blogPosts.length, "duplicate slug");
  for (const post of blogPosts) {
    for (const key of [post.titleKey, post.descKey, ...post.contentKeys]) {
      assert.ok(en[key], `${post.slug}: missing ${key}`);
    }
    for (const r of post.relatedSlugs) assert.ok(slugs.has(r), `${post.slug}: unknown related ${r}`);
    assert.equal(getRelatedPosts(post).length, post.relatedSlugs.length);
  }
});

test("new articles quote the site's current prices and longevity", () => {
  for (const id of ["embroidery", "microblading", "nano", "ombre"]) {
    const price = en[`svc.${id}.price`].match(/S\$\d+/)![0];
    assert.match(en["blog.19.p1"], new RegExp(price.replace("$", "\\$")), `${id} price`);
  }
  assert.match(en["blog.19.p3"], new RegExp(en["compare.longevity.nano"]));
  assert.match(en["blog.19.p3"], new RegExp(en["compare.longevity.ombre"]));
});
