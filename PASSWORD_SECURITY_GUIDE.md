# 🔐 密码安全与加密配置指南

> 为 Next.js + Supabase 项目提供多层密码安全保护

---

## 📋 目录

- [安全层级说明](#安全层级说明)
- [快速配置](#快速配置)
- [加密方案选择](#加密方案选择)
- [Supabase 内置安全机制](#supabase-内置安全机制)
- [配置说明](#配置说明)
- [使用方法](#使用方法)
- [安全最佳实践](#安全最佳实践)
- [故障排除](#故障排除)

---

## 🛡️ 安全层级说明

本项目提供**三层密码安全保护**：

### 第一层：传输层安全 (TLS)
- ✅ **HTTPS 加密** - 所有数据传输使用 TLS 1.3 加密
- ✅ **证书验证** - 防止中间人攻击
- ✅ **自动升级** - HTTP 请求自动升级到 HTTPS

### 第二层：客户端加密 (可选)
- 🔧 **AES-256 对称加密** - 传输前本地加密
- 🔧 **PBKDF2 哈希** - 带盐值的安全哈希
- 🔧 **动态时间戳** - 防重放攻击

### 第三层：Supabase 服务端安全
- ✅ **bcrypt 哈希** - 服务端密码哈希存储
- ✅ **行级安全 (RLS)** - 数据访问控制  
- ✅ **JWT 认证** - 安全令牌机制
- ✅ **速率限制** - 防暴力破解

---

## ⚡ 快速配置

### 1. 安装依赖

```bash
npm install crypto-js
npm install --save-dev @types/crypto-js
```

### 2. 配置环境变量

创建或更新 `.env.local`：

```env
# Supabase 配置 (必需)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 加密配置 (可选，推荐)
NEXT_PUBLIC_ENCRYPTION_KEY=your-super-secret-encryption-key-change-this-in-production
NEXT_PUBLIC_ENCRYPTION_MODE=hash  # 选项: hash, encrypt, none

# 安全配置 (可选)
NEXT_PUBLIC_PASSWORD_MIN_LENGTH=8
NEXT_PUBLIC_ENABLE_PASSWORD_STRENGTH=true
NEXT_PUBLIC_ENABLE_2FA=false
```

### 3. 更新 Layout 组件

```typescript
// src/app/layout.tsx
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <EnhancedAuthProvider>
          {children}
        </EnhancedAuthProvider>
      </body>
    </html>
  )
}
```

---

## 🔄 加密方案选择

### 方案一：哈希加密 (推荐)
**适用场景**: 大多数生产环境

```typescript
// 配置
NEXT_PUBLIC_ENCRYPTION_MODE=hash

// 特点
✅ 不可逆加密，安全性高
✅ 带盐值，防彩虹表攻击
✅ 性能优异，速度快
⚠️ 无法解密，只能验证
```

### 方案二：对称加密
**适用场景**: 需要密码解密的特殊情况

```typescript
// 配置
NEXT_PUBLIC_ENCRYPTION_MODE=encrypt

// 特点
✅ 可逆加密，支持解密
✅ AES-256 强加密算法
⚠️ 需要妥善保管密钥
⚠️ 性能开销稍高
```

### 方案三：无加密 (仅开发环境)
**适用场景**: 开发和调试

```typescript
// 配置
NEXT_PUBLIC_ENCRYPTION_MODE=none

// 特点
✅ 调试方便，无额外处理
❌ 安全性完全依赖 HTTPS
❌ 不推荐生产环境使用
```

---

## 🏢 Supabase 内置安全机制

### 认证安全
```sql
-- Supabase 自动处理的安全机制

-- 1. 密码哈希 (bcrypt + salt)
-- 用户密码使用 bcrypt 算法加密存储，加盐值防止彩虹表攻击

-- 2. JWT 令牌
-- 访问令牌有效期限制，自动刷新机制

-- 3. 会话管理
-- 安全的会话存储，支持多设备登录管理
```

### 数据库安全策略
```sql
-- 行级安全策略示例

-- 用户只能访问自己的数据
CREATE POLICY "users_own_data" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 认证用户才能操作书签
CREATE POLICY "authenticated_bookmarks" ON bookmarks
  FOR ALL USING (auth.role() = 'authenticated');

-- 防止 SQL 注入
-- Supabase 自动处理参数化查询
```

### 网络安全
```typescript
// Supabase 网络安全配置

const supabase = createClient(url, key, {
  auth: {
    // 自动刷新令牌
    autoRefreshToken: true,
    
    // 持久化会话（安全存储）
    persistSession: true,
    
    // 检测 URL 中的会话信息
    detectSessionInUrl: true,
    
    // 存储配置（仅客户端）
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  
  // 全局配置
  global: {
    headers: {
      // 自定义安全头
      'X-Client-Info': 'your-app-name'
    }
  }
})
```

---

## ⚙️ 配置说明

### 加密密钥生成

```typescript
// 生成安全的加密密钥
const generateEncryptionKey = () => {
  return require('crypto').randomBytes(32).toString('hex')
}

// 或使用在线工具生成
// https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 环境变量详解

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NEXT_PUBLIC_ENCRYPTION_KEY` | 生产环境必需 | - | AES 加密密钥 |
| `NEXT_PUBLIC_ENCRYPTION_MODE` | 否 | `hash` | 加密模式选择 |
| `NEXT_PUBLIC_PASSWORD_MIN_LENGTH` | 否 | `8` | 最小密码长度 |
| `NEXT_PUBLIC_ENABLE_PASSWORD_STRENGTH` | 否 | `true` | 启用强度验证 |

### 生产环境配置

```bash
# 生产环境 .env.production
NEXT_PUBLIC_ENCRYPTION_MODE=hash
NEXT_PUBLIC_ENCRYPTION_KEY=your-64-character-hex-key-here
NEXT_PUBLIC_PASSWORD_MIN_LENGTH=12
NEXT_PUBLIC_ENABLE_PASSWORD_STRENGTH=true

# 确保密钥安全
# 1. 使用强随机生成的密钥
# 2. 定期轮换密钥
# 3. 不要在代码中硬编码
# 4. 使用环境变量管理
```

---

## 🎯 使用方法

### 基础使用

```typescript
// 1. 替换认证 Provider
import { EnhancedAuthProvider } from '@/components/EnhancedAuthProvider'

// 2. 使用增强认证 Hook
import { useEnhancedAuth } from '@/components/EnhancedAuthProvider'

function MyComponent() {
  const { signIn, signUp, validatePassword } = useEnhancedAuth()
  
  // 带加密的登录
  await signIn(email, password, true)  // true = 启用加密
  
  // 密码强度验证
  const strength = validatePassword(password)
  console.log(strength.isValid) // true/false
}
```

### 高级使用

```typescript
// 手动使用加密工具
import { 
  hashPasswordWithSalt,
  encryptPassword,
  validatePasswordStrength,
  generateSecurePassword 
} from '@/lib/crypto'

// 哈希密码
const hashedPassword = hashPasswordWithSalt(password, email)

// 加密密码
const encryptedPassword = encryptPassword(password)

// 生成安全密码
const securePassword = generateSecurePassword(16)

// 验证密码强度
const strength = validatePasswordStrength(password)
```

### 组件集成

```typescript
// 使用增强版认证对话框
import { EnhancedAuthDialog } from '@/components/EnhancedAuthDialog'

function App() {
  return (
    <div>
      {showAuth && <EnhancedAuthDialog onClose={() => setShowAuth(false)} />}
    </div>
  )
}
```

---

## 🔒 安全最佳实践

### 开发环境
```typescript
// ✅ 推荐做法
const isDev = process.env.NODE_ENV === 'development'
const encryptionMode = isDev ? 'none' : 'hash'

// ❌ 避免做法
// 在开发环境中存储真实用户密码
// 在控制台输出敏感信息
// 硬编码加密密钥
```

### 生产环境
```typescript
// ✅ 安全检查清单

// 1. 启用 HTTPS
const isSecure = window.location.protocol === 'https:'

// 2. 验证环境变量
if (!process.env.NEXT_PUBLIC_ENCRYPTION_KEY) {
  throw new Error('Missing encryption key in production')
}

// 3. 强制密码复杂度
const minPasswordLength = 12
const requireSpecialChars = true

// 4. 实现密码过期策略
const maxPasswordAge = 90 * 24 * 60 * 60 * 1000 // 90天

// 5. 记录安全事件
const logSecurityEvent = (event: string, details: any) => {
  // 发送到安全监控系统
  console.log(`[SECURITY] ${event}:`, details)
}
```

### 密码策略建议

```typescript
// 推荐的密码策略
const passwordPolicy = {
  minLength: 12,              // 最少12位
  requireUppercase: true,     // 需要大写字母
  requireLowercase: true,     // 需要小写字母
  requireNumbers: true,       // 需要数字
  requireSymbols: true,       // 需要特殊字符
  maxAge: 90,                 // 90天过期
  preventReuse: 5,            // 防止重复使用最近5个密码
  lockoutThreshold: 5,        // 5次失败后锁定
  lockoutDuration: 30         // 锁定30分钟
}
```

### 监控和审计

```typescript
// 安全监控实现
const securityMonitor = {
  // 记录登录尝试
  logLoginAttempt: (email: string, success: boolean, ip?: string) => {
    const event = {
      type: 'login_attempt',
      email,
      success,
      ip,
      timestamp: new Date().toISOString()
    }
    // 发送到日志系统
    console.log('[AUDIT]', event)
  },

  // 检测异常登录
  detectSuspiciousActivity: (email: string) => {
    // 实现异常检测逻辑
    // 如：异地登录、频繁失败等
  },

  // 密码强度统计
  trackPasswordStrength: (strength: number) => {
    // 统计用户密码强度分布
  }
}
```

---

## 🔍 故障排除

### 常见问题

**Q: 加密后无法登录？**
```typescript
A: 检查加密模式配置
// 确保前后端使用相同的加密方式
// 如果切换了加密模式，需要重新注册用户
```

**Q: 环境变量不生效？**
```typescript
A: 检查变量名和重启服务
// 1. 确保变量名以 NEXT_PUBLIC_ 开头
// 2. 重启开发服务器
// 3. 清除 .next 缓存
```

**Q: 密码强度验证过于严格？**
```typescript
A: 调整验证规则
// 在 crypto.ts 中修改 validatePasswordStrength 函数
// 或通过环境变量配置最小要求
```

### 调试工具

```typescript
// 调试加密功能
const debugCrypto = {
  testEncryption: (password: string) => {
    console.log('原始密码:', password)
    console.log('哈希结果:', hashPasswordWithSalt(password, 'test@example.com'))
    console.log('加密结果:', encryptPassword(password))
    console.log('强度检查:', validatePasswordStrength(password))
  },

  validateConfig: () => {
    console.log('加密配置:', {
      mode: process.env.NEXT_PUBLIC_ENCRYPTION_MODE,
      hasKey: !!process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
      keyLength: process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.length
    })
  }
}

// 在开发环境中使用
if (process.env.NODE_ENV === 'development') {
  window.debugCrypto = debugCrypto
}
```

### 性能优化

```typescript
// 异步加密处理
const encryptPasswordAsync = async (password: string): Promise<string> => {
  return new Promise((resolve) => {
    // 使用 Web Worker 或 setTimeout 避免阻塞 UI
    setTimeout(() => {
      resolve(encryptPassword(password))
    }, 0)
  })
}

// 密码强度检查防抖
import { debounce } from 'lodash'

const debouncedPasswordCheck = debounce((password: string, callback: Function) => {
  const strength = validatePasswordStrength(password)
  callback(strength)
}, 300)
```

---

## 📚 参考资源

- **加密算法**: [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- **密码安全**: [OWASP Password Guidelines](https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html)
- **Supabase 安全**: [Supabase Security Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- **Next.js 安全**: [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

## 🎉 总结

通过本配置指南，你的项目现在具备：

1. ✅ **多层安全保护** - 传输层 + 应用层 + 数据库层
2. ✅ **灵活配置选项** - 支持不同安全级别需求  
3. ✅ **强密码策略** - 自动验证和强度检查
4. ✅ **用户体验优化** - 安全与易用性的平衡
5. ✅ **生产环境就绪** - 完整的监控和审计功能

**下一步建议**:
- 根据业务需求选择合适的加密方案
- 定期更新加密密钥和安全策略
- 监控安全事件和用户行为
- 持续优化性能和用户体验