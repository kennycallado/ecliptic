DEFINE TABLE OVERWRITE post TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD OVERWRITE author ON post TYPE option<record<user>>
  DEFAULT $auth
  VALUE $before OR $value OR $auth
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE description ON post TYPE option<string>
  DEFAULT ''
  ASSERT string::len($value) INSIDE 0..=100;
DEFINE FIELD OVERWRITE content ON post TYPE option<array<string>>
  DEFAULT ['']
  ASSERT array::map($value, |$inner: string| string::len($inner) < 10000)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE created ON post TYPE option<datetime>
  VALUE $before OR time::now()
  ASSERT $input = NONE
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE draft ON post TYPE option<bool>
  DEFAULT true
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE hero ON post TYPE option<string>
  DEFAULT 'https://picsum.photos/960/540?t=' + rand::string(5)
  ASSERT string::is::url($value)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE likes ON post
  VALUE <future> { RETURN (SELECT count() FROM ONLY id<-likes GROUP BY count LIMIT 1).count; }
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE publish ON post TYPE option<datetime>
  DEFAULT time::ceil(time::now(), 1d)
  VALUE time::ceil($value, 1d)
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE slug ON post TYPE option<string>
  VALUE string::slug(string::slice(title, 0, 20))
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE title ON post TYPE string
  ASSERT string::len($value) INSIDE 5..=100
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE updated ON post TYPE option<datetime>
  VALUE time::now()
  ASSERT $input = NONE
  PERMISSIONS FULL;
DEFINE FIELD OVERWRITE visits ON post
  VALUE <future> { RETURN (SELECT count() FROM ONLY id<-visits GROUP BY count LIMIT 1).count; }
  PERMISSIONS FULL;

DEFINE INDEX OVERWRITE slug_index ON post FIELDS slug UNIQUE;
