users
-----
 id | username |      email      | password |         created_at         |         updated_at         | is_deleted
----+----------+-----------------+----------+----------------------------+----------------------------+------------
  1 | user1    | test@gmail.com  | 12345    | 2020-09-17 18:10:32.668135 | 2020-09-17 18:10:32.668135 | f
  2 | user2    | test2@gmail.com | 12345    | 2020-09-18 10:00:36.614954 | 2020-09-18 10:00:36.614954 | f

itinerary
---------
    title       users_id    
 id |   title    | love| is_private|         created_at         |         updated_at         | is_deleted | users_id
----+------------+------+------------+----------------------------+----------------------------+------------
  2 | itineraryA |   15| t         | 2020-09-17 18:11:17.521291 | 2020-09-17 18:11:17.521291 | f          |    1
  3 | itineraryB |  117| t         | 2020-09-18 10:01:31.204113 | 2020-09-18 10:01:31.204113 | f          |    2
  4 | itineraryC |   99| t         | 2020-09-18 10:02:48.891073 | 2020-09-18 10:02:48.891073 | f          |    1

transport
---------
0 record

place
-----
 id | google_place_id     name           description       love

  1 | 123321  Universal Studios Japan      goodplace        12
  3 | 020301           東京晴空塔           bad place        77
  4 | 446601           DisneyLand          V bad place      2
  5 | 522222           富士山               normal place     37
  2 | 123456           Osaka Castle        It is a Japanese castle in chuo_ku, Osaka, Japan. The castle is one of Japan s most famous landmarks and it played a major role in the unification of Japan during the sixteenth century of the Azuchi-Momoyama period. |  992  

place_img
---------
 id |  img_path             created_at                place_id

  3 |img/usj.jpg           2020-09-18 23:50:59.830556    1
  1 |img/tyokoskytree.jpg  2020-09-18 23:47:28.540248    3
  4 |img/disneyland.jpg    2020-09-18 23:51:07.149771    4
  5 |img/fujimount.jpg     2020-09-18 23:51:15.020058    5
  6 |img/osakacastle.jpg   2020-09-18 23:51:21.537228    2

visit
-----

 id |  name  | latitude | longitude |      start_time       |       end_time        | is_deleted | itinerary_id |   >> |transport_id | place_id | memo_title | memo_content
----+--------+----------+-----------+-----------------------+-----------------------+------------+--------------|>>>>+-------------+----------+------------+-------------||
  2 | visit1 |    100   |    200    | 2000-09-17 18:11:17.5 | 2000-09-17 20:11:17.5 |   f        |       1   |      >>|             |    1     |   memo1    | memoC1
  3 | visit2 |    300   |    250    | 2000-05-17 18:11:17.5 | 2000-06-17 20:11:17.5 |   f        |       2   |>>|             |    2     |   memo2    | memoC2
  4 | visit3 |    305   |    257    | 2000-06-18 18:11:17.5 | 2000-06-19 20:11:17.5 |   f        |       3   | >>|             |    3     |   memo3    | memoC3

memo_img
--------
0 record
