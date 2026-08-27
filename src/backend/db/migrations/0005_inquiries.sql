CREATE TABLE inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_type text NOT NULL,
    listing_id uuid REFERENCES listings (id) ON DELETE RESTRICT,
    interest text,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text NOT NULL,
    lead_status text NOT NULL DEFAULT 'NEW',
    read_at timestamptz,
    archived_at timestamptz,
    privacy_policy_version text NOT NULL,
    privacy_accepted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inquiries_type_check CHECK (
        inquiry_type IN ('GENERAL', 'LISTING')
    ),
    CONSTRAINT inquiries_interest_check CHECK (
        interest IS NULL
        OR interest IN ('BUYING', 'RENTING', 'GENERAL')
    ),
    CONSTRAINT inquiries_target_check CHECK (
        (
            inquiry_type = 'GENERAL'
            AND listing_id IS NULL
            AND interest IS NOT NULL
        )
        OR (
            inquiry_type = 'LISTING'
            AND listing_id IS NOT NULL
            AND interest IS NULL
        )
    ),
    CONSTRAINT inquiries_lead_status_check CHECK (
        lead_status IN ('NEW', 'CONTACTED', 'CLOSED')
    ),
    CONSTRAINT inquiries_full_name_not_blank CHECK (btrim(full_name) <> ''),
    CONSTRAINT inquiries_email_not_blank CHECK (btrim(email) <> ''),
    CONSTRAINT inquiries_email_normalized_check CHECK (
        email = lower(btrim(email))
    ),
    CONSTRAINT inquiries_phone_not_blank CHECK (
        phone IS NULL
        OR btrim(phone) <> ''
    ),
    CONSTRAINT inquiries_message_not_blank CHECK (btrim(message) <> ''),
    CONSTRAINT inquiries_privacy_version_not_blank CHECK (
        btrim(privacy_policy_version) <> ''
    ),
    CONSTRAINT inquiries_read_timestamp_check CHECK (
        read_at IS NULL
        OR read_at >= created_at
    ),
    CONSTRAINT inquiries_archive_timestamp_check CHECK (
        archived_at IS NULL
        OR archived_at >= created_at
    )
);

CREATE INDEX inquiries_admin_active_newest_idx
ON inquiries (created_at DESC, id DESC)
WHERE archived_at IS NULL;

CREATE INDEX inquiries_admin_archived_newest_idx
ON inquiries (created_at DESC, id DESC)
WHERE archived_at IS NOT NULL;

CREATE INDEX inquiries_listing_created_idx
ON inquiries (listing_id, created_at DESC)
WHERE listing_id IS NOT NULL;

CREATE INDEX inquiries_status_created_idx
ON inquiries (lead_status, created_at DESC);

CREATE INDEX inquiries_unread_newest_idx
ON inquiries (created_at DESC, id DESC)
WHERE read_at IS NULL AND archived_at IS NULL;

CREATE INDEX inquiries_email_created_idx
ON inquiries (email, created_at DESC);
