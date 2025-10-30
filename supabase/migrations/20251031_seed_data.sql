-- CineVerse Seed Data
-- Version: 3.0
-- Date: 2025-10-31

-- =====================================================
-- SAMPLE MOVIES
-- =====================================================
INSERT INTO movies (title, original_title, year, rating, runtime, synopsis, genres, director, status) VALUES
('Yedinci Mühür', 'Det sjunde inseglet', 1957, 5.0, 96, 'Orta Çağ''da geçen varoluşçu bir başyapıt. Bir şövalye, Ölüm ile satranç oynar.', ARRAY['Drama', 'Fantasy'], 'Ingmar Bergman', 'published'),
('Blade Runner 2049', 'Blade Runner 2049', 2017, 4.8, 164, 'Distopik bir gelecekte, yeni bir blade runner eski bir sırrı ortaya çıkarır.', ARRAY['Sci-Fi', 'Thriller'], 'Denis Villeneuve', 'published'),
('Parasite', '기생충', 2019, 4.9, 132, 'Fakir bir aile, zengin bir ailenin evine sızar. Sosyal sınıf farkları üzerine keskin bir eleştiri.', ARRAY['Drama', 'Thriller'], 'Bong Joon-ho', 'published'),
('Mulholland Drive', 'Mulholland Drive', 2001, 4.7, 147, 'David Lynch''in sürrealist başyapıtı. Hollywood''un karanlık yüzü.', ARRAY['Mystery', 'Thriller'], 'David Lynch', 'published'),
('Her', 'Her', 2013, 4.6, 126, 'Yapay zeka ile aşk hikayesi. Yalnızlık ve bağlantı üzerine modern bir masal.', ARRAY['Romance', 'Sci-Fi'], 'Spike Jonze', 'published'),
('The Grand Budapest Hotel', 'The Grand Budapest Hotel', 2014, 4.5, 99, 'Wes Anderson''ın görsel şöleni. Bir otelin ve görevlisinin maceraları.', ARRAY['Comedy', 'Drama'], 'Wes Anderson', 'published');

-- =====================================================
-- SAMPLE PROFILES
-- =====================================================
INSERT INTO profiles (name, bio, role, birth_date, birth_place, status) VALUES
('Ingmar Bergman', 'İsveçli yönetmen ve senarist. Varoluşçu temaları işleyen sinema ustası.', 'director', '1918-07-14', 'Uppsala, İsveç', 'published'),
('Denis Villeneuve', 'Kanadalı yönetmen. Bilim kurgu ve gerilim filmlerinin modern ustası.', 'director', '1967-10-03', 'Trois-Rivières, Kanada', 'published'),
('Bong Joon-ho', 'Güney Koreli yönetmen. Sosyal eleştiri ve tür karışımının ustası.', 'director', '1969-09-14', 'Daegu, Güney Kore', 'published'),
('David Lynch', 'Amerikalı yönetmen. Sürrealizm ve gizemli anlatımın öncüsü.', 'director', '1946-01-20', 'Missoula, Montana', 'published'),
('Spike Jonze', 'Amerikalı yönetmen. Duygusal ve yaratıcı hikaye anlatımı.', 'director', '1969-10-22', 'Rockville, Maryland', 'published'),
('Wes Anderson', 'Amerikalı yönetmen. Simetrik kompozisyon ve pastel renklerin ustası.', 'director', '1969-05-01', 'Houston, Texas', 'published'),
('Ryan Gosling', 'Kanadalı aktör. Blade Runner 2049 ve Drive gibi filmlerde rol aldı.', 'actor', '1980-11-12', 'London, Ontario', 'published'),
('Scarlett Johansson', 'Amerikalı aktris. Her filminde yapay zeka karakterine ses verdi.', 'actor', '1984-11-22', 'New York, ABD', 'published');

-- =====================================================
-- SAMPLE NEWS
-- =====================================================
INSERT INTO news (title, slug, excerpt, content, category, tags, status) VALUES
('Yeni Villeneuve Filmi Duyuruldu', 'yeni-villeneuve-filmi-duyuruldu', 'Denis Villeneuve''ın yeni bilim kurgu projesi resmen açıklandı.', 'Denis Villeneuve, Dune serisinin ardından yeni bir bilim kurgu projesine başlıyor. Detaylar yakında...', 'news', ARRAY['Denis Villeneuve', 'Sci-Fi', 'Duyuru'], 'published'),
('Cannes 2025 Kazananları', 'cannes-2025-kazananlari', 'Cannes Film Festivali''nde bu yılın kazananları belli oldu.', 'Cannes Film Festivali''nde Altın Palmiye ödülü... (devamı)', 'news', ARRAY['Cannes', 'Ödüller', 'Festival'], 'published'),
('Blade Runner 2049 İncelemesi', 'blade-runner-2049-incelemesi', 'Denis Villeneuve''ın görsel şaheseri üzerine detaylı bir inceleme.', 'Blade Runner 2049, orijinal filmin ruhunu korurken modern bir başyapıt sunuyor...', 'review', ARRAY['Blade Runner', 'Denis Villeneuve', 'İnceleme'], 'published');

-- =====================================================
-- SAMPLE LISTS
-- =====================================================
INSERT INTO lists (title, slug, description, category, curator, status) VALUES
('En İyi Bilim Kurgu Filmleri', 'en-iyi-bilim-kurgu-filmleri', 'Tüm zamanların en etkileyici bilim kurgu başyapıtları.', 'sci-fi', 'CineVerse Editörleri', 'published'),
('Kült Klasikler', 'kult-klasikler', 'Zamanla kült haline gelmiş unutulmaz filmler.', 'cult', 'CineVerse Editörleri', 'published'),
('Varoluşçu Sinema', 'varoluscu-sinema', 'Hayatın anlamını sorgulayan derin filmler.', 'classic', 'CineVerse Editörleri', 'published');

-- Note: movie_ids will need to be updated with actual UUIDs after movies are inserted
-- This can be done with a separate UPDATE query or through the application
