-- Productos del catálogo. Categorías y acabados viven en src/data/catalog.js;
-- aquí se guardan sólo sus ids.
CREATE TABLE IF NOT EXISTS products (
  id            text PRIMARY KEY,               -- slug: /producto/:id
  name          text NOT NULL,
  cat           text NOT NULL,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'publish')),
  featured      boolean NOT NULL DEFAULT false,
  sku           text UNIQUE,
  price         numeric(12, 2),
  sale_price    numeric(12, 2),
  manage_stock  boolean NOT NULL DEFAULT false,
  stock         integer,
  desc_es       text NOT NULL DEFAULT '',
  desc_en       text NOT NULL DEFAULT '',
  frames        text[] NOT NULL DEFAULT '{}',   -- vacío = todos
  uphs          text[] NOT NULL DEFAULT '{}',   -- vacío = todas
  imgs          text[] NOT NULL DEFAULT '{}',
  sort          integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_status_idx ON products (status, sort);
