---
name: Founder-Bestand NEXUS
description: Echter Countdown-Bestand für NEXUS Drop 01 — DB-Tabelle founder_stock, zählt bei bestätigtem Kauf runter
type: feature
---
NEXUS zeigt „Noch X verfügbar" aus der Tabelle `public.founder_stock` (id 1, Start 6). Bei bestätigtem NEXUS-Kauf (usePendingCheckout erkennt verschwundenen Shopify-Cart) wird `decrement_founder_stock(1)` per RPC aufgerufen — nie unter 0. Shopify `quantityAvailable` ist öffentlich NICHT verfügbar (Token-Scope fehlt) — darum dieser eigene Zähler. Bestand manuell in der Datenbank nachführen, wenn neue Ware kommt. Tabelle ist nicht in den generierten Supabase-Typen → Zugriff mit `as any`-Cast.
