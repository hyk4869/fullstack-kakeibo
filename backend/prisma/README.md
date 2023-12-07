**DBのマイグレーション時に注意**

- `npx prisma migrate dev --name init`
  <br/>or
- `npx prisma migrate dev`

上記のいずれかを実行後、以下のフォルダにあるものを削除

- `node_modules\.prisma\client\query_engine-windows.dll.node`

次に以下を実行

- `npx prisma generate`
