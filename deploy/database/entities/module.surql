DEFINE TABLE OVERWRITE module TYPE NORMAL SCHEMAFULL
  PERMISSIONS
    FOR select WHERE $auth.role INSIDE ['admin', 'thera']
      OR id INSIDE (SELECT VALUE out FROM grants WHERE in = $auth.id),
    FOR create, update, delete WHERE $auth.role INSIDE ['admin', 'thera'];

DEFINE FIELD OVERWRITE author ON module TYPE option<record<user>>
  DEFAULT $auth
  VALUE $before OR $value OR $auth
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE description ON module TYPE option<string>
  DEFAULT ''
  ASSERT string::len($value) INSIDE 0..=100;
DEFINE FIELD OVERWRITE content ON module TYPE option<array<string>>
  DEFAULT ['']
  ASSERT array::map($value, |$inner: string| string::len($inner) < 10000)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE created ON module TYPE option<datetime>
  VALUE $before OR time::now()
  ASSERT $input = NONE
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE hero ON module TYPE option<string>
  DEFAULT 'https://picsum.photos/960/540?t=' + rand::string(5)
  ASSERT string::is::url($value)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE likes ON module
  VALUE <future> { RETURN (SELECT count() FROM ONLY id<-likes GROUP BY count LIMIT 1).count; }
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE publish ON module TYPE option<datetime>
  DEFAULT time::ceil(time::now(), 1d)
  VALUE time::ceil($value, 1d)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE slug ON module TYPE option<string>
  VALUE string::slug(string::slice(title, 0, 20))
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON module TYPE string
  ASSERT string::len($value) INSIDE 5..=100
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE updated ON module TYPE option<datetime>
  VALUE time::now()
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE visits ON module
  VALUE <future> { RETURN (SELECT count() FROM ONLY id<-visits GROUP BY count LIMIT 1).count; }
  PERMISSIONS FULL;


DEFINE INDEX OVERWRITE slug_index ON module FIELDS slug UNIQUE;
