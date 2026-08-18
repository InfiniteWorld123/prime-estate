CREATE SEQUENCE property_reference_number_seq START
WITH
    1 INCREMENT BY 1;

CREATE TABLE contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    company_name text,
    email text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contacts_full_name_not_blank CHECK (btrim(full_name) <> ''),
    CONSTRAINT contacts_contact_method_check CHECK (
        NULLIF(btrim(email), '') IS NOT NULL
        OR NULLIF(btrim(phone), '') IS NOT NULL
    )
);

CREATE TABLE properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number text NOT NULL UNIQUE DEFAULT (
        'PE-' || lpad(
            nextval('property_reference_number_seq')::text,
            6,
            '0'
        )
    ),
    primary_contact_id uuid REFERENCES contacts (id) ON DELETE RESTRICT,
    property_type text NOT NULL,
    property_source text NOT NULL,
    street_name text NOT NULL,
    house_number text NOT NULL,
    unit_number text,
    postal_code text NOT NULL,
    city text NOT NULL,
    living_area_m2 numeric(10, 2) NOT NULL,
    plot_area_m2 numeric(10, 2),
    rooms numeric(3, 1) NOT NULL,
    bedrooms smallint,
    bathrooms smallint NOT NULL,
    year_built smallint,
    floor_number smallint,
    total_floors smallint,
    archived_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT properties_type_check CHECK (property_type IN ('APARTMENT', 'HOUSE')),
    CONSTRAINT properties_source_check CHECK (
        property_source IN ('AGENCY_OWNED', 'EXTERNAL_CLIENT')
    ),
    CONSTRAINT properties_source_contact_check CHECK (
        (
            property_source = 'AGENCY_OWNED'
            AND primary_contact_id IS NULL
        )
        OR (
            property_source = 'EXTERNAL_CLIENT'
            AND primary_contact_id IS NOT NULL
        )
    ),
    CONSTRAINT properties_postal_code_check CHECK (postal_code ~ '^[0-9]{5}$'),
    CONSTRAINT properties_living_area_check CHECK (living_area_m2 > 0),
    CONSTRAINT properties_plot_area_check CHECK (
        plot_area_m2 IS NULL
        OR plot_area_m2 > 0
    ),
    CONSTRAINT properties_rooms_check CHECK (rooms > 0),
    CONSTRAINT properties_bedrooms_check CHECK (
        bedrooms IS NULL
        OR bedrooms >= 0
    ),
    CONSTRAINT properties_bathrooms_check CHECK (bathrooms > 0),
    CONSTRAINT properties_year_built_check CHECK (
        year_built IS NULL
        OR year_built BETWEEN 1000 AND 9999
    ),
    CONSTRAINT properties_total_floors_check CHECK (
        total_floors IS NULL
        OR total_floors > 0
    ),
    CONSTRAINT properties_apartment_plot_area_check CHECK (
        property_type <> 'APARTMENT'
        OR plot_area_m2 IS NULL
    ),
    CONSTRAINT properties_house_floor_number_check CHECK (
        property_type <> 'HOUSE'
        OR floor_number IS NULL
    )
);

CREATE TABLE listings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL REFERENCES properties (id) ON DELETE RESTRICT,
    listing_type text NOT NULL,
    status text NOT NULL DEFAULT 'DRAFT',
    archive_outcome text,
    price_amount numeric(14, 2),
    currency_code text NOT NULL DEFAULT 'EUR',
    title text,
    description text,
    slug text UNIQUE,
    seo_title text,
    seo_description text,
    show_exact_address boolean NOT NULL DEFAULT FALSE,
    published_at timestamptz,
    archived_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT listings_type_check CHECK (listing_type IN ('SALE', 'RENT')),
    CONSTRAINT listings_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT listings_archive_outcome_check CHECK (
        archive_outcome IS NULL
        OR archive_outcome IN ('SOLD', 'RENTED', 'WITHDRAWN')
    ),
    CONSTRAINT listings_price_amount_check CHECK (
        price_amount IS NULL
        OR price_amount > 0
    ),
    CONSTRAINT listings_currency_code_check CHECK (currency_code = 'EUR'),
    CONSTRAINT listings_title_not_blank CHECK (
        title IS NULL
        OR btrim(title) <> ''
    ),
    CONSTRAINT listings_description_not_blank CHECK (
        description IS NULL
        OR btrim(description) <> ''
    ),
    CONSTRAINT listings_slug_not_blank CHECK (
        slug IS NULL
        OR btrim(slug) <> ''
    ),
    CONSTRAINT listings_seo_title_not_blank CHECK (
        seo_title IS NULL
        OR btrim(seo_title) <> ''
    ),
    CONSTRAINT listings_seo_description_not_blank CHECK (
        seo_description IS NULL
        OR btrim(seo_description) <> ''
    ),
    CONSTRAINT listings_outcome_matches_type_check CHECK (
        archive_outcome IS NULL
        OR (
            listing_type = 'SALE'
            AND archive_outcome IN ('SOLD', 'WITHDRAWN')
        )
        OR (
            listing_type = 'RENT'
            AND archive_outcome IN ('RENTED', 'WITHDRAWN')
        )
    ),
    CONSTRAINT listings_lifecycle_check CHECK (
        (
            status = 'DRAFT'
            AND published_at IS NULL
            AND archived_at IS NULL
            AND archive_outcome IS NULL
        )
        OR (
            status = 'PUBLISHED'
            AND published_at IS NOT NULL
            AND archived_at IS NULL
            AND archive_outcome IS NULL
        )
        OR (
            status = 'ARCHIVED'
            AND published_at IS NOT NULL
            AND archived_at IS NOT NULL
            AND archive_outcome IS NOT NULL
        )
    ),
    CONSTRAINT listings_published_content_check CHECK (
        status = 'DRAFT'
        OR (
            price_amount IS NOT NULL
            AND title IS NOT NULL
            AND btrim(title) <> ''
            AND description IS NOT NULL
            AND btrim(description) <> ''
            AND slug IS NOT NULL
            AND btrim(slug) <> ''
        )
    ),
    CONSTRAINT listings_timestamp_order_check CHECK (
        archived_at IS NULL
        OR published_at <= archived_at
    )
);

CREATE UNIQUE INDEX listings_one_open_type_per_property_idx ON listings (property_id, listing_type)
WHERE
    status IN ('DRAFT', 'PUBLISHED');

CREATE TABLE features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT features_code_not_blank CHECK (btrim(code) <> ''),
    CONSTRAINT features_code_format_check CHECK (code ~ '^[A-Z][A-Z0-9_]*$'),
    CONSTRAINT features_name_not_blank CHECK (btrim(name) <> '')
);

CREATE TABLE property_features (
    property_id uuid NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    feature_id uuid NOT NULL REFERENCES features (id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, feature_id)
);

CREATE TABLE property_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    storage_key text NOT NULL UNIQUE,
    alt_text text,
    sort_order integer NOT NULL DEFAULT 0,
    is_cover boolean NOT NULL DEFAULT FALSE,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT property_images_storage_key_not_blank CHECK (btrim(storage_key) <> ''),
    CONSTRAINT property_images_alt_text_not_blank CHECK (
        alt_text IS NULL
        OR btrim(alt_text) <> ''
    ),
    CONSTRAINT property_images_sort_order_check CHECK (sort_order >= 0)
);

CREATE INDEX properties_primary_contact_id_idx ON properties (primary_contact_id);

CREATE INDEX properties_type_idx ON properties (property_type);

CREATE INDEX properties_city_idx ON properties (city);

CREATE INDEX properties_postal_code_idx ON properties (postal_code);

CREATE INDEX listings_property_id_idx ON listings (property_id);

CREATE INDEX listings_public_newest_idx ON listings (published_at DESC)
WHERE
    status = 'PUBLISHED';

CREATE INDEX listings_public_type_price_idx ON listings (listing_type, price_amount)
WHERE
    status = 'PUBLISHED';

CREATE INDEX listings_admin_status_updated_idx ON listings (status, updated_at DESC);

CREATE INDEX property_features_feature_id_idx ON property_features (feature_id, property_id);

CREATE INDEX property_images_property_order_idx ON property_images (property_id, sort_order);

CREATE UNIQUE INDEX property_images_one_cover_per_property_idx ON property_images (property_id)
WHERE
    is_cover = TRUE;