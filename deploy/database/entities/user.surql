DEFINE TABLE OVERWRITE user TYPE NORMAL SCHEMAFULL
  PERMISSIONS
    FOR select, update WHERE id = $auth.id OR $auth.role INSIDE ['admin', 'thera'],
    FOR create, delete WHERE $auth.role = 'admin';

DEFINE FIELD OVERWRITE name ON user TYPE string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE role ON user TYPE string
  DEFAULT 'user'
  ASSERT $value INSIDE ['user', 'admin', 'thera']
  PERMISSIONS
    FOR update WHERE $auth.role = 'admin' AND $auth.id != id;
DEFINE FIELD OVERWRITE email ON user TYPE string
  ASSERT string::is::email($value)
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE image ON user TYPE option<string>
  ASSERT $value = NONE OR string::is::url($value)
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE createdAt ON user TYPE option<datetime>
  VALUE $before OR time::now()
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE updatedAt ON user TYPE option<datetime>
  VALUE time::now()
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE emailVerified ON user TYPE option<bool>
  DEFAULT false
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE notification ON user FLEXIBLE TYPE option<object>
  PERMISSIONS FOR update, create WHERE id = $auth.id; -- NOTE: will be at devices
DEFINE FIELD OVERWRITE banned ON user TYPE option<bool>
  DEFAULT false
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE banReason ON user TYPE option<string>
  PERMISSIONS NONE;
DEFINE FIELD OVERWRITE banExpires ON user TYPE option<datetime>
  PERMISSIONS NONE;


DEFINE INDEX OVERWRITE email_index ON user FIELDS email UNIQUE;
