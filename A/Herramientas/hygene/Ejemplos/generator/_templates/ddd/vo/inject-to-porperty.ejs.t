---
inject: true
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>Entity.ts
after: "export interface <%= h.changeCase.pascal(name) %>Props {"
skip_if: "<%= h.changeCase.camel(voName) %>:"
---
  <%= h.changeCase.camel(voName) %>: <%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>;