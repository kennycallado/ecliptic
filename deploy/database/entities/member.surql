DEFINE TABLE OVERWRITE member TYPE NORMAL SCHEMAFULL
  PERMISSIONS
    FOR select FULL,
    FOR create, update, delete WHERE $auth.role INSIDE ['admin', 'thera'];

DEFINE FIELD OVERWRITE group ON member TYPE option<int>
  DEFAULT 3
  ASSERT $value >= 1 AND $value <= 3
  PERMISSIONS FOR select FULL;
DEFINE FIELD OVERWRITE name ON member TYPE string
  ASSERT string::len($value) INSIDE 4..=10
  PERMISSIONS FOR select FULL;
DEFINE FIELD OVERWRITE position ON member TYPE string
  ASSERT string::len($value) INSIDE 4..=10
  PERMISSIONS FOR select FULL;
DEFINE FIELD OVERWRITE department ON member TYPE string
  ASSERT string::len($value) INSIDE 4..=50
  PERMISSIONS FOR select FULL;
DEFINE FIELD OVERWRITE photo ON member TYPE option<string>
  DEFAULT 'https://i0.wp.com/cdn.auth0.com/avatars/' + name.slice(0, 2).lowercase() + '.png?ssl=1'
  ASSERT string::is::url($value)
  PERMISSIONS FOR select FULL;
DEFINE FIELD OVERWRITE active ON member TYPE bool
  DEFAULT false
  PERMISSIONS FOR select FULL;

DEFINE INDEX OVERWRITE name_index ON member FIELDS name UNIQUE;
