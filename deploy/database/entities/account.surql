DEFINE TABLE OVERWRITE account TYPE NORMAL SCHEMALESS;

DEFINE FIELD OVERWRITE password ON account TYPE string
  ASSERT $value.contains('$argon2id$')
  PERMISSIONS NONE;

  -- VALUE {
  --   IF $before AND !$value.contains('$argon2id$') { RETURN crypto::argon2::generate($value); };
  --   RETURN $before OR crypto::argon2::generate($value);
  -- }
  -- PERMISSIONS
  --   FOR select NONE,
  --   FOR create, update WHERE $auth.role = 'admin';
