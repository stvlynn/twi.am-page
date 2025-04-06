# Twi.am Official Site

This is the official site for Twi.am.

## Sites

- [Twi.am](https://twi.am)
  - [MBTI Receipt](https://mbti.twi.am)
  - [Twitter Instant Portrait](https://portrait.twi.am)

## License

[MIT License](./LICENSE)

## Twitter登录功能

本网站集成了Twitter (X) OAuth登录功能。用户可以通过点击右上角的头像图标使用Twitter账号登录。登录后，头像将显示用户的Twitter个人资料图片。

### 设置

1. 在[Twitter开发者平台](https://developer.twitter.com/)创建一个应用
2. 获取OAuth 2.0客户端ID和密钥
3. 将回调URL设置为`https://your-domain.com/api/auth/twitter/callback`
4. 复制`.env.local.example`为`.env.local`并填入你的Twitter API密钥:

```
# 应用URL配置
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Twitter OAuth配置
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback
```

### 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入该仓库
3. 在Vercel项目设置中添加环境变量:
   - `NEXT_PUBLIC_APP_URL`: 你的网站域名（例如 https://your-domain.com）
   - `TWITTER_CLIENT_ID`: 你的Twitter客户端ID
   - `TWITTER_CLIENT_SECRET`: 你的Twitter客户端密钥
4. 完成部署

### 使用Cloudflare Workers (可选)

如果你希望使用Cloudflare Workers处理OAuth流程而不是使用Next.js API路由，请参考`cloudflare-worker.js.example`文件。但在大多数情况下，直接使用Next.js API路由并部署到Vercel已经足够。