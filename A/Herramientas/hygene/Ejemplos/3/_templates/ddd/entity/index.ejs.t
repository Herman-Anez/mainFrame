---
to: test-src/modules/<%= h.changeCase.param(name) %>/index.ts
---
export * from './domain/<%= h.changeCase.pascal(name) %>.entity';
export * from './application/<%= h.changeCase.pascal(name) %>.service';