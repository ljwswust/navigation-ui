/**
 * 密码加密功能测试文件
 * 在浏览器控制台中运行这些测试
 */

// 测试1: 验证加密工具函数
import { 
  hashPasswordWithSalt,
  encryptPassword,
  validatePasswordStrength,
  generateSecurePassword 
} from '@/lib/crypto'

// 添加到 window 对象以便在控制台访问
if (typeof window !== 'undefined') {
  window.testPasswordSecurity = {
    // 测试哈希功能
    testHashing: () => {
      const password = 'TestPassword123!'
      const email = 'test@example.com'
      const hash1 = hashPasswordWithSalt(password, email)
      const hash2 = hashPasswordWithSalt(password, email)
      
      console.log('🔐 哈希测试:')
      console.log('原始密码:', password)
      console.log('哈希值1:', hash1)
      console.log('哈希值2:', hash2)
      console.log('一致性检查:', hash1 === hash2 ? '✅ 通过' : '❌ 失败')
      
      return hash1 === hash2
    },

    // 测试加密功能
    testEncryption: () => {
      const password = 'TestPassword123!'
      const encrypted = encryptPassword(password)
      
      console.log('🔒 加密测试:')
      console.log('原始密码:', password)
      console.log('加密结果:', encrypted)
      console.log('加密成功:', encrypted !== password ? '✅ 通过' : '❌ 失败')
      
      return encrypted !== password
    },

    // 测试密码强度验证
    testPasswordStrength: () => {
      const testPasswords = [
        'weak',           // 弱密码
        'StrongPass1!',   // 强密码
        '12345678',       // 纯数字
        'PASSWORD',       // 纯大写
        'Aa1!'            // 短但复杂
      ]

      console.log('💪 密码强度测试:')
      testPasswords.forEach(pwd => {
        const strength = validatePasswordStrength(pwd)
        console.log(`密码: "${pwd}"`)
        console.log(`  强度分数: ${strength.score}/5`)
        console.log(`  是否合格: ${strength.isValid ? '✅' : '❌'}`)
        console.log(`  要求检查:`, strength.requirements)
        console.log('---')
      })
      
      return true
    },

    // 测试安全密码生成
    testPasswordGeneration: () => {
      console.log('🎲 安全密码生成测试:')
      
      for (let i = 0; i < 3; i++) {
        const generated = generateSecurePassword(12)
        const strength = validatePasswordStrength(generated)
        console.log(`生成的密码 ${i + 1}: ${generated}`)
        console.log(`  强度分数: ${strength.score}/5`)
        console.log(`  是否合格: ${strength.isValid ? '✅' : '❌'}`)
      }
      
      return true
    },

    // 运行所有测试
    runAllTests: () => {
      console.log('🚀 开始密码安全功能测试...\n')
      
      const tests = [
        { name: '哈希功能', test: () => window.testPasswordSecurity.testHashing() },
        { name: '加密功能', test: () => window.testPasswordSecurity.testEncryption() },
        { name: '强度验证', test: () => window.testPasswordSecurity.testPasswordStrength() },
        { name: '密码生成', test: () => window.testPasswordSecurity.testPasswordGeneration() }
      ]

      let passed = 0
      let total = tests.length

      tests.forEach(({ name, test }) => {
        try {
          console.log(`\n📋 测试: ${name}`)
          const result = test()
          if (result) {
            console.log(`✅ ${name} - 通过`)
            passed++
          } else {
            console.log(`❌ ${name} - 失败`)
          }
        } catch (error) {
          console.log(`💥 ${name} - 错误:`, error)
        }
      })

      console.log(`\n🎯 测试总结: ${passed}/${total} 通过`)
      console.log(passed === total ? '🎉 所有测试通过！' : '⚠️ 部分测试失败')
      
      return passed === total
    },

    // 测试环境配置
    checkConfig: () => {
      console.log('⚙️ 环境配置检查:')
      console.log('加密模式:', process.env.NEXT_PUBLIC_ENCRYPTION_MODE)
      console.log('密钥是否存在:', !!process.env.NEXT_PUBLIC_ENCRYPTION_KEY)
      console.log('密钥长度:', process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.length)
      console.log('最小密码长度:', process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH)
      console.log('强度验证启用:', process.env.NEXT_PUBLIC_ENABLE_PASSWORD_STRENGTH)
    }
  }

  // 自动运行配置检查
  setTimeout(() => {
    console.log('🔐 密码安全功能已加载！')
    console.log('运行 window.testPasswordSecurity.runAllTests() 开始测试')
    console.log('或运行 window.testPasswordSecurity.checkConfig() 检查配置')
  }, 1000)
}

export default function TestPage() {
  return null // 这个组件不需要渲染
}