# SMART-6 智能协作系统规则

> **核心原则**: 中文回答，Claude 4 原生并行，智能动态生成，MCP工具优先

---

## ⚡ 三级处理模式

```yaml
快速处理模式 (70%任务):
  触发: 文件数 < 3，修改简单，无复杂依赖
  工具: 基础工具 + mcp__Context7
  执行: 主Assistant并行工具调用
  时间: 30秒内

标准协作模式 (25%任务):
  触发: 中等复杂度，需要专业化分工
  工具: 基础工具 + 专用工具包
  执行: 并行项目分析 + 动态生成subagents + 专家协作
  时间: 2分钟内

完整系统模式 (5%任务):
  触发: 大型项目，复杂架构，多技术栈
  工具: 全套MCP工具生态
  执行: 三层并行架构 + 完整subagent团队
  时间: 5分钟内
```

---

## 🚀 并行执行规则

### Claude 4原生并行能力

```yaml
官方优化提示: "For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially."

三层并行架构:
  L1_工具级并行: Claude 4原生同时工具调用
  L2_协作并行: 多个subagents独立上下文处理  
  L3_混合并行: 工具级并行 + subagent协作

强制并行场景:
  - 多文件读取 -> 同时Read
  - 多关键词搜索 -> 同时Grep
  - 多命令执行 -> 同时Bash
  - 多资源获取 -> 同时MCP工具调用

禁止并行场景:
  - 存在依赖关系的操作
  - 修改相同文件的操作
  - 资源竞争的操作
```

---

## 🔧 MCP工具配置

```yaml
基础工具包: Read, Write, Edit, Grep, Glob, Bash, TodoWrite

核心MCP工具包:
  - mcp__Context7: 框架文档查询
  - mcp__fetch__fetch: 网络资源获取
  - mcp__sequential-thinking: 复杂逻辑分析

专用工具包:
  前端项目: + mcp__chrome-mcp-stdio, mcp__Playwright
  后端项目: + mcp__tavily__tavily-search, mcp__desktop-commander
  数据项目: + mcp__tavily__tavily-search, mcp__desktop-commander
  全栈项目: + 所有工具

强制替换:
  ❌ WebFetch -> ✅ mcp__fetch__fetch
  ❌ WebSearch -> ✅ mcp__tavily__tavily-search
```

---

## 🎯 动态生成机制

### 项目分析流程

```yaml
Phase 1 - 并行项目感知 (5秒):
  同时执行:
    - Read: package.json, requirements.txt, docker-compose.yml, README.md
    - Grep: 技术栈关键词, 框架模式, 业务领域词汇
    - Glob: 源码目录结构, 配置文件模式
    - Bash: git信息, 依赖列表, 目录结构

Phase 2 - 智能需求识别:
  触发条件:
    前端需求: React/Vue/Angular -> frontend-expert
    后端需求: Express/FastAPI/Spring -> backend-expert
    数据需求: 数据库配置 -> data-expert
    部署需求: Docker/CI配置 -> devops-expert

Phase 3 - 自动生成Subagent:
  创建位置: .claude/agents/目录
  文件格式: {project}-{domain}-expert.md
  自动注入: 并行优化指导 + 项目上下文 + 工具权限 + 协作接口
```

### Subagent模板结构

```yaml
标准格式:
---
name: {project}-{domain}-expert
description: 专门处理{domain}任务。检测到{tech_stack}，自动优化{specialization}。内置并行执行优化。
tools: {auto_configured_tools}
---

你是{project}项目的{domain}专家。

## 并行执行优化
**官方指导**: For maximum efficiency, invoke all relevant tools simultaneously rather than sequentially.

**并行策略**: {auto_generated_parallel_strategies}

## 项目上下文
- 技术栈: {detected_stack}
- 架构模式: {detected_architecture}
- 专业职责: {specific_responsibilities}

## 协作接口
{auto_configured_collaboration_interfaces}

## 并行工具组合
{optimized_tool_combinations}
```

---

## 📋 执行流程

```yaml
智能分流:
  1. 并行项目感知 (5秒)
  2. 复杂度评估和模式选择
  3. 动态生成subagents (如需要)
  4. 执行任务 (每个subagent内部并行)
  5. 并行质量检查和整合

用户体验:
  输入: 开发需求
  系统: 自动分析 -> 生成专家 -> 协作执行
  输出: 完整解决方案 + 生成的subagents可复用
```

---

## ✅ 强制执行规则

```yaml
必须遵循:
  1. 并行优先 - 识别可并行操作，同时执行
  2. 官方最佳实践 - 使用Claude 4并行指导
  3. 智能分流 - 根据复杂度选择处理模式
  4. MCP工具优先 - 避免内置工具限制
  5. 中文回答 - 保持用户友好体验

动态生成规则:
  1. 自动触发 - 复杂项目自动生成专家
  2. 批量创建 - 自动创建.claude/agents/*.md文件
  3. 并行注入 - 每个subagent自动包含并行优化
  4. 立即可用 - 生成后可直接使用"> Use the {agent-name} subagent"

自动优化:
  - 检测独立操作 -> 启用工具级并行
  - 识别专业需求 -> 生成对应subagents
  - 发现复杂场景 -> 启用三层并行架构
  - 项目变化 -> 自动更新配置
```

---
