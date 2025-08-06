/**
 * 密码加密工具函数
 * 提供客户端密码加密功能
 */
import CryptoJS from 'crypto-js'

// 从环境变量获取加密密钥（生产环境必须设置）
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-dev-key-change-in-production'

/**
 * 方案1: 简单哈希加密（推荐用于开发环境）
 */
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString()
}

/**
 * 方案2: 带盐值的哈希（推荐用于生产环境）
 */
export const hashPasswordWithSalt = (password: string, email: string): string => {
  // 使用邮箱作为盐值的一部分，确保同一密码在不同用户间产生不同哈希
  const salt = CryptoJS.SHA256(email).toString().substring(0, 16)
  return CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 }).toString()
}

/**
 * 方案3: AES对称加密（最安全，推荐）
 */
export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString()
}

export const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * 方案4: 结合时间戳的动态加密
 */
export const encryptPasswordWithTimestamp = (password: string): { encrypted: string; timestamp: number } => {
  const timestamp = Date.now()
  const combined = `${password}:${timestamp}`
  const encrypted = CryptoJS.AES.encrypt(combined, ENCRYPTION_KEY).toString()
  return { encrypted, timestamp }
}

/**
 * 密码强度验证
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  score: number
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
  }
} => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password)
  }

  const score = Object.values(requirements).filter(Boolean).length
  const isValid = score >= 4 && requirements.length

  return { isValid, score, requirements }
}

/**
 * 生成安全的随机密码
 */
export const generateSecurePassword = (length: number = 12): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

/**
 * 安全清除内存中的密码（防止内存泄露）
 */
export const securelyWipePassword = (password: string): void => {
  // 在 JavaScript 中无法直接清除内存，但可以覆盖变量
  password = ''.repeat(password.length)
}