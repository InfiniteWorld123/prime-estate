ALTER TABLE inquiries
ADD CONSTRAINT inquiries_full_name_length_check CHECK (
    char_length(full_name) <= 120
),
ADD CONSTRAINT inquiries_email_length_check CHECK (
    char_length(email) <= 254
),
ADD CONSTRAINT inquiries_phone_length_check CHECK (
    phone IS NULL
    OR char_length(phone) <= 40
),
ADD CONSTRAINT inquiries_message_length_check CHECK (
    char_length(message) <= 2000
);
