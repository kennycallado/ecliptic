DEFINE TABLE likes TYPE RELATION IN user OUT post | module SCHEMAFULL
  PERMISSIONS FULL;
DEFINE FIELD created ON likes TYPE option<datetime>
  VALUE $before OR time::now()
  PERMISSIONS FULL;

DEFINE EVENT likes_created ON likes
  WHEN $event = 'CREATE' THEN {
    UPDATE id SET created = time::now();
  };

DEFINE INDEX unique_likes ON likes COLUMNS in, out UNIQUE;
