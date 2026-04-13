---
inject: true
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>Entity.ts
before: "export interface <%= h.changeCase.pascal(name) %>Props"
skip_if: <%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>
---
import { <%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %> } from './value-objects/<%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>';
