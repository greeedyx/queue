# 贡献指南

感谢您对 `greedyx/queue` 项目的贡献！在提交 Pull Request 或 Issue 之前，请仔细阅读以下指南。

## 提交 Issue

1. **确认问题**：在提交 Issue 之前，请确认问题是否已经存在或已被讨论。
2. **提供信息**：请提供清晰的描述、复现步骤和错误日志（如有）。
3. **标签分类**：根据问题类型添加合适的标签（如 bug、feature、enhancement）。

## 提交 Pull Request

1. **分支管理**：
   - 请基于 `main` 分支创建您的功能或修复分支。
   - 提交前请确保分支是最新的，并解决所有冲突。
2. **代码规范**：
   - 遵循项目中的代码风格和命名规范。
   - 确保添加适当的注释和文档。
3. **测试**：
   - 提供单元测试以验证您的修改。
   - 确保现有测试通过。
4. **提交信息**：
   - 使用清晰、简洁的提交信息。
   - 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。
5. **审查流程**：
   - 提交 PR 后，维护者将进行代码审查。
   - 请根据反馈进行修改并重新提交。

## 开发流程

1. **克隆仓库**：
   ```shell
   git clone https://github.com/greedyx/queue.git
   ```
2. **安装依赖**：
   ```shell
   cd queue
   pnpm install
   ```
3. **开发**：
   - 在 `src` 目录下进行代码修改。
   - 运行测试：
     ```shell
     pnpm test
     ```
4. **构建**：
   ```shell
   pnpm build
   ```

## 联系我们

如果您有任何问题或建议，请提交 Issue 或联系项目维护者。

再次感谢您的贡献！