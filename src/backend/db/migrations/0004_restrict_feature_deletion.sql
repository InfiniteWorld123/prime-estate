ALTER TABLE property_features
DROP CONSTRAINT property_features_feature_id_fkey;

ALTER TABLE property_features
ADD CONSTRAINT property_features_feature_id_fkey
FOREIGN KEY (feature_id)
REFERENCES features (id)
ON DELETE RESTRICT;
