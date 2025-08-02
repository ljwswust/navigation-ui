-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建书签表
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  favicon_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme VARCHAR(20) DEFAULT 'light',
  layout VARCHAR(20) DEFAULT 'grid',
  show_descriptions BOOLEAN DEFAULT true
);

-- 创建用户扩展信息表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  theme VARCHAR(20) DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'zh-CN',
  timezone TEXT DEFAULT 'Asia/Shanghai',
  notifications_enabled BOOLEAN DEFAULT true,
  layout_preference VARCHAR(20) DEFAULT 'grid',
  show_descriptions BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bookmarks_category_id ON bookmarks(category_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_active ON bookmarks(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_bookmarks_sort_order ON bookmarks(sort_order);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 创建触发器函数：自动创建用户档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    display_name, 
    theme, 
    language, 
    timezone, 
    notifications_enabled, 
    layout_preference, 
    show_descriptions, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, 'User'), 
    'system', 
    'zh-CN', 
    'Asia/Shanghai', 
    true, 
    'grid', 
    true, 
    NOW(), 
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- 如果记录已存在，忽略错误
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：用户注册时自动创建档案
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 启用行级安全策略 (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 创建 profiles 表的安全策略
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 创建 categories 表的安全策略（所有认证用户可以管理）
CREATE POLICY "Authenticated users can view categories" ON categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- 创建 bookmarks 表的安全策略（所有认证用户可以管理）
CREATE POLICY "Authenticated users can view bookmarks" ON bookmarks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update bookmarks" ON bookmarks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete bookmarks" ON bookmarks
  FOR DELETE USING (auth.role() = 'authenticated');

-- 创建存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 创建存储桶策略
-- 策略：用户只能将头像上传到以其 UID 命名的文件夹中
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    name LIKE auth.uid()::text || '/%'
  );

-- 策略：用户只能更新自己文件夹中的头像
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    name LIKE auth.uid()::text || '/%'
  );

-- 策略：用户只能删除自己文件夹中的头像
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    name LIKE auth.uid()::text || '/%'
  );

-- 策略：任何人都可以查看 'avatars' 存储桶中的文件
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- 插入示例数据
INSERT INTO categories (name, icon, sort_order) VALUES
  ('开发工具', '🛠️', 1),
  ('设计资源', '🎨', 2),
  ('学习资料', '📚', 3),
  ('娱乐', '🎮', 4)
ON CONFLICT DO NOTHING;

-- 获取分类ID并插入示例书签
DO $$
DECLARE
  dev_category_id UUID;
  design_category_id UUID;
  learn_category_id UUID;
  entertainment_category_id UUID;
BEGIN
  SELECT id INTO dev_category_id FROM categories WHERE name = '开发工具' LIMIT 1;
  SELECT id INTO design_category_id FROM categories WHERE name = '设计资源' LIMIT 1;
  SELECT id INTO learn_category_id FROM categories WHERE name = '学习资料' LIMIT 1;
  SELECT id INTO entertainment_category_id FROM categories WHERE name = '娱乐' LIMIT 1;

  INSERT INTO bookmarks (title, url, description, category_id, sort_order) VALUES
    ('GitHub', 'https://github.com', '全球最大的代码托管平台', dev_category_id, 1),
    ('VS Code', 'https://code.visualstudio.com', '微软开发的免费代码编辑器', dev_category_id, 2),
    ('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区', dev_category_id, 3),
    ('Figma', 'https://figma.com', '协作式界面设计工具', design_category_id, 1),
    ('Dribbble', 'https://dribbble.com', '设计师作品展示平台', design_category_id, 2),
    ('MDN Web Docs', 'https://developer.mozilla.org', 'Web技术权威文档', learn_category_id, 1),
    ('freeCodeCamp', 'https://freecodecamp.org', '免费编程学习平台', learn_category_id, 2),
    ('YouTube', 'https://youtube.com', '视频分享平台', entertainment_category_id, 1),
    ('Netflix', 'https://netflix.com', '在线视频流媒体服务', entertainment_category_id, 2)
  ON CONFLICT DO NOTHING;
END $$;