-- =============================================
-- Campus Merch Platform — Seed Data
-- =============================================

USE campus_merch;

-- ── Products ──────────────────────────────────
INSERT INTO products (name, price, category, badge, image_url) VALUES
  ('Campus Hoodie', 999.00, 'Apparel', 'Bestseller', 'campus hoodie.jfif'),
  ('Campus T-Shirt', 299.00, 'Apparel', '', 'campus tshirt.jfif'),
  ('Campus Cap', 199.00, 'Accessories', 'New', 'campus cap.jfif'),
  ('College Notebook', 99.00, 'Stationery', '', 'notebook-removebg-preview.png'),
  ('Tote Bag', 249.00, 'Accessories', '', 'totebag.jfif'),
  ('Sticker Pack', 89.00, 'Stationery', 'Popular', 'stickers.jfif'),
  ('Custom ID Straps', 159.00, 'Accessories', 'Customizable', 'custom_id_straps-removebg-preview.png'),
  ('Duty Badges', 199.00, 'Accessories', 'New', 'badge1.png');

-- ── Clubs ─────────────────────────────────────
INSERT INTO clubs (name, icon, description, tags) VALUES
  ('Sports Club', '⚽', 'All sports facilities — custom jerseys, track pants, and sports tees for your team.', '["Jerseys", "Sports Tees", "Track Wear"]'),
  ('Tech Nexus Club', '🔬', 'Science & tech enthusiasts — tees with formulas, laws, and science humor.', '["Formula Tees", "Science Humor", "Club Hoodies"]'),
  ('Melange Club', '🎨', 'Fashion Designing Club — special event uniforms, runway outfits, branded apparel.', '["Event Uniforms", "Custom Outfits", "Club Apparel"]'),
  ('Cultural Club', '🎭', 'Dance & singing club — matching performance tees, stage outfits, team merch.', '["Performance Tees", "Stage Outfits", "Team Merch"]'),
  ('MUN Club', '🏛️', 'Model United Nations — custom badges, delegate tees, anchor shirts, and conference kits.', '["MUN Badges", "Anchor Tees", "Delegate Kits"]'),
  ('Mediaverse Club', '📸', 'Shoots, exhibitions & reels — custom tees, hoodies, and branded camera straps.', '["Club Tees", "Photo Hoodies", "Camera Straps"]'),
  ('Management Club', '🎵', 'Printed T-shirts, Caps, Customized Stationary and many more.', '["Band Tees", "Concert Merch", "Hoodies"]'),
  ('Environmental Club', '📝', 'Reusable Items, Customized Tote Bags, Eco-Friendly Stationary and Plant-Based Merch.', '["Debate Tees", "Fest Merch", "Notebooks"]'),
  ('Dr. APJ Abdul Kalam Science Society', '🤝', 'Quantum Hoodie, Funny Quotes Tshirts, Cosmic Caps and many more.', '["Volunteer Tees", "Campaign Merch", "Caps"]'),
  ('DIA Club', '🎮', 'Designer T-Shirts, SketchBooks and Tote Bags.', '["Laptop Stickers", "Exhibition Badges", "Mousepads"]'),
  ('Chetna Society', '🧘', 'Inspirational T-Shirts, Wrist Bands and many more.', '["Volunteer Jackets", "Event Badges", "Accessories"]'),
  ('Health Society', '🎬', 'Awareness Tshirts, Volunteer Vests, etc.', '["Crew Tees", "Water Bottles", "Headbands"]');
