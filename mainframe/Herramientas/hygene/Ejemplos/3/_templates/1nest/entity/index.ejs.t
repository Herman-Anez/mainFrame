---
to: test-src/modules/<%= h.changeCase.param(name) %>/index.ts
---
export * from './domain/<%= h.changeCase.camel(name) %>.entity';
export * from './application/<%= h.changeCase.camel(name) %>.usecase-funnel';